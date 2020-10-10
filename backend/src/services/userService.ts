import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import listService from './listService';
// import nodemailer from 'nodemailer';

const getUserFromToken = async (token: string | null) => {
    if (!token) {
        throw Error('token missing');
    }

    if (!process.env.JWT_SECRET) {
        throw Error('jwt secret missing');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as any;
    if (!decodedToken.id) {
        throw Error('token invalid');
    }
    const user = await User.findById(decodedToken.id)
        .populate({
            path: 'lists',
            populate: {
                path: 'items',
                model: 'Item'
            }
        })
        .populate({
            path: 'guestLists',
            populate: {
                path: 'items',
                model: 'Item'
            }
        })
        .populate({
            path: 'guestLists',
            populate: {
                path: 'guests',
                model: 'User'
            }
        })
        .populate('invitedGuests')
        .populate('activeList');
    if (user) {
        return user;
    } else {
        throw Error('user not found');
    }
};

const getUserFromReq = async (req: express.Request) => {
    const token = listService.getTokenFromReq(req);
    const user = await getUserFromToken(token);
    return user;
};

const getAll = async () => {
    return await User.find({});
};

const getUser = async (id: string) => {
    const user = await User.findById(id)
        .populate({
            path: 'lists',
            populate: {
                path: 'items',
                model: 'Item'
            }
        })
        .populate({
            path: 'activeList',
            populate: {
                path: 'items',
                model: 'Item'
            }
        })
        .populate({
            path: 'activeList',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        .populate({
            path: 'activeList',
            populate: {
                path: 'invitedGuests',
                model: 'User'
            }
        })
        .populate({
            path: 'activeList',
            populate: {
                path: 'guests',
                model: 'User'
            }
        })
        .populate({
            path: 'listInvitations',
            populate: {
                path: 'user',
                model: 'User'
            }
        });
    return user;
};

const getUserByName = async (name: string) => {
    return await User.findOne({ name });
};

const getUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};

const validateEmail = (email: string) => {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailRe.test(String(email).toLowerCase())) {
        return email;
    }
    return null;
};

const addUser = async (name: string, email: string, password: string) => {

    if (password.length < 5) {
        throw Error(`Password is too short. Please use at least 5 characters`);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        passwordHash
    });

    const validatedEmail = validateEmail(email);

    if (validatedEmail) {
        user.email = validatedEmail;
    }

    return await user.save();
};

const setActiveList = async (req: express.Request) => {
    const { user, list } = await listService.authToList(req, req.body.listId);
    user.activeList = list;
    return user.save();
};

const clearActiveList = async (req: express.Request) => {
    const user = await getUserFromReq(req);
    // user.updateOne({ $unset: { activeList: "" } }, { new: true });
    user.activeList = undefined;
    return user.save();
};

const changeName = async (req: express.Request) => {
    const user = await getUserFromReq(req);
    const desiredName = req.body.name;
    if (await User.findOne({ name: desiredName })) {
        throw Error(`user with the name ${desiredName} already exists`);
    } else {
        user.name = desiredName;
        return await user.save();
    }
};

const changeEmail = async (req: express.Request) => {
    const user = await getUserFromReq(req);
    const desiredEmail = req.body.email.toLowerCase();
    if (await User.findOne({ email: desiredEmail })) {
        throw Error(`email adress ${desiredEmail} is already in use`);
    } else {
        const validatedEmail = validateEmail(desiredEmail);
        if (validatedEmail) {
            user.email = desiredEmail;
            return await user.save();
        } else {
            throw Error(`${desiredEmail} is not a proper email adress`);
        }
    }
};

const changePassword = async (req: express.Request) => {
    const user = await getUserFromReq(req);
    const password = req.body.password;

    if (password.length < 5) {
        throw Error(`Password is too short. Use at least 5 characters`);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    user.passwordHash = passwordHash;

    return await user.save();
};

const resetPassword = async (req: express.Request) => {
    // const user = await getUserFromReq(req);
    // const desiredEmail = req.body.email.toLowerCase();
    // if (await User.findOne({ email: desiredEmail })) {
    //     throw Error(`email adress ${desiredEmail} is already in use`);
    // } else {
    //     const validatedEmail = validateEmail(desiredEmail);
    //     if (validatedEmail) {
    //         user.email = desiredEmail;
    //         return await user.save();
    //     } else {
    //         throw Error(`${desiredEmail} is not a proper email adress`);
    //     }
    // }
};

export default {
    getUserFromReq,
    getUserFromToken,
    getAll,
    addUser,
    getUser,
    getUserByName,
    getUserByEmail,
    setActiveList,
    clearActiveList,
    changeName,
    changeEmail,
    changePassword,
    resetPassword
};