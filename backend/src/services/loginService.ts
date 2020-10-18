import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';

const loginUser = async (name: string, password: string) => {
    const nameLowerCased = name.toLowerCase();
    let user;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(nameLowerCased)) {
        user = await User.findOne({ name: nameLowerCased });
    } else {
        user = await User.findOne({ email: nameLowerCased });
    }

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
        return { name: user.name, token, id: user.id };
    }

    throw new Error('error signing token');
};

export default { loginUser };