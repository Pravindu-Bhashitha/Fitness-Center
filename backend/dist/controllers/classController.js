import { Router } from 'express';
import { createClass, deleteClass, getClassById, listClasses, updateClass } from '../services/classService.js';
import { runRoute } from './routeHelpers.js';
export const classRouter = Router();
classRouter.get('/', (_request, response) => {
    runRoute(response, () => {
        response.json({ classes: listClasses() });
    });
});
classRouter.get('/:id', (request, response) => {
    runRoute(response, () => {
        response.json({ classItem: getClassById(request.params.id) });
    });
});
classRouter.post('/', (request, response) => {
    runRoute(response, () => {
        const classItem = createClass(request.body ?? {});
        response.status(201).json({ classItem });
    });
});
classRouter.put('/:id', (request, response) => {
    runRoute(response, () => {
        const classItem = updateClass(request.params.id, request.body ?? {});
        response.json({ classItem });
    });
});
classRouter.delete('/:id', (request, response) => {
    runRoute(response, () => {
        deleteClass(request.params.id);
        response.status(204).send();
    });
});
