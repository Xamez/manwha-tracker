import { SignJWT, jwtVerify } from 'jose';

const config = useRuntimeConfig();
const secret = new TextEncoder().encode(config.jwtSecret);

export async function createToken(user: User): Promise<string> {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as User;
  } catch (err) {
    console.error('Invalid token');
    return null;
  }
}
