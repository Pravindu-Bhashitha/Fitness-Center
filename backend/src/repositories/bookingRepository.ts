import crypto from 'node:crypto';

import { database } from '../database/database.js';
import type { BookingRecord, CreateBookingInput } from '../models.js';

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

const selectAllBookingsStatement = database.prepare('SELECT * FROM bookings ORDER BY createdAt DESC');
const selectBookingByIdStatement = database.prepare('SELECT * FROM bookings WHERE id = ?');

export const createBooking = (booking: Omit<BookingRecord, 'id' | 'createdAt'>): BookingRecord => {
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