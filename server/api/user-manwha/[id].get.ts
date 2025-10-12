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
    const manwhasCollection = db.collection('manwhas');

    const userManwhaDoc = await userManwhasCollection.findOne({
      userId: ObjectId.createFromHexString(user.id),
      manwhaId,
    });

    let manwhaDoc = await manwhasCollection.findOne({ id: manwhaId });

    if (!manwhaDoc) {
      const manwhaDetails = await fetchAniListDetails(manwhaId);

      if (!manwhaDetails) {
        throw createError({
          statusCode: 404,
          message: 'Manwha not found on AniList',
        });
      }

      const now = new Date();
      const newManwha = {
        ...manwhaDetails,
        updatedAt: now,
        createdAt: now,
      };

      const insertResult = await manwhasCollection.insertOne(newManwha);
      manwhaDoc = { ...newManwha, _id: insertResult.insertedId };
    }

    if (!manwhaDoc) {
      throw createError({
        statusCode: 404,
        message: 'Manwha not found',
      });
    }

    const now = new Date();
    const response: UserManwha = {
      id: userManwhaDoc?._id.toString() || '',
      userId: user.id,
      manwha: {
        id: manwhaDoc.id,
        title: manwhaDoc.title,
        bannerImage: manwhaDoc.bannerImage,
        coverImage: manwhaDoc.coverImage,
        meanScore: manwhaDoc.meanScore,
        description: manwhaDoc.description,
        synonyms: manwhaDoc.synonyms,
        genres: manwhaDoc.genres,
        tags: manwhaDoc.tags,
        startDate: manwhaDoc.startDate,
      } as Manwha,
      status: userManwhaDoc?.status || 'reading',
      rating: userManwhaDoc?.rating || null,
      lastReadChapter: userManwhaDoc?.lastReadChapter ?? 0,
      readingUrl: userManwhaDoc?.readingUrl || null,
      isFavorite: userManwhaDoc?.isFavorite || false,
      startedAt: userManwhaDoc?.startedAt || now,
      updatedAt: userManwhaDoc?.updatedAt || now,
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
