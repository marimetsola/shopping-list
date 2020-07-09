import express from 'express';
const loginRouter = express.Router();
import loginService from '../services/loginService';

loginRouter.post('/', async (req, res) => {
    const body = req.body;
    try {
        const loginData = await loginService.loginUser(body.name, body.password);
        return res
            .status(200)
            .send({ token: loginData.token, name: loginData.name, id: loginData.id });
    } catch (error) {
        return res.status(401).json({
            error: error.message
        });
    }
});

export default loginRouter;