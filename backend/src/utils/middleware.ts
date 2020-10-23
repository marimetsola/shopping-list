import { NextFunction, Request, Response } from 'express';

const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        response.status(401).json({
            error: 'invalid token'
        });
    } else if (error.message === 'invalid or expired token') {
        response.status(401).json({ error: error.message });
    }
    else {
        response.status(400).json({ error: error.message });
    }

    next(error);
};

export default { errorHandler };