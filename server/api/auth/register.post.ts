import { createToken } from "~~/server/utils/jwt";
import { useDatabase } from "~~/server/utils/mongodb";
import { hashPassword } from "~~/server/utils/password";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { username, email, password } = await readBody(event);

  if (!username || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Username, email and password are required' });
  }

  const db = useDatabase();
  
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw createError({ statusCode: 409, statusMessage: 'User with this email already exists' });
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  const user = await db.collection('users').findOne({ _id: result.insertedId });
  if (!user) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' });
  }

  const token = createToken(user._id.toString());
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.public.env === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const userInfo = { id: user._id, email: user.email, username: user.username };

  return { user: userInfo };
})
