import { Router } from 'express';

import { createTrainer, deleteTrainer, getTrainerById, listTrainers, updateTrainer } from '../services/trainerService.js';
import { runRoute } from './routeHelpers.js';

export const trainerRouter = Router();

trainerRouter.get('/', (_request, response) => {
  runRoute(response, () => {
    response.json({ trainers: listTrainers() });
  });
});

trainerRouter.get('/:id', (request, response) => {
  runRoute(response, () => {
    response.json({ trainer: getTrainerById(request.params.id) });
  });
});

trainerRouter.post('/', (request, response) => {
  runRoute(response, () => {
    const trainer = createTrainer(request.body ?? {});
    response.status(201).json({ trainer });
  });
});

trainerRouter.put('/:id', (request, response) => {
  runRoute(response, () => {
    const trainer = updateTrainer(request.params.id, request.body ?? {});
    response.json({ trainer });
  });
});

trainerRouter.delete('/:id', (request, response) => {
  runRoute(response, () => {
    deleteTrainer(request.params.id);
    response.status(204).send();
  });
});