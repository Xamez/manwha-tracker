import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  const user = event.context.user;
  const body = await readBody(event);
  const { manwhaId, isFavorite } = body;

  if (!manwhaId) {
    throw createError({
      statusCode: 400,
      message: 'Manwha ID is required',
    });
  }

  if (typeof isFavorite !== 'boolean') {
    throw createError({
      statusCode: 400,
      message: 'isFavorite must be a boolean',
    });
  }

  try {
    const db = useDatabase();
    const userManwhasCollection = db.collection('user_manwhas');

    const result = await userManwhasCollection.updateOne(
      {
        userId: ObjectId.createFromHexString(user.id),
        manwhaId: Number(manwhaId),
      },
      {
        $set: {
          isFavorite,
        },
      },
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'User manwha not found',
      });
    }

    return {
      success: true,
      isFavorite,
    };
  } catch (error) {
    console.error('Failed to update favorite status:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update favorite status',
    });
  }
});
