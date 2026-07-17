import { Router } from 'express';
import { createMessage, listMessages } from '../services/messageService.js';
import { runRoute } from './routeHelpers.js';
export const messageRouter = Router();
messageRouter.get('/', (_request, response) => {
    runRoute(response, () => {
        response.json({ messages: listMessages() });
    });
});
messageRouter.post('/', (request, response) => {
    runRoute(response, () => {
        const message = createMessage(request.body ?? {});
        response.status(201).json({ message });
    });
});
