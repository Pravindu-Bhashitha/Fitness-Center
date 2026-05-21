Param(
    [string]$SqlitePath = "backend/data/bookings.v2.sqlite",
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not (Test-Path $SqlitePath)) {
    Write-Error "SQLite file not found: $SqlitePath"
    exit 1
}

if (-not $DatabaseUrl) {
    Write-Error "DATABASE_URL environment variable not set. Pass it as -DatabaseUrl or set env var."
    exit 1
}

Write-Host "Connecting to SQLite: $SqlitePath"
Write-Host "Target Postgres: $DatabaseUrl"

# This script requires Node.js. We'll use a small Node helper to do the migration reliably.
$nodeScript = @'
const path = require('path');

const sqlitePath = process.argv[2];
const pgUrl = process.argv[3];
const backendRoot = path.resolve(path.dirname(path.resolve(sqlitePath)), '..');
const sqlite3 = require(path.join(backendRoot, 'node_modules', 'better-sqlite3'));
const { Client } = require(path.join(backendRoot, 'node_modules', 'pg'));

const schemaSql = `
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  "trainerOrClass" TEXT NOT NULL,
  specialty TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  goals TEXT,
  notes TEXT,
  "createdAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience TEXT NOT NULL,
  certifications TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
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
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);
`;

(async function(){
  try{
    const db = sqlite3(path.resolve(sqlitePath), { readonly: true });

    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();
    await pg.query(schemaSql);

    // Migrate trainers
    const trainers = db.prepare('SELECT * FROM trainers').all();
    for (const t of trainers) {
      await pg.query(
        `INSERT INTO trainers (id, name, specialty, experience, certifications, bio, avatar, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           specialty = EXCLUDED.specialty,
           experience = EXCLUDED.experience,
           certifications = EXCLUDED.certifications,
           bio = EXCLUDED.bio,
           avatar = EXCLUDED.avatar,
           "createdAt" = EXCLUDED."createdAt",
           "updatedAt" = EXCLUDED."updatedAt"`,
        [t.id, t.name, t.specialty, t.experience, t.certifications, t.bio, t.avatar, t.createdAt, t.updatedAt],
      );
    }

    // Migrate classes
    const classes = db.prepare('SELECT * FROM classes').all();
    for (const c of classes) {
      await pg.query(
        `INSERT INTO classes (id, name, schedule, duration, capacity, level, description, icon, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           schedule = EXCLUDED.schedule,
           duration = EXCLUDED.duration,
           capacity = EXCLUDED.capacity,
           level = EXCLUDED.level,
           description = EXCLUDED.description,
           icon = EXCLUDED.icon,
           "createdAt" = EXCLUDED."createdAt",
           "updatedAt" = EXCLUDED."updatedAt"`,
        [c.id, c.name, c.schedule, c.duration, c.capacity, c.level, c.description, c.icon, c.createdAt, c.updatedAt],
      );
    }

    // Migrate messages
    const messages = db.prepare('SELECT * FROM messages').all();
    for (const m of messages) {
      await pg.query(
        `INSERT INTO messages (id, name, email, phone, message, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           phone = EXCLUDED.phone,
           message = EXCLUDED.message,
           "createdAt" = EXCLUDED."createdAt"`,
        [m.id, m.name, m.email, m.phone, m.message, m.createdAt],
      );
    }

    // Migrate bookings
    const bookings = db.prepare('SELECT * FROM bookings').all();
    for (const b of bookings) {
      await pg.query(
        `INSERT INTO bookings (id, type, "trainerOrClass", specialty, date, time, duration, "fullName", email, phone, goals, notes, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE SET
           type = EXCLUDED.type,
           "trainerOrClass" = EXCLUDED."trainerOrClass",
           specialty = EXCLUDED.specialty,
           date = EXCLUDED.date,
           time = EXCLUDED.time,
           duration = EXCLUDED.duration,
           "fullName" = EXCLUDED."fullName",
           email = EXCLUDED.email,
           phone = EXCLUDED.phone,
           goals = EXCLUDED.goals,
           notes = EXCLUDED.notes,
           "createdAt" = EXCLUDED."createdAt"`,
        [b.id, b.type, b.trainerOrClass, b.specialty, b.date, b.time, b.duration, b.fullName, b.email, b.phone, b.goals, b.notes, b.createdAt],
      );
    }

    await pg.end();
    console.log('Migration completed successfully');
  }catch(err){
    console.error('Migration error', err);
    process.exit(1);
  }
})();
'@

# Write temporary node script
$nodeFile = Join-Path $env:TEMP "migrate-sqlite-to-postgres.js"
Set-Content -Path $nodeFile -Value $nodeScript -Encoding UTF8

# Run node script
Write-Host "Running Node migration helper..."
node $nodeFile $SqlitePath $DatabaseUrl

if ($LASTEXITCODE -ne 0) {
    Write-Error "Node migration failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Done."
