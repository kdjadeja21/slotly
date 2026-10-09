import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

let database: DatabaseSync | null = null;
let openPath: string | null = null;

function databasePath(): string {
  return process.env.SLOTLY_DB_PATH ?? join(process.cwd(), "data", "slotly.db");
}

function migrate(db: DatabaseSync) {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      username_normalized TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      timezone TEXT NOT NULL DEFAULT '',
      image_bytes BLOB,
      image_type TEXT,
      picture_version INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES users(id)
    );
  `);
}

export function getDb(): DatabaseSync {
  const path = databasePath();
  if (!database || openPath !== path) {
    database?.close();
    mkdirSync(dirname(path), { recursive: true });
    database = new DatabaseSync(path);
    migrate(database);
    openPath = path;
  }
  return database;
}
