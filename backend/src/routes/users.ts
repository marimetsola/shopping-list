import bcrypt from 'bcrypt';
import express from 'express';
const usersRouter = express.Router();
import User from '../models/user';

usersRouter.post('/', async (req, res) => {
    const body = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        name: body.name,
        passwordHash
    });

    const savedUser = await user.save();

    res.json(savedUser);
});

export default usersRouter;