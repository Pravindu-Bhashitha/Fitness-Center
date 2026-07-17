import crypto from 'node:crypto';
import { database } from '../database/database.js';
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
export const createBooking = (booking) => {
    const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...booking,
    };
    insertBookingStatement.run(record);
    return record;
};
export const listBookings = () => {
    return selectAllBookingsStatement.all();
};
export const getBookingById = (id) => {
    return selectBookingByIdStatement.get(id);
};
