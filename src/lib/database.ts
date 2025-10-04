import { type Collection, type Db, type Document, MongoClient } from "mongodb";
import { SERVER_ENV } from "./env";
import type { Manwha, User } from "./types";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private clientPromise: Promise<MongoClient>;
  private client: MongoClient;
  private dbCache: Db | null = null;

  private constructor() {
    this.client = new MongoClient(SERVER_ENV.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    this.clientPromise = this.client.connect();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getDb(): Promise<Db> {
    if (this.dbCache) {
      return this.dbCache;
    }

    await this.clientPromise;
    this.dbCache = this.client.db();
    return this.dbCache;
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.dbCache = null;
  }
}

async function getDb(): Promise<Db> {
  return await DatabaseConnection.getInstance().getDb();
}

export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export function getUsersCollection(): Promise<Collection<User>> {
  return getCollection<User>("users");
}

export function getManwhasCollection(): Promise<Collection<Manwha>> {
  return getCollection<Manwha>("manwhas");
}

export async function closeDatabaseConnection(): Promise<void> {
  await DatabaseConnection.getInstance().close();
}
