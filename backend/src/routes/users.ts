import express from 'express';
const usersRouter = express.Router();
require('express-async-errors');
import userService from '../services/userService';

usersRouter.get('/', async (_req, res) => {
    const users = await userService.getAll();
    res.json({"users": users.length});
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
        res.status(400).json({ error: error.message });
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
    try {
        const user = await userService.changeName(req);
        res.json(user);
    } catch (error) {
        if (error.message.includes('exists')) {
            res.status(400).json(error.message);
        } else {
            res.status(401).json(error.message);
        }
    }

});

usersRouter.patch('/:id/change-email', async (req, res) => {
    try {
        const user = await userService.changeEmail(req);
        res.json(user);
    } catch (error) {
        if (error.message.includes('password')) {
            res.status(401).json(error.message);
        } else {
            res.status(400).json(error.message);
        }
    }

});

usersRouter.patch('/:id/change-password', async (req, res) => {
    try {
        res.json(await userService.changePassword(req));
    } catch (error) {
        if (error.message === 'invalid password') {
            res.status(401).json(error.message);
        } else {
            res.status(400).json(error.message);
        }
    }

});

usersRouter.post('/send-reset-email', async (req, res) => {
    try {
        await userService.sendResetPasswordMail(req);
        res.status(200).json('recovery email sent');
    } catch (error) {
        res.status(400).json(error.message);
    }
});

usersRouter.post('/validate-token', async (req, res) => {
    const user = await userService.validateToken(req);
    res.status(200).json(user);

});

usersRouter.post('/reset-password/', async (req, res) => {
    const user = await userService.resetPassword(req);
    res.status(200).json(user);
});


export default usersRouter;