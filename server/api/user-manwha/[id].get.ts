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

    const manwhaDoc = (await manwhasCollection.findOne({ id: manwhaId })) as Manwha | null;
    let manwhaData: Manwha | null;

    if (!manwhaDoc) {
      manwhaData = await fetchAniListDetails(manwhaId);

      if (!manwhaData) {
        throw createError({
          statusCode: 404,
          message: 'Manwha not found',
        });
      }
    } else {
      manwhaData = manwhaDoc;
    }

    const now = new Date();
    let suggestedUrl: string | null = null;

    if (!userManwhaDoc?.readingUrl) {
      suggestedUrl = await suggestReadingUrl(manwhaData.title);

      if (!suggestedUrl && manwhaData.alternativeTitles.length > 0) {
        suggestedUrl = await suggestReadingUrl(manwhaData.alternativeTitles[0]);
      }
    }

    const response: UserManwha = {
      id: userManwhaDoc?._id.toString() || '',
      userId: user.id,
      manwha: {
        id: manwhaData.id,
        title: manwhaData.title,
        bannerImage: manwhaData.bannerImage,
        coverImage: manwhaData.coverImage,
        meanScore: manwhaData.meanScore,
        description: manwhaData.description,
        alternativeTitles: manwhaData.alternativeTitles,
        genres: manwhaData.genres,
        tags: manwhaData.tags,
        startDate: manwhaData.startDate,
        lastAvailableChapter: manwhaData.lastAvailableChapter,
      },
      status: userManwhaDoc?.status || 'reading',
      rating: userManwhaDoc?.rating || null,
      lastReadChapter: userManwhaDoc?.lastReadChapter ?? 0,
      readingUrl: userManwhaDoc?.readingUrl || suggestedUrl,
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
