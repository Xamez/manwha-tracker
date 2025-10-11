export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const { username, email, password } = await readBody(event);

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username, email and password are required',
    });
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

  const userDb = await db.collection('users').findOne({ _id: result.insertedId });
  if (!userDb) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' });
  }

  const user: User = { id: userDb._id.toString(), email: userDb.email, username: userDb.username };
  const token = createToken(user);

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.public.env === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { user };
});
