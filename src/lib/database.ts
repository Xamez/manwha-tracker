import { type Collection, type Db, type Document, MongoClient } from "mongodb";
import { SERVER_ENV } from "./env";
import type { Manwha, User } from "./types";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = SERVER_ENV.MONGODB_URI;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");
  }

  db = client.db();
  return db;
}

export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T>> {
  const database = await connectToDatabase();
  return database.collection<T>(name);
}

export function getUsersCollection(): Promise<Collection<User>> {
  return getCollection<User>("users");
}

export function getManwhasCollection(): Promise<Collection<Manwha>> {
  return getCollection<Manwha>("manwhas");
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
