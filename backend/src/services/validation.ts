import { HttpError } from '../errors/httpError.js';

export const ensureRequiredFields = (
  payload: Record<string, unknown>,
  fields: readonly string[],
  message: string,
): void => {
  const missingField = fields.find((field) => !payload[field]);

  if (missingField) {
    throw new HttpError(400, message);
  }
};