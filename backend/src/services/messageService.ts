import { HttpError } from '../errors/httpError.js';
import type { CreateMessageInput, MessageRecord } from '../models.js';
import * as messageRepository from '../repositories/messageRepository.js';
import { ensureRequiredFields } from './validation.js';

export const listMessages = (): MessageRecord[] => {
  return messageRepository.listMessages();
};

export const createMessage = (input: CreateMessageInput): MessageRecord => {
  ensureRequiredFields(input, ['name', 'email', 'phone', 'message'], 'Missing required message fields');

  const payload = input as Required<CreateMessageInput>;

  return messageRepository.createMessage({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
  });
};