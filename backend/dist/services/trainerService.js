import { HttpError } from '../errors/httpError.js';
import * as trainerRepository from '../repositories/trainerRepository.js';
import { ensureRequiredFields } from './validation.js';
export const listTrainers = () => {
    return trainerRepository.listTrainers();
};
export const getTrainerById = (id) => {
    const trainer = trainerRepository.getTrainerById(id);
    if (!trainer) {
        throw new HttpError(404, 'Trainer not found');
    }
    return trainer;
};
export const createTrainer = (input) => {
    ensureRequiredFields(input, ['name', 'specialty', 'experience', 'certifications', 'bio', 'avatar'], 'Missing required trainer fields');
    const payload = input;
    return trainerRepository.createTrainer({
        name: payload.name,
        specialty: payload.specialty,
        experience: payload.experience,
        certifications: payload.certifications,
        bio: payload.bio,
        avatar: payload.avatar,
    });
};
export const updateTrainer = (id, input) => {
    ensureRequiredFields(input, ['name', 'specialty', 'experience', 'certifications', 'bio', 'avatar'], 'Missing required trainer fields');
    const payload = input;
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
export const deleteTrainer = (id) => {
    getTrainerById(id);
    trainerRepository.deleteTrainer(id);
};
