import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  const user = event.context.user;

  try {
    const db = useDatabase();
    const userManwhasCollection = db.collection('user_manwhas');
    const manwhasCollection = db.collection('manwhas');

    const userManwhaDocs = await userManwhasCollection
      .find({
        userId: ObjectId.createFromHexString(user.id),
      })
      .toArray();

    const manwhaIds = userManwhaDocs.map(doc => doc.manwhaId);
    const manwhaDocs = await manwhasCollection
      .find({
        id: { $in: manwhaIds },
      })
      .toArray();

    const manwhaMap = new Map(manwhaDocs.map(doc => [doc.id, doc]));

    const response: UserManwha[] = userManwhaDocs.map(doc => {
      const manwhaDoc = manwhaMap.get(doc.manwhaId);

      if (!manwhaDoc) {
        throw new Error(`Manwha ${doc.manwhaId} not found`);
      }

      return {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
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
        status: doc.status,
        score: doc.score,
        lastReadChapter: doc.lastReadChapter,
        readingUrl: doc.readingUrl,
        isFavorite: doc.isFavorite,
        startedAt: doc.startedAt,
        lastReadAt: doc.lastReadAt,
      };
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch user manwhas:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user manwhas',
    });
  }
});
