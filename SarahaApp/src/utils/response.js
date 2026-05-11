export const asyncHandler = (fn)=>{
    return async  (req, res, next) => {
        await fn(req, res, next).catch(error => {
            console.error("Error in asyncHandler:", error);
            returnres.status(500).json({ error_message: 'Internal Server Error' , error ,message: error.message, stack: error.stack });
        });
    }
}

export const successResponse = (res, statusCode, success, message, data) => {
    res.status(statusCode).json({
        success,
        message,
        data
    })
}
export const globalErrorHandler = (res, statusCode, success, message, error) => {
    res.status(statusCode).json({
        success,
        message,
        error
    })
}