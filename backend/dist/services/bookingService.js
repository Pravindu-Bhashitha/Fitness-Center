import { HttpError } from '../errors/httpError.js';
import * as bookingRepository from '../repositories/bookingRepository.js';
import { ensureRequiredFields } from './validation.js';
export const listBookings = () => {
    return bookingRepository.listBookings();
};
export const getBookingById = (id) => {
    const booking = bookingRepository.getBookingById(id);
    if (!booking) {
        throw new HttpError(404, 'Booking not found');
    }
    return booking;
};
export const createBooking = (input) => {
    ensureRequiredFields(input, ['type', 'trainerOrClass', 'specialty', 'date', 'time', 'duration', 'fullName', 'email', 'phone'], 'Missing required booking fields');
    const payload = input;
    return bookingRepository.createBooking({
        type: payload.type,
        trainerOrClass: payload.trainerOrClass,
        specialty: payload.specialty,
        date: payload.date,
        time: payload.time,
        duration: payload.duration,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        goals: payload.goals ?? '',
        notes: payload.notes ?? '',
    });
};
