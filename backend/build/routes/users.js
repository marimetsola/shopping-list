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
    const users = yield userService_1.default.getAll();
    res.json(users);
}));
usersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService_1.default.getUser(req.params.id);
    res.json(users);
}));
usersRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield userService_1.default.addUser(body.name, body.password);
    res.json(user);
}));
usersRouter.patch('/:id/set-active-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.setActiveList(req);
    res.json(user);
}));
usersRouter.patch('/:id/clear-active-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.clearActiveList(req);
    res.json(user);
}));
exports.default = usersRouter;
