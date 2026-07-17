import { HttpError } from '../errors/httpError.js';
export const ensureRequiredFields = (payload, fields, message) => {
    const missingField = fields.find((field) => !payload[field]);
    if (missingField) {
        throw new HttpError(400, message);
    }
};
