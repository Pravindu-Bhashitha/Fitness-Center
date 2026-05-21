import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import {
  createBooking,
  getBookingById,
  listBookings,
  createMessage,
  listMessages,
  listTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  initDatabase,
} from './db.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

const wrap = (
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void> | void,
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
};

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get(
  '/api/bookings',
  wrap(async (_request, response) => {
    response.json({ bookings: await listBookings() });
  }),
);

app.get(
  '/api/bookings/:id',
  wrap(async (request, response) => {
    const bookingId = String(request.params.id);
    const booking = await getBookingById(bookingId);

    if (!booking) {
      response.status(404).json({ message: 'Booking not found' });
      return;
    }

    response.json({ booking });
  }),
);

app.post(
  '/api/bookings',
  wrap(async (request, response) => {
    const {
      type,
      trainerOrClass,
      specialty,
      date,
      time,
      duration,
      fullName,
      email,
      phone,
      goals = '',
      notes = '',
    } = request.body ?? {};

    if (!type || !trainerOrClass || !specialty || !date || !time || !duration || !fullName || !email || !phone) {
      response.status(400).json({ message: 'Missing required booking fields' });
      return;
    }

    const booking = await createBooking({
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
    });

    response.status(201).json({ booking });
  }),
);

app.get(
  '/api/messages',
  wrap(async (_request, response) => {
    response.json({ messages: await listMessages() });
  }),
);

app.post(
  '/api/messages',
  wrap(async (request, response) => {
    const { name, email, phone, message } = request.body ?? {};

    if (!name || !email || !phone || !message) {
      response.status(400).json({ message: 'Missing required message fields' });
      return;
    }

    const savedMessage = await createMessage({
      name,
      email,
      phone,
      message,
    });

    response.status(201).json({ message: savedMessage });
  }),
);

app.get(
  '/api/trainers',
  wrap(async (_request, response) => {
    response.json({ trainers: await listTrainers() });
  }),
);

app.get(
  '/api/trainers/:id',
  wrap(async (request, response) => {
    const trainerId = String(request.params.id);
    const trainer = await getTrainerById(trainerId);

    if (!trainer) {
      response.status(404).json({ message: 'Trainer not found' });
      return;
    }

    response.json({ trainer });
  }),
);

app.post(
  '/api/trainers',
  wrap(async (request, response) => {
    const { name, specialty, experience, certifications, bio, avatar } = request.body ?? {};

    if (!name || !specialty || !experience || !certifications || !bio || !avatar) {
      response.status(400).json({ message: 'Missing required trainer fields' });
      return;
    }

    const trainer = await createTrainer({
      name,
      specialty,
      experience,
      certifications,
      bio,
      avatar,
    });

    response.status(201).json({ trainer });
  }),
);

app.put(
  '/api/trainers/:id',
  wrap(async (request, response) => {
    const trainerId = String(request.params.id);
    const { name, specialty, experience, certifications, bio, avatar } = request.body ?? {};

    if (!name || !specialty || !experience || !certifications || !bio || !avatar) {
      response.status(400).json({ message: 'Missing required trainer fields' });
      return;
    }

    const trainer = await updateTrainer(trainerId, {
      name,
      specialty,
      experience,
      certifications,
      bio,
      avatar,
    });

    if (!trainer) {
      response.status(404).json({ message: 'Trainer not found' });
      return;
    }

    response.json({ trainer });
  }),
);

app.delete(
  '/api/trainers/:id',
  wrap(async (request, response) => {
    const trainerId = String(request.params.id);
    const trainer = await getTrainerById(trainerId);

    if (!trainer) {
      response.status(404).json({ message: 'Trainer not found' });
      return;
    }

    await deleteTrainer(trainerId);
    response.status(204).send();
  }),
);

app.get(
  '/api/classes',
  wrap(async (_request, response) => {
    response.json({ classes: await listClasses() });
  }),
);

app.get(
  '/api/classes/:id',
  wrap(async (request, response) => {
    const classId = String(request.params.id);
    const classItem = await getClassById(classId);

    if (!classItem) {
      response.status(404).json({ message: 'Class not found' });
      return;
    }

    response.json({ classItem });
  }),
);

app.post(
  '/api/classes',
  wrap(async (request, response) => {
    const { name, schedule, duration, capacity, level, description, icon } = request.body ?? {};

    if (!name || !schedule || !duration || !capacity || !level || !description || !icon) {
      response.status(400).json({ message: 'Missing required class fields' });
      return;
    }

    const classItem = await createClass({
      name,
      schedule,
      duration,
      capacity,
      level,
      description,
      icon,
    });

    response.status(201).json({ classItem });
  }),
);

app.put(
  '/api/classes/:id',
  wrap(async (request, response) => {
    const classId = String(request.params.id);
    const { name, schedule, duration, capacity, level, description, icon } = request.body ?? {};

    if (!name || !schedule || !duration || !capacity || !level || !description || !icon) {
      response.status(400).json({ message: 'Missing required class fields' });
      return;
    }

    const classItem = await updateClass(classId, {
      name,
      schedule,
      duration,
      capacity,
      level,
      description,
      icon,
    });

    if (!classItem) {
      response.status(404).json({ message: 'Class not found' });
      return;
    }

    response.json({ classItem });
  }),
);

app.delete(
  '/api/classes/:id',
  wrap(async (request, response) => {
    const classId = String(request.params.id);
    const classItem = await getClassById(classId);

    if (!classItem) {
      response.status(404).json({ message: 'Class not found' });
      return;
    }

    await deleteClass(classId);
    response.status(204).send();
  }),
);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  await initDatabase();
  app.listen(port, () => {
    console.log(`Booking API running on http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
