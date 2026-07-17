import crypto from 'node:crypto';

import { database } from '../database/database.js';
import type { CreateTrainerInput, TrainerRecord } from '../models.js';

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

export const listTrainers = (): TrainerRecord[] => {
  return selectAllTrainersStatement.all() as TrainerRecord[];
};

export const getTrainerById = (id: string): TrainerRecord | undefined => {
  return selectTrainerByIdStatement.get(id) as TrainerRecord | undefined;
};

export const createTrainer = (
  trainer: Omit<TrainerRecord, 'id' | 'createdAt' | 'updatedAt'>,
): TrainerRecord => {
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

export const updateTrainer = (
  id: string,
  trainer: Omit<TrainerRecord, 'id' | 'createdAt' | 'updatedAt'>,
): TrainerRecord | undefined => {
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

export const deleteTrainer = (id: string): void => {
  deleteTrainerStatement.run(id);
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

if (listTrainers().length === 0) {
  seedTrainers.forEach((trainer) => {
    createTrainer(trainer);
  });
}