"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, _request, response, next) => {
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        response.status(401).json({
            error: 'invalid token'
        });
    }
    else {
        response.status(400).json({ error: error.message });
    }
    next(error);
};
exports.default = { errorHandler };
