import cors from 'cors';
import express from 'express';
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
} from './db.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  }),
);
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/bookings', (_request, response) => {
  response.json({ bookings: listBookings() });
});

app.get('/api/bookings/:id', (request, response) => {
  const booking = getBookingById(request.params.id);

  if (!booking) {
    response.status(404).json({ message: 'Booking not found' });
    return;
  }

  response.json({ booking });
});

app.post('/api/bookings', (request, response) => {
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

  const booking = createBooking({
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
});

// Messages endpoints
app.get('/api/messages', (_request, response) => {
  response.json({ messages: listMessages() });
});

app.post('/api/messages', (request, response) => {
  const { name, email, phone, message } = request.body ?? {};

  if (!name || !email || !phone || !message) {
    response.status(400).json({ message: 'Missing required message fields' });
    return;
  }

  const savedMessage = createMessage({
    name,
    email,
    phone,
    message,
  });

  response.status(201).json({ message: savedMessage });
});

// Trainers endpoints
app.get('/api/trainers', (_request, response) => {
  response.json({ trainers: listTrainers() });
});

app.get('/api/trainers/:id', (request, response) => {
  const trainer = getTrainerById(request.params.id);

  if (!trainer) {
    response.status(404).json({ message: 'Trainer not found' });
    return;
  }

  response.json({ trainer });
});

app.post('/api/trainers', (request, response) => {
  const { name, specialty, experience, certifications, bio, avatar } = request.body ?? {};

  if (!name || !specialty || !experience || !certifications || !bio || !avatar) {
    response.status(400).json({ message: 'Missing required trainer fields' });
    return;
  }

  const trainer = createTrainer({
    name,
    specialty,
    experience,
    certifications,
    bio,
    avatar,
  });

  response.status(201).json({ trainer });
});

app.put('/api/trainers/:id', (request, response) => {
  const { name, specialty, experience, certifications, bio, avatar } = request.body ?? {};

  if (!name || !specialty || !experience || !certifications || !bio || !avatar) {
    response.status(400).json({ message: 'Missing required trainer fields' });
    return;
  }

  const trainer = updateTrainer(request.params.id, {
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
});

app.delete('/api/trainers/:id', (request, response) => {
  const trainer = getTrainerById(request.params.id);

  if (!trainer) {
    response.status(404).json({ message: 'Trainer not found' });
    return;
  }

  deleteTrainer(request.params.id);
  response.status(204).send();
});

app.get('/api/classes', (_request, response) => {
  response.json({ classes: listClasses() });
});

app.get('/api/classes/:id', (request, response) => {
  const classItem = getClassById(request.params.id);

  if (!classItem) {
    response.status(404).json({ message: 'Class not found' });
    return;
  }

  response.json({ classItem });
});

app.post('/api/classes', (request, response) => {
  const { name, schedule, duration, capacity, level, description, icon } = request.body ?? {};

  if (!name || !schedule || !duration || !capacity || !level || !description || !icon) {
    response.status(400).json({ message: 'Missing required class fields' });
    return;
  }

  const classItem = createClass({
    name,
    schedule,
    duration,
    capacity,
    level,
    description,
    icon,
  });

  response.status(201).json({ classItem });
});

app.put('/api/classes/:id', (request, response) => {
  const { name, schedule, duration, capacity, level, description, icon } = request.body ?? {};

  if (!name || !schedule || !duration || !capacity || !level || !description || !icon) {
    response.status(400).json({ message: 'Missing required class fields' });
    return;
  }

  const classItem = updateClass(request.params.id, {
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
});

app.delete('/api/classes/:id', (request, response) => {
  const classItem = getClassById(request.params.id);

  if (!classItem) {
    response.status(404).json({ message: 'Class not found' });
    return;
  }

  deleteClass(request.params.id);
  response.status(204).send();
});

app.listen(port, () => {
  // Keep startup simple for local development.
  console.log(`Booking API running on http://localhost:${port}`);
});