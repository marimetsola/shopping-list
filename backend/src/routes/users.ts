import express from 'express';
const usersRouter = express.Router();
require('express-async-errors');
import userService from '../services/userService';

usersRouter.get('/', async (_req, res) => {
    const users = await userService.getAll();
    res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
    const users = await userService.getUser(req.params.id);
    res.json(users);
});

usersRouter.post('/', async (req, res) => {
    const body = req.body;
    const user = await userService.addUser(body.name, body.password);

    res.json(user);
});

export default usersRouter;