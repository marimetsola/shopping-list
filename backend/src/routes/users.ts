import express from 'express';
const usersRouter = express.Router();
require('express-async-errors');
import userService from '../services/userService';

usersRouter.get('/', async (_req, res) => {
    const users = await userService.getAll();
    res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
    const user = await userService.getUser(req.params.id);
    res.json(user);
});

usersRouter.get('/find-email/:email', async (req, res) => {
    const user = await userService.getUserByEmail(req.params.email);
    res.json(user);
});

usersRouter.post('/', async (req, res) => {
    const body = req.body;
    try {
        const user = await userService.addUser(body.name, body.email, body.password);

        res.json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }

});

usersRouter.patch('/:id/set-active-list', async (req, res) => {
    const user = await userService.setActiveList(req);
    res.json(user);
});

usersRouter.patch('/:id/clear-active-list', async (req, res) => {
    const user = await userService.clearActiveList(req);
    res.json(user);
});

usersRouter.patch('/:id/change-name', async (req, res) => {
    const user = await userService.changeName(req);
    res.json(user);
});

usersRouter.patch('/:id/change-email', async (req, res) => {
    const user = await userService.changeEmail(req);
    res.json(user);
});

usersRouter.patch('/:id/change-password', async (req, res) => {
    res.json(await userService.changePassword(req));
});

usersRouter.post('reset-password', async (req, res) => {
    res.json(await userService.resetPassword(req));
});

export default usersRouter;