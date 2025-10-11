import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  const user = event.context.user;
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Manwha ID is required',
    });
  }

  const manwhaId = Number(id);

  try {
    const db = useDatabase();
    const userManwhasCollection = db.collection('user_manwhas');

    let userManwhaDoc = await userManwhasCollection.findOne({
      userId: ObjectId.createFromHexString(user.id),
      manwhaId,
    });

    if (!userManwhaDoc) {
      const manwhaDetails = await fetchAniListDetails(manwhaId);

      if (!manwhaDetails) {
        throw createError({
          statusCode: 404,
          message: 'Manwha not found on AniList',
        });
      }

      const now = new Date();
      const newUserManwha = {
        userId: ObjectId.createFromHexString(user.id),
        manwhaId,
        manwha: manwhaDetails,
        status: 'reading',
        score: null,
        lastReadChapter: 0,
        readingUrl: null,
        isFavorite: false,
        startedAt: now,
        lastReadAt: now,
        createdAt: now,
        updatedAt: now,
      };

      const result = await userManwhasCollection.insertOne(newUserManwha);
      userManwhaDoc = { ...newUserManwha, _id: result.insertedId };
    }

    if (!userManwhaDoc) {
      throw new Error('Failed to retrieve user manwha');
    }

    const response: UserManwha = {
      id: userManwhaDoc._id.toString(),
      userId: userManwhaDoc.userId.toString(),
      manwha: userManwhaDoc.manwha as Manwha,
      status: userManwhaDoc.status,
      score: userManwhaDoc.score,
      lastReadChapter: userManwhaDoc.lastReadChapter,
      readingUrl: userManwhaDoc.readingUrl,
      isFavorite: userManwhaDoc.isFavorite,
      startedAt: userManwhaDoc.startedAt,
      lastReadAt: userManwhaDoc.lastReadAt,
    };

    return response;
  } catch (error) {
    console.error('Failed to fetch or create user manwha:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch or create user manwha',
    });
  }
});
