import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import listService from './listService';

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
        });
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

const addUser = async (name: string, password: string) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        passwordHash
    });

    return await user.save();
};

const setActiveList = async (req: express.Request) => {
    const { user, list } = await listService.authToList(req, req.body.listId);
    user.activeList = list;
    return user.save();
};

const clearActiveList = async (req: express.Request) => {
    const { user } = await listService.authUserOrGuestToList(req);
    // user.updateOne({ $unset: { activeList: "" } }, { new: true });
    user.activeList = undefined;
    return user.save();
};

export default {
    getUserFromReq,
    getUserFromToken,
    getAll,
    addUser,
    getUser,
    getUserByName,
    setActiveList,
    clearActiveList
};