import { createToken } from "~~/server/utils/jwt";
import { useDatabase } from "~~/server/utils/mongodb";
import { verifyPassword } from "~~/server/utils/password";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); 
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' });
  }

  const db = useDatabase();
  
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
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
