import { ObjectId } from 'mongodb';
import { scrapAndUpdateLastChapter } from '~~/server/utils/scraper';

export default defineEventHandler(async event => {
  const user = event.context.user;
  const userManhwa = (await readBody(event)) as UserManhwa;

  if (!userManhwa.manhwa.id) {
    throw createError({
      statusCode: 400,
      message: 'Manhwa data is required',
    });
  }

  try {
    const db = useDatabase();
    const userManhwasCollection = db.collection('user_manhwas');
    const manhwasCollection = db.collection('manhwas');

    const manhwaId = userManhwa.manhwa.id;
    const now = new Date();

    const manhwaDoc = await manhwasCollection.findOne({ id: manhwaId });

    if (!manhwaDoc) {
      const manhwaDetails = await fetchAniListDetails(manhwaId);

      if (!manhwaDetails) {
        throw createError({
          statusCode: 404,
          message: 'Manhwa not found on AniList',
        });
      }

      const newManhwa = {
        ...manhwaDetails,
        updatedAt: now,
        createdAt: now,
      };

      await manhwasCollection.insertOne(newManhwa);

      if (!userManhwa.readingUrl) return;

      await scrapAndUpdateLastChapter(
        db,
        manhwaId,
        userManhwa.readingUrl,
        userManhwa.lastReadChapter,
      );
    }

    const userManhwaData = {
      userId: ObjectId.createFromHexString(user.id),
      manhwaId,
      status: userManhwa.status,
      rating: userManhwa.rating,
      lastReadChapter: userManhwa.lastReadChapter,
      readingUrl: userManhwa.readingUrl,
      isFavorite: userManhwa.isFavorite,
      startedAt: new Date(userManhwa.startedAt),
      lastReadAt: now,
      updatedAt: now,
    };

    const result = await userManhwasCollection.findOneAndUpdate(
      { userId: ObjectId.createFromHexString(user.id), manhwaId },
      { $set: userManhwaData },
      { upsert: true, returnDocument: 'after' },
    );

    if (!result) {
      throw createError({
        statusCode: 404,
        message: 'User manhwa not found',
      });
    }

    const response: UserManhwa = {
      id: result._id.toString(),
      userId: result.userId.toString(),
      manhwa: userManhwa.manhwa,
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
    console.error('Failed to update user manhwa:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update user manhwa',
    });
  }
});
