import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  const user = event.context.user;

  try {
    const db = useDatabase();
    const userManwhasCollection = db.collection('user_manwhas');

    const userManwhaDocs = await userManwhasCollection
      .find({
        userId: ObjectId.createFromHexString(user.id),
      })
      .toArray();

    const response: UserManwha[] = userManwhaDocs.map(doc => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      manwha: doc.manwha as Manwha,
      status: doc.status,
      score: doc.score,
      lastReadChapter: doc.lastReadChapter,
      readingUrl: doc.readingUrl,
      isFavorite: doc.isFavorite,
      startedAt: doc.startedAt,
      lastReadAt: doc.lastReadAt,
    }));

    return response;
  } catch (error) {
    console.error('Failed to fetch user manwhas:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user manwhas',
    });
  }
});
