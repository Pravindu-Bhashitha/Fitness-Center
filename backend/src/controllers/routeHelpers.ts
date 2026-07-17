import type { Response } from 'express';

import { HttpError } from '../errors/httpError.js';

export const handleRouteError = (response: Response, error: unknown): void => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
};

export const runRoute = (response: Response, action: () => void): void => {
  try {
    action();
  } catch (error) {
    handleRouteError(response, error);
  }
};