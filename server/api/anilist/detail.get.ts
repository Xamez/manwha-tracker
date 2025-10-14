export default defineEventHandler(async event => {
  const query = getQuery(event);
  const id = query.id ? parseInt(query.id as string) : null;

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid ID is required',
    });
  }

  return await fetchAniListDetails(id);
});
