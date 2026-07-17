import { HttpError } from '../errors/httpError.js';
export const handleRouteError = (response, error) => {
    if (error instanceof HttpError) {
        response.status(error.statusCode).json({ message: error.message });
        return;
    }
    console.error(error);
    response.status(500).json({ message: 'Internal server error' });
};
export const runRoute = (response, action) => {
    try {
        action();
    }
    catch (error) {
        handleRouteError(response, error);
    }
};
