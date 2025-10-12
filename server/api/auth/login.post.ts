export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' });
  }

  const db = useDatabase();

  const userDb = await db.collection('users').findOne({ email });
  if (!userDb) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
  }

  const isPasswordValid = await verifyPassword(password, userDb.password);
  if (!isPasswordValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
  }

  const user: User = { id: userDb._id.toString(), email: userDb.email, username: userDb.username };
  const token = await createToken(user);

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.public.env === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { user };
});
