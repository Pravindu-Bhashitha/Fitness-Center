import { Router } from 'express';

import { createBooking, getBookingById, listBookings } from '../services/bookingService.js';
import { runRoute } from './routeHelpers.js';

export const bookingRouter = Router();

bookingRouter.get('/', (_request, response) => {
  runRoute(response, () => {
    response.json({ bookings: listBookings() });
  });
});

bookingRouter.get('/:id', (request, response) => {
  runRoute(response, () => {
    response.json({ booking: getBookingById(request.params.id) });
  });
});

bookingRouter.post('/', (request, response) => {
  runRoute(response, () => {
    const booking = createBooking(request.body ?? {});
    response.status(201).json({ booking });
  });
});