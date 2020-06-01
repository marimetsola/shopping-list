import User from '../models/user';
import bcrypt from 'bcrypt';

const getAll = async () => {
    return await User.find({});
};

const getUser = async (id: string) => {
    return await User.findById(id).populate('lists');
};

const addUser = async (name: string, password: string) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        passwordHash
    });

    return await user.save();
};

export default {
    getAll,
    addUser,
    getUser
};