import { HttpError } from '../errors/httpError.js';
import type { CreateTrainerInput, TrainerRecord } from '../models.js';
import * as trainerRepository from '../repositories/trainerRepository.js';
import { ensureRequiredFields } from './validation.js';

export const listTrainers = (): TrainerRecord[] => {
  return trainerRepository.listTrainers();
};

export const getTrainerById = (id: string): TrainerRecord => {
  const trainer = trainerRepository.getTrainerById(id);

  if (!trainer) {
    throw new HttpError(404, 'Trainer not found');
  }

  return trainer;
};

export const createTrainer = (input: CreateTrainerInput): TrainerRecord => {
  ensureRequiredFields(input, ['name', 'specialty', 'experience', 'certifications', 'bio', 'avatar'], 'Missing required trainer fields');

  const payload = input as Required<CreateTrainerInput>;

  return trainerRepository.createTrainer({
    name: payload.name,
    specialty: payload.specialty,
    experience: payload.experience,
    certifications: payload.certifications,
    bio: payload.bio,
    avatar: payload.avatar,
  });
};

export const updateTrainer = (id: string, input: CreateTrainerInput): TrainerRecord => {
  ensureRequiredFields(input, ['name', 'specialty', 'experience', 'certifications', 'bio', 'avatar'], 'Missing required trainer fields');

  const payload = input as Required<CreateTrainerInput>;
  const trainer = trainerRepository.updateTrainer(id, {
    name: payload.name,
    specialty: payload.specialty,
    experience: payload.experience,
    certifications: payload.certifications,
    bio: payload.bio,
    avatar: payload.avatar,
  });

  if (!trainer) {
    throw new HttpError(404, 'Trainer not found');
  }

  return trainer;
};

export const deleteTrainer = (id: string): void => {
  getTrainerById(id);
  trainerRepository.deleteTrainer(id);
};