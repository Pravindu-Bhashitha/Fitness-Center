import crypto from 'node:crypto';
import { Pool } from 'pg';
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required for the PostgreSQL deployment branch.');
}
const pool = new Pool({
    connectionString,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
});
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
let initPromise = null;
function normalizeBooking(row) {
    return {
        id: row.id,
        type: row.type,
        trainerOrClass: row.trainerOrClass,
        specialty: row.specialty,
        date: row.date,
        time: row.time,
        duration: row.duration,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        goals: row.goals ?? '',
        notes: row.notes ?? '',
        createdAt: row.createdAt,
    };
}
function normalizeMessage(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.message,
        createdAt: row.createdAt,
    };
}
function normalizeTrainer(row) {
    return {
        id: row.id,
        name: row.name,
        specialty: row.specialty,
        experience: row.experience,
        certifications: row.certifications,
        bio: row.bio,
        avatar: row.avatar,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}
function normalizeClass(row) {
    return {
        id: row.id,
        name: row.name,
        schedule: row.schedule,
        duration: row.duration,
        capacity: row.capacity,
        level: row.level,
        description: row.description,
        icon: row.icon,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}
async function seedIfNeeded() {
    const trainerCount = await pool.query('SELECT COUNT(*)::text AS count FROM trainers');
    if (Number(trainerCount.rows[0]?.count ?? 0) === 0) {
        const now = new Date().toISOString();
        const seedTrainers = [
            {
                name: 'James Mitchell',
                specialty: 'Strength & Conditioning',
                experience: '8 years',
                certifications: 'ISSA, NASM-CPT',
                bio: 'Expert in building muscle and increasing athletic performance.',
                avatar: '👨‍🦱',
            },
            {
                name: 'Lisa Anderson',
                specialty: 'Yoga & Flexibility',
                experience: '10 years',
                certifications: 'RYT-500, Pilates Instructor',
                bio: 'Dedicated to helping clients find balance and inner peace through yoga.',
                avatar: '👩‍🦳',
            },
            {
                name: 'Marcus Johnson',
                specialty: 'HIIT & Cardio',
                experience: '6 years',
                certifications: 'ACE, NASM, Spin Instructor',
                bio: 'High-energy trainer specializing in cardiovascular fitness and endurance.',
                avatar: '👨‍🦴',
            },
            {
                name: 'Sophie Rodriguez',
                specialty: 'Personal Training',
                experience: '7 years',
                certifications: 'ISSA, Nutrition Specialist',
                bio: 'Personalized training programs that combine fitness with nutritional guidance.',
                avatar: '👩‍🦰',
            },
            {
                name: 'David Chen',
                specialty: 'Martial Arts & Boxing',
                experience: '12 years',
                certifications: 'Black Belt, Boxing Coach',
                bio: 'Passionate about teaching discipline, technique, and self-defense.',
                avatar: '👨‍💼',
            },
            {
                name: 'Amanda White',
                specialty: 'Group Fitness',
                experience: '5 years',
                certifications: 'Zumba Master, Group Fitness Instructor',
                bio: 'Makes fitness fun and accessible for everyone in our group classes.',
                avatar: '👩‍🦱',
            },
        ];
        for (const trainer of seedTrainers) {
            await pool.query(`INSERT INTO trainers (id, name, specialty, experience, certifications, bio, avatar, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [crypto.randomUUID(), trainer.name, trainer.specialty, trainer.experience, trainer.certifications, trainer.bio, trainer.avatar, now, now]);
        }
    }
    const classCount = await pool.query('SELECT COUNT(*)::text AS count FROM classes');
    if (Number(classCount.rows[0]?.count ?? 0) === 0) {
        const now = new Date().toISOString();
        const seedClasses = [
            {
                name: 'HIIT Training',
                schedule: 'Mon, Wed, Fri - 6:00 AM',
                duration: '45 minutes',
                capacity: '20 people',
                level: 'Intermediate',
                description: 'High-intensity interval training for maximum calorie burn.',
                icon: '🏃',
            },
            {
                name: 'Power Yoga',
                schedule: 'Tue, Thu - 5:30 PM',
                duration: '60 minutes',
                capacity: '25 people',
                level: 'All Levels',
                description: 'Energizing yoga flow that builds strength and flexibility.',
                icon: '🧘',
            },
            {
                name: 'Spinning Class',
                schedule: 'Daily - 7:00 AM & 5:00 PM',
                duration: '50 minutes',
                capacity: '30 people',
                level: 'All Levels',
                description: 'Indoor cycling with motivating music and challenging workouts.',
                icon: '🚴',
            },
            {
                name: 'Zumba Dance',
                schedule: 'Wed, Sat - 6:30 PM',
                duration: '55 minutes',
                capacity: '35 people',
                level: 'Beginner',
                description: 'Fun dance workouts that feel like a party!',
                icon: '💃',
            },
            {
                name: 'Boxing Basics',
                schedule: 'Mon, Wed, Fri - 4:00 PM',
                duration: '50 minutes',
                capacity: '15 people',
                level: 'Beginner',
                description: 'Learn boxing techniques while getting an amazing cardio workout.',
                icon: '🥊',
            },
            {
                name: 'Pilates Core',
                schedule: 'Tue, Thu, Sat - 10:00 AM',
                duration: '45 minutes',
                capacity: '20 people',
                level: 'Intermediate',
                description: 'Strengthen your core with precision pilates movements.',
                icon: '🧖',
            },
        ];
        for (const classItem of seedClasses) {
            await pool.query(`INSERT INTO classes (id, name, schedule, duration, capacity, level, description, icon, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [crypto.randomUUID(), classItem.name, classItem.schedule, classItem.duration, classItem.capacity, classItem.level, classItem.description, classItem.icon, now, now]);
        }
    }
}
export async function initDatabase() {
    if (!initPromise) {
        initPromise = (async () => {
            await pool.query(schemaSql);
            await seedIfNeeded();
        })();
    }
    await initPromise;
}
export async function createBooking(booking) {
    await initDatabase();
    const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...booking,
    };
    await pool.query(`INSERT INTO bookings (id, type, "trainerOrClass", specialty, date, time, duration, "fullName", email, phone, goals, notes, "createdAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [record.id, record.type, record.trainerOrClass, record.specialty, record.date, record.time, record.duration, record.fullName, record.email, record.phone, record.goals, record.notes, record.createdAt]);
    return record;
}
export async function listBookings() {
    await initDatabase();
    const result = await pool.query('SELECT * FROM bookings ORDER BY "createdAt" DESC');
    return result.rows.map(normalizeBooking);
}
export async function getBookingById(id) {
    await initDatabase();
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0] ? normalizeBooking(result.rows[0]) : undefined;
}
export async function createMessage(msg) {
    await initDatabase();
    const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...msg,
    };
    await pool.query(`INSERT INTO messages (id, name, email, phone, message, "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`, [record.id, record.name, record.email, record.phone, record.message, record.createdAt]);
    return record;
}
export async function listMessages() {
    await initDatabase();
    const result = await pool.query('SELECT * FROM messages ORDER BY "createdAt" DESC');
    return result.rows.map(normalizeMessage);
}
export async function listTrainers() {
    await initDatabase();
    const result = await pool.query('SELECT * FROM trainers ORDER BY "createdAt" DESC');
    return result.rows.map(normalizeTrainer);
}
export async function getTrainerById(id) {
    await initDatabase();
    const result = await pool.query('SELECT * FROM trainers WHERE id = $1', [id]);
    return result.rows[0] ? normalizeTrainer(result.rows[0]) : undefined;
}
export async function createTrainer(trainer) {
    await initDatabase();
    const now = new Date().toISOString();
    const record = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...trainer,
    };
    await pool.query(`INSERT INTO trainers (id, name, specialty, experience, certifications, bio, avatar, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [record.id, record.name, record.specialty, record.experience, record.certifications, record.bio, record.avatar, record.createdAt, record.updatedAt]);
    return record;
}
export async function updateTrainer(id, trainer) {
    await initDatabase();
    const existing = await getTrainerById(id);
    if (!existing) {
        return undefined;
    }
    const record = {
        ...existing,
        ...trainer,
        id,
        updatedAt: new Date().toISOString(),
    };
    await pool.query(`UPDATE trainers
     SET name = $1, specialty = $2, experience = $3, certifications = $4, bio = $5, avatar = $6, "updatedAt" = $7
     WHERE id = $8`, [record.name, record.specialty, record.experience, record.certifications, record.bio, record.avatar, record.updatedAt, record.id]);
    return record;
}
export async function deleteTrainer(id) {
    await initDatabase();
    await pool.query('DELETE FROM trainers WHERE id = $1', [id]);
}
export async function listClasses() {
    await initDatabase();
    const result = await pool.query('SELECT * FROM classes ORDER BY "createdAt" DESC');
    return result.rows.map(normalizeClass);
}
export async function getClassById(id) {
    await initDatabase();
    const result = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
    return result.rows[0] ? normalizeClass(result.rows[0]) : undefined;
}
export async function createClass(classRecord) {
    await initDatabase();
    const now = new Date().toISOString();
    const record = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...classRecord,
    };
    await pool.query(`INSERT INTO classes (id, name, schedule, duration, capacity, level, description, icon, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [record.id, record.name, record.schedule, record.duration, record.capacity, record.level, record.description, record.icon, record.createdAt, record.updatedAt]);
    return record;
}
export async function updateClass(id, classRecord) {
    await initDatabase();
    const existing = await getClassById(id);
    if (!existing) {
        return undefined;
    }
    const record = {
        ...existing,
        ...classRecord,
        id,
        updatedAt: new Date().toISOString(),
    };
    await pool.query(`UPDATE classes
     SET name = $1, schedule = $2, duration = $3, capacity = $4, level = $5, description = $6, icon = $7, "updatedAt" = $8
     WHERE id = $9`, [record.name, record.schedule, record.duration, record.capacity, record.level, record.description, record.icon, record.updatedAt, record.id]);
    return record;
}
export async function deleteClass(id) {
    await initDatabase();
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
}
