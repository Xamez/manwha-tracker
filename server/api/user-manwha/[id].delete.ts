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

    const userManwhaDoc = await userManwhasCollection.findOne({
      userId: ObjectId.createFromHexString(user.id),
      manwhaId,
    });

    if (!userManwhaDoc) {
      throw createError({
        statusCode: 404,
        message: 'User manwha not found',
      });
    }

    await userManwhasCollection.deleteOne({
      _id: userManwhaDoc._id,
    });
    return { message: 'User manwha deleted successfully' };
  } catch (error) {
    console.error('Failed to fetch or delete user manwha:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch or delete user manwha',
    });
  }
});
