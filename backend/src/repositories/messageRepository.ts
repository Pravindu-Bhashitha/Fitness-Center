import crypto from 'node:crypto';

import { database } from '../database/database.js';
import type { CreateMessageInput, MessageRecord } from '../models.js';

const insertMessageStatement = database.prepare(`
  INSERT INTO messages (
    id,
    name,
    email,
    phone,
    message,
    createdAt
  ) VALUES (
    @id,
    @name,
    @email,
    @phone,
    @message,
    @createdAt
  )
`);

const selectAllMessagesStatement = database.prepare('SELECT * FROM messages ORDER BY createdAt DESC');

export const createMessage = (message: Omit<MessageRecord, 'id' | 'createdAt'>): MessageRecord => {
  const record: MessageRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...message,
  };

  insertMessageStatement.run(record);
  return record;
};

export const listMessages = (): MessageRecord[] => {
  return selectAllMessagesStatement.all() as MessageRecord[];
};