import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { getUsersCollection } from "$lib/database";
import { comparePassword } from "$lib/auth";
import { generateToken } from "$lib/jwt";

interface LoginRequest {
  email: string;
  password: string;
}

export const POST: RequestHandler = async (
  { request }: { request: Request },
) => {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return json({ error: "Email and password are required" }, {
        status: 400,
      });
    }

    const usersCollection = await getUsersCollection();

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      username: user.username,
      email: user.email,
    });

    // Set cookie and return success
    const response = json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
      },
    });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict`,
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
