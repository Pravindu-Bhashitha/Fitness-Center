import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

const dataDir = path.resolve(process.cwd(), 'data');
const databasePath = path.join(dataDir, 'bookings.v2.sqlite');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const database = new Database(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    trainerOrClass TEXT NOT NULL,
    specialty TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    duration TEXT NOT NULL,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    goals TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trainers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    experience TEXT NOT NULL,
    certifications TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    schedule TEXT NOT NULL,
    duration TEXT NOT NULL,
    capacity TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);