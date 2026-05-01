
export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'HttpError';
    }
}

export const asyncHandler = (handler) => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode === 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        message: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
export const successResponse = (res, {
    statusCode = 200,
    message = 'Success',
    data = null
} = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};