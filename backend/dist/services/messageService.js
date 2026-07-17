import * as messageRepository from '../repositories/messageRepository.js';
import { ensureRequiredFields } from './validation.js';
export const listMessages = () => {
    return messageRepository.listMessages();
};
export const createMessage = (input) => {
    ensureRequiredFields(input, ['name', 'email', 'phone', 'message'], 'Missing required message fields');
    const payload = input;
    return messageRepository.createMessage({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
    });
};
