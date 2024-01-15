"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
require('express-async-errors');
const userService_1 = __importDefault(require("../services/userService"));
usersRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const users = await userService.getAll();
    res.json("Users");
}));
usersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.getUser(req.params.id);
    res.json(user);
}));
usersRouter.get('/find-email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.getUserByEmail(req.params.email);
    res.json(user);
}));
usersRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield userService_1.default.addUser(body.name, body.email, body.password);
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
usersRouter.patch('/:id/set-active-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.setActiveList(req);
    res.json(user);
}));
usersRouter.patch('/:id/clear-active-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.clearActiveList(req);
    res.json(user);
}));
usersRouter.patch('/:id/change-name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.changeName(req);
        res.json(user);
    }
    catch (error) {
        if (error.message.includes('exists')) {
            res.status(400).json(error.message);
        }
        else {
            res.status(401).json(error.message);
        }
    }
}));
usersRouter.patch('/:id/change-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.changeEmail(req);
        res.json(user);
    }
    catch (error) {
        if (error.message.includes('password')) {
            res.status(401).json(error.message);
        }
        else {
            res.status(400).json(error.message);
        }
    }
}));
usersRouter.patch('/:id/change-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield userService_1.default.changePassword(req));
    }
    catch (error) {
        if (error.message === 'invalid password') {
            res.status(401).json(error.message);
        }
        else {
            res.status(400).json(error.message);
        }
    }
}));
usersRouter.post('/send-reset-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userService_1.default.sendResetPasswordMail(req);
        res.status(200).json('recovery email sent');
    }
    catch (error) {
        res.status(400).json(error.message);
    }
}));
usersRouter.post('/validate-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.validateToken(req);
    res.status(200).json(user);
}));
usersRouter.post('/reset-password/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.resetPassword(req);
    res.status(200).json(user);
}));
exports.default = usersRouter;
