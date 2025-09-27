import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getUsersCollection, type User } from '../../../../lib/database.ts';
import { hashPassword } from '../../../../lib/auth.ts';
import { generateToken } from '../../../../lib/jwt.ts';

interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
	return password.length >= 8;
}

function isValidUsername(username: string): boolean {
	return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
}

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	try {
		const body: RegisterRequest = await request.json();
		const { username, email, password } = body;

		// Validate input
		if (!username || !email || !password) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		if (!isValidUsername(username)) {
			return json({ 
				error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' 
			}, { status: 400 });
		}

		if (!isValidEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		if (!isValidPassword(password)) {
			return json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
		}

		const usersCollection = await getUsersCollection();

		// Check if user already exists
		const existingUser = await usersCollection.findOne({
			$or: [{ email }, { username }]
		});

		if (existingUser) {
			return json({ 
				error: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
			}, { status: 409 });
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create user
		const now = new Date();
		const newUser = {
			username,
			email,
			password: hashedPassword,
			createdAt: now,
			updatedAt: now
		};

		const result = await usersCollection.insertOne(newUser as User);
		
		if (!result.insertedId) {
			return json({ error: 'Failed to create user' }, { status: 500 });
		}

		// Generate JWT token
		const token = generateToken({
			userId: result.insertedId.toString(),
			username,
			email
		});

		// Set cookie and return success
		const response = json({ 
			message: 'User registered successfully',
			user: { username, email }
		}, { status: 201 });

		response.headers.set('Set-Cookie', 
			`token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
		);

		return response;

	} catch (error) {
		console.error('Registration error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};