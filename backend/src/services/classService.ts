import { HttpError } from '../errors/httpError.js';
import type { ClassRecord, CreateClassInput } from '../models.js';
import * as classRepository from '../repositories/classRepository.js';
import { ensureRequiredFields } from './validation.js';

export const listClasses = (): ClassRecord[] => {
  return classRepository.listClasses();
};

export const getClassById = (id: string): ClassRecord => {
  const classItem = classRepository.getClassById(id);

  if (!classItem) {
    throw new HttpError(404, 'Class not found');
  }

  return classItem;
};

export const createClass = (input: CreateClassInput): ClassRecord => {
  ensureRequiredFields(input, ['name', 'schedule', 'duration', 'capacity', 'level', 'description', 'icon'], 'Missing required class fields');

  const payload = input as Required<CreateClassInput>;

  return classRepository.createClass({
    name: payload.name,
    schedule: payload.schedule,
    duration: payload.duration,
    capacity: payload.capacity,
    level: payload.level,
    description: payload.description,
    icon: payload.icon,
  });
};

export const updateClass = (id: string, input: CreateClassInput): ClassRecord => {
  ensureRequiredFields(input, ['name', 'schedule', 'duration', 'capacity', 'level', 'description', 'icon'], 'Missing required class fields');

  const payload = input as Required<CreateClassInput>;
  const classItem = classRepository.updateClass(id, {
    name: payload.name,
    schedule: payload.schedule,
    duration: payload.duration,
    capacity: payload.capacity,
    level: payload.level,
    description: payload.description,
    icon: payload.icon,
  });

  if (!classItem) {
    throw new HttpError(404, 'Class not found');
  }

  return classItem;
};

export const deleteClass = (id: string): void => {
  getClassById(id);
  classRepository.deleteClass(id);
};