import { HttpError } from '../errors/httpError.js';
import * as classRepository from '../repositories/classRepository.js';
import { ensureRequiredFields } from './validation.js';
export const listClasses = () => {
    return classRepository.listClasses();
};
export const getClassById = (id) => {
    const classItem = classRepository.getClassById(id);
    if (!classItem) {
        throw new HttpError(404, 'Class not found');
    }
    return classItem;
};
export const createClass = (input) => {
    ensureRequiredFields(input, ['name', 'schedule', 'duration', 'capacity', 'level', 'description', 'icon'], 'Missing required class fields');
    const payload = input;
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
export const updateClass = (id, input) => {
    ensureRequiredFields(input, ['name', 'schedule', 'duration', 'capacity', 'level', 'description', 'icon'], 'Missing required class fields');
    const payload = input;
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
export const deleteClass = (id) => {
    getClassById(id);
    classRepository.deleteClass(id);
};
