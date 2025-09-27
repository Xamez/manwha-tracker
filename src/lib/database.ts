import { MongoClient, type Db, type Collection, type Document } from 'mongodb';
import process from 'node:process';

let client: MongoClient | null = null;
let db: Db | null = null;

export interface User extends Document {
	_id?: string;
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Manwha extends Document {
	_id?: string;
	userId: string;
	title: string;
	description?: string;
	currentChapter: number;
	totalChapters?: number;
	lastReadAt: Date;
	status: 'reading' | 'abandoned' | 'ended' | 'to-continue' | 'completed';
	comments?: string;
	rating?: number;
	tags?: string[];
	createdAt: Date;
	updatedAt: Date;
}

export async function connectToDatabase(): Promise<Db> {
	if (db) {
		return db;
	}

	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/manwha-tracker';
	
	if (!client) {
		client = new MongoClient(uri);
		await client.connect();
	}

	db = client.db();
	return db;
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
	const database = await connectToDatabase();
	return database.collection<T>(name);
}

export function getUsersCollection(): Promise<Collection<User>> {
	return getCollection<User>('users');
}

export function getManwhasCollection(): Promise<Collection<Manwha>> {
	return getCollection<Manwha>('manwhas');
}

export async function closeDatabaseConnection(): Promise<void> {
	if (client) {
		await client.close();
		client = null;
		db = null;
	}
}