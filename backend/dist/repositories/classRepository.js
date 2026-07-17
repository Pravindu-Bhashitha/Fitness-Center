import crypto from 'node:crypto';
import { database } from '../database/database.js';
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
export const listClasses = () => {
    return selectAllClassesStatement.all();
};
export const getClassById = (id) => {
    return selectClassByIdStatement.get(id);
};
export const createClass = (classRecord) => {
    const now = new Date().toISOString();
    const record = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...classRecord,
    };
    insertClassStatement.run(record);
    return record;
};
export const updateClass = (id, classRecord) => {
    const existing = getClassById(id);
    if (!existing) {
        return undefined;
    }
    const record = {
        ...existing,
        ...classRecord,
        id,
        updatedAt: new Date().toISOString(),
    };
    updateClassStatement.run(record);
    return record;
};
export const deleteClass = (id) => {
    deleteClassStatement.run(id);
};
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
if (listClasses().length === 0) {
    seedClasses.forEach((classRecord) => {
        createClass(classRecord);
    });
}
