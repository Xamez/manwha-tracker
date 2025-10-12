export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    return null;
  }
  return await verifyToken(token);
});
