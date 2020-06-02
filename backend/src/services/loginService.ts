import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';

const loginUser = async (name: string, password: string) => {
    const user = await User.findOne({ name });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        throw new Error('invalid username or password');
    }

    const userForToken = {
        user: user.name,
        id: user._id
    };

    if (process.env.JWT_SECRET) {
        const token = jwt.sign(userForToken, process.env.JWT_SECRET);
        return { name: user.name, token };
    }

    throw new Error('error signing token');
};

export default { loginUser };