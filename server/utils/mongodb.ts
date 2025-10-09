import { Db } from "mongodb";

let db: Db | null = null;

export function setDatabase(database: Db) {
    db = database;
}

export function useDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Make sure MongoDB plugin has loaded.');
    }
    return db;
}