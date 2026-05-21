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
$nodeScript = @"
const sqlite3 = require('better-sqlite3');
const { Client } = require('pg');
const path = require('path');

const sqlitePath = process.argv[2];
const pgUrl = process.argv[3];

(async function(){
  try{
    const db = sqlite3(path.resolve(sqlitePath), { readonly: true });

    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    // Migrate trainers
    const trainers = db.prepare('SELECT * FROM trainers').all();
    for (const t of trainers) {
      await pg.query(`INSERT INTO trainers(id, name, bio, avatar_url) VALUES($1,$2,$3,$4) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, bio=EXCLUDED.bio, avatar_url=EXCLUDED.avatar_url`, [t.id, t.name, t.bio, t.avatar_url]);
    }

    // Migrate classes
    const classes = db.prepare('SELECT * FROM classes').all();
    for (const c of classes) {
      await pg.query(`INSERT INTO classes(id, title, description, trainer_id, starts_at, capacity) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, trainer_id=EXCLUDED.trainer_id, starts_at=EXCLUDED.starts_at, capacity=EXCLUDED.capacity`, [c.id, c.title, c.description, c.trainer_id, c.starts_at, c.capacity]);
    }

    // Migrate messages
    const messages = db.prepare('SELECT * FROM messages').all();
    for (const m of messages) {
      await pg.query(`INSERT INTO messages(id, name, email, message, created_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`, [m.id, m.name, m.email, m.message, m.created_at]);
    }

    // Migrate bookings
    const bookings = db.prepare('SELECT * FROM bookings').all();
    for (const b of bookings) {
      await pg.query(`INSERT INTO bookings(id, class_id, name, email, spots, created_at) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`, [b.id, b.class_id, b.name, b.email, b.spots, b.created_at]);
    }

    await pg.end();
    console.log('Migration completed successfully');
  }catch(err){
    console.error('Migration error', err);
    process.exit(1);
  }
})();
"@

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
