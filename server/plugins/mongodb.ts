import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import { setDatabase } from '../utils/mongodb';

export default defineNitroPlugin(async nitroApp => {
  const config = useRuntimeConfig();
  const mongoUri = config.mongodbUri || '';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();

    const db = mongoClient.db('manhwa-tracker');
    setDatabase(db);

    await createCollectionsIfNotExist(db);

    console.log('Connected to MongoDB');

    nitroApp.hooks.hook('close', async () => {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
});

async function createCollectionsIfNotExist(db: Db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);

  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
    console.log('Created users collection');
  }
  if (!collectionNames.includes('manhwas')) {
    await db.createCollection('manhwas');
    console.log('Created manhwas collection');
  }
  if (!collectionNames.includes('user_manhwas')) {
    await db.createCollection('user_manhwas');
    console.log('Created user_manhwas collection');
  }
}
