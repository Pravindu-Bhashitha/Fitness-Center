import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Database from 'better-sqlite3';

export type BookingRecord = {
  id: string;
  type: 'trainer' | 'class';
  trainerOrClass: string;

  specialty: string;
  date: string;
  time: string;
  duration: string;
  fullName: string;
  email: string;
  phone: string;
  goals: string;
  notes: string;
  createdAt: string;
};

export type MessageRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export type TrainerRecord = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  certifications: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassRecord = {
  id: string;
  name: string;
  schedule: string;
  duration: string;
  capacity: string;
  level: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};
const dataDir = path.resolve(process.cwd(), 'data');
const databasePath = path.join(dataDir, 'bookings.v2.sqlite');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const database = new Database(databasePath);

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
const insertBookingStatement = database.prepare(`
  INSERT INTO bookings (
    id,
    type,
    trainerOrClass,
    specialty,
    date,
    time,
    duration,
    fullName,
    email,
    phone,
    goals,
    notes,
    createdAt
  ) VALUES (
    @id,
    @type,
    @trainerOrClass,
    @specialty,
    @date,
    @time,
    @duration,
    @fullName,
    @email,
    @phone,
    @goals,
    @notes,
    @createdAt
  )
`);

const insertMessageStatement = database.prepare(`
  INSERT INTO messages (
    id,
    name,
    email,
    phone,
    message,
    createdAt
  ) VALUES (
    @id,
    @name,
    @email,
    @phone,
    @message,
    @createdAt
  )
`);

const insertTrainerStatement = database.prepare(`
  INSERT INTO trainers (
    id,
    name,
    specialty,
    experience,
    certifications,
    bio,
    avatar,
    createdAt,
    updatedAt
  ) VALUES (
    @id,
    @name,
    @specialty,
    @experience,
    @certifications,
    @bio,
    @avatar,
    @createdAt,
    @updatedAt
  )
`);

const updateTrainerStatement = database.prepare(`
  UPDATE trainers
  SET
    name = @name,
    specialty = @specialty,
    experience = @experience,
    certifications = @certifications,
    bio = @bio,
    avatar = @avatar,
    updatedAt = @updatedAt
  WHERE id = @id
`);

const deleteTrainerStatement = database.prepare('DELETE FROM trainers WHERE id = ?');

const selectAllTrainersStatement = database.prepare('SELECT * FROM trainers ORDER BY createdAt DESC');

const selectTrainerByIdStatement = database.prepare('SELECT * FROM trainers WHERE id = ?');
const insertClassStatement = database.prepare(`
  INSERT INTO classes (
    id,
    name,
    schedule,
    duration,
    capacity,
    level,
    description,
    icon,
    createdAt,
    updatedAt
  ) VALUES (
    @id,
    @name,
    @schedule,
    @duration,
    @capacity,
    @level,
    @description,
    @icon,
    @createdAt,
    @updatedAt
  )
`);

const updateClassStatement = database.prepare(`
  UPDATE classes
  SET
    name = @name,
    schedule = @schedule,
    duration = @duration,
    capacity = @capacity,
    level = @level,
    description = @description,
    icon = @icon,
    updatedAt = @updatedAt
  WHERE id = @id
`);

const deleteClassStatement = database.prepare('DELETE FROM classes WHERE id = ?');

const selectAllClassesStatement = database.prepare('SELECT * FROM classes ORDER BY createdAt DESC');

const selectClassByIdStatement = database.prepare('SELECT * FROM classes WHERE id = ?');
const selectAllBookingsStatement = database.prepare(
  'SELECT * FROM bookings ORDER BY createdAt DESC',
);

const selectBookingByIdStatement = database.prepare(
  'SELECT * FROM bookings WHERE id = ?',
);

const selectAllMessagesStatement = database.prepare(
  'SELECT * FROM messages ORDER BY createdAt DESC',
);

export const createBooking = (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => {
  const record: BookingRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...booking,
  };

  insertBookingStatement.run(record);
  return record;
};

export const listBookings = (): BookingRecord[] => {
  return selectAllBookingsStatement.all() as BookingRecord[];
};

export const getBookingById = (id: string): BookingRecord | undefined => {
  return selectBookingByIdStatement.get(id) as BookingRecord | undefined;
};

export const createMessage = (msg: Omit<MessageRecord, 'id' | 'createdAt'>) => {
  const record: MessageRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...msg,
  };

  insertMessageStatement.run(record);
  return record;
};

export const listMessages = (): MessageRecord[] => {
  return selectAllMessagesStatement.all() as MessageRecord[];
};

export const listTrainers = (): TrainerRecord[] => {
  return selectAllTrainersStatement.all() as TrainerRecord[];
};

export const getTrainerById = (id: string): TrainerRecord | undefined => {
  return selectTrainerByIdStatement.get(id) as TrainerRecord | undefined;
};

export const createTrainer = (trainer: Omit<TrainerRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const record: TrainerRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...trainer,
  };

  insertTrainerStatement.run(record);
  return record;
};

export const updateTrainer = (id: string, trainer: Omit<TrainerRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  const existing = getTrainerById(id);

  if (!existing) {
    return undefined;
  }

  const record: TrainerRecord = {
    ...existing,
    ...trainer,
    id,
    updatedAt: new Date().toISOString(),
  };

  updateTrainerStatement.run(record);
  return record;
};

export const deleteTrainer = (id: string) => {
  deleteTrainerStatement.run(id);
};

export const listClasses = (): ClassRecord[] => {
  return selectAllClassesStatement.all() as ClassRecord[];
};

export const getClassById = (id: string): ClassRecord | undefined => {
  return selectClassByIdStatement.get(id) as ClassRecord | undefined;
};

export const createClass = (classRecord: Omit<ClassRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const record: ClassRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...classRecord,
  };

  insertClassStatement.run(record);
  return record;
};

export const updateClass = (id: string, classRecord: Omit<ClassRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  const existing = getClassById(id);

  if (!existing) {
    return undefined;
  }

  const record: ClassRecord = {
    ...existing,
    ...classRecord,
    id,
    updatedAt: new Date().toISOString(),
  };

  updateClassStatement.run(record);
  return record;
};

export const deleteClass = (id: string) => {
  deleteClassStatement.run(id);
};

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

const existingTrainers = selectAllTrainersStatement.all() as TrainerRecord[];
if (existingTrainers.length === 0) {
  seedTrainers.forEach((trainer) => {
    createTrainer(trainer);
  });
}

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

const existingClasses = selectAllClassesStatement.all() as ClassRecord[];
if (existingClasses.length === 0) {
  seedClasses.forEach((classItem) => {
    createClass(classItem);
  });
}