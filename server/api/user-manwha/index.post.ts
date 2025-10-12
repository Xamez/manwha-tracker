import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  const user = event.context.user;
  const userManwha = (await readBody(event)) as UserManwha;

  if (!userManwha.manwha.id) {
    throw createError({
      statusCode: 400,
      message: 'Manwha data is required',
    });
  }

  try {
    const db = useDatabase();
    const userManwhasCollection = db.collection('user_manwhas');
    const manwhasCollection = db.collection('manwhas');

    const manwhaId = userManwha.manwha.id;
    const now = new Date();

    // Check if manwha exists in database, if not, store it
    const manwhaDoc = await manwhasCollection.findOne({ id: manwhaId });

    if (!manwhaDoc) {
      // Fetch from AniList and store
      const manwhaDetails = await fetchAniListDetails(manwhaId);

      if (!manwhaDetails) {
        throw createError({
          statusCode: 404,
          message: 'Manwha not found on AniList',
        });
      }

      const newManwha = {
        ...manwhaDetails,
        updatedAt: now,
        createdAt: now,
      };

      await manwhasCollection.insertOne(newManwha);
    }

    const userManwhaData = {
      userId: ObjectId.createFromHexString(user.id),
      manwhaId,
      status: userManwha.status,
      rating: userManwha.rating,
      lastReadChapter: userManwha.lastReadChapter,
      readingUrl: userManwha.readingUrl,
      isFavorite: userManwha.isFavorite,
      startedAt: new Date(userManwha.startedAt),
      lastReadAt: now,
      updatedAt: now,
    };

    const result = await userManwhasCollection.findOneAndUpdate(
      { userId: ObjectId.createFromHexString(user.id), manwhaId },
      { $set: userManwhaData },
      { upsert: true, returnDocument: 'after' },
    );

    if (!result) {
      throw createError({
        statusCode: 404,
        message: 'User manwha not found',
      });
    }

    const response: UserManwha = {
      id: result._id.toString(),
      userId: result.userId.toString(),
      manwha: userManwha.manwha,
      status: result.status,
      rating: result.rating,
      lastReadChapter: result.lastReadChapter,
      readingUrl: result.readingUrl,
      isFavorite: result.isFavorite,
      startedAt: result.startedAt,
      updatedAt: result.updatedAt,
    };

    return response;
  } catch (error) {
    console.error('Failed to update user manwha:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update user manwha',
    });
  }
});
