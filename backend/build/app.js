"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const lists_1 = __importDefault(require("./routes/lists"));
const users_1 = __importDefault(require("./routes/users"));
const login_1 = __importDefault(require("./routes/login"));
require('express-async-errors');
const middleware_1 = __importDefault(require("./utils/middleware"));
const app = express_1.default();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.set('useCreateIndex', true);
require("./lib/env");
// import * as path from 'path';
let url = process.env.MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
    url = process.env.TEST_MONGODB_URI;
}
if (process.env.NODE_ENV !== 'test') {
    mongoose_1.default.connection.on('connected', () => {
        console.log('Connection Established');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        console.log('Connection Reestablished');
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('Connection Disconnected');
    });
    mongoose_1.default.connection.on('close', () => {
        console.log('Connection Closed');
    });
    mongoose_1.default.connection.on('error', (error) => {
        console.log('ERROR: ' + error);
    });
}
if (url) {
    mongoose_1.default.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
else {
    throw new Error('No mongodb url provided');
}
// app.use(express.static('build'));
app.use(cors_1.default());
app.use(express_1.default.json());
app.use('/kauppalappu/api/lists', lists_1.default);
app.use('/kauppalappu/api/users', users_1.default);
app.use('/kauppalappu/api/login', login_1.default);
// app.get('/*', function (_req, res) {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
app.use(middleware_1.default.errorHandler);
exports.default = app;
