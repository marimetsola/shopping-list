import express from 'express';
import cors from 'cors';
import listRouter from './routes/lists';
import usersRouter from './routes/users';
import loginRouter from './routes/login';
require('express-async-errors');
import middleware from './utils/middleware';
const app = express();
import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
import './lib/env';
import * as path from 'path';

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

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use('/api/lists', listRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.get('/*', function (_req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.use(middleware.errorHandler);

export default app;