export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;

    if (statusCode === 500) {
        console.error(err);
    }

    res.status(statusCode).json({ message });
};
