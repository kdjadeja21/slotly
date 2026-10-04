import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

let database: DatabaseSync | null = null;

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      username_normalized TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      timezone TEXT NOT NULL DEFAULT '',
      image_bytes BLOB,
      image_type TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
  `);
}

export function openDatabase(dbPath: string) {
  if (database) {
    database.close();
    database = null;
  }

  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const next = new DatabaseSync(dbPath);
  next.exec("PRAGMA foreign_keys = ON");
  migrate(next);
  database = next;
  return next;
}

export function getDb() {
  if (!database) {
    const dbPath =
      process.env.SLOTLY_DB_PATH ??
      path.join(process.cwd(), "data", "slotly.db");
    return openDatabase(dbPath);
  }

  return database;
}
