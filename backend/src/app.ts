import express from 'express';
import listRouter from './routes/lists';
require('express-async-errors');
import middleware from './utils/middleware';
const app = express();
import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
import './lib/env';

let url = process.env.MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
    url = process.env.TEST_MONGODB_URI;
}

if (process.env.NODE_ENV !== 'test') {
    mongoose.connection.on('connected', () => {
        console.log('Connection Established');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('Connection Reestablished');
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Connection Disconnected');
    });

    mongoose.connection.on('close', () => {
        console.log('Connection Closed');
    });

    mongoose.connection.on('error', (error) => {
        console.log('ERROR: ' + error);
    });
}

if (url) {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} else {
    throw new Error('No mongodb url provided');
}

app.use(express.json());
app.use('/api/lists', listRouter);
app.use(middleware.errorHandler);

export default app;