import jwt from 'jsonwebtoken';

export function createToken(user: User) {
  const config = useRuntimeConfig();
  const secret = config.jwtSecret;
  const token = jwt.sign(user, secret, { expiresIn: '7d' });
  return token;
}

export function verifyToken(token: string): User | null {
  const config = useRuntimeConfig();
  const secret = config.jwtSecret;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as User;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
