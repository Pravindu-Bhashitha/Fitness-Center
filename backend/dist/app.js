import cors from 'cors';
import express from 'express';
import { bookingRouter } from './controllers/bookingController.js';
import { classRouter } from './controllers/classController.js';
import { messageRouter } from './controllers/messageController.js';
import { trainerRouter } from './controllers/trainerController.js';
const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
}));
app.use(express.json());
app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
});
app.use('/api/bookings', bookingRouter);
app.use('/api/messages', messageRouter);
app.use('/api/trainers', trainerRouter);
app.use('/api/classes', classRouter);
export default app;
