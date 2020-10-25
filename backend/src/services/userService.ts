import User from '../models/user';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
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
        throw Error('Password is too short. Please use at least 5 characters');
    }

    if (name.length < 3) {
        throw Error('Name is too short. Please use at least 3 characters.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name: name,
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
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordCorrect) {
        throw Error('invalid password');
    }
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
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordCorrect) {
        throw Error('invalid password');
    }
    if (await User.findOne({ email: desiredEmail })) {
        throw Error(`Email address is already in use.`);
    } else {
        const validatedEmail = validateEmail(desiredEmail);
        if (validatedEmail) {
            user.email = desiredEmail;
            return await user.save();
        } else {
            throw Error(`Invalid email address.`);
        }
    }
};

const changePassword = async (req: express.Request) => {
    const user = await getUserFromReq(req);
    const newPassword = req.body.newPassword;

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(req.body.oldPassword, user.passwordHash);

    if (!passwordCorrect) {
        throw Error("invalid password");
    }

    if (newPassword.length < 5) {
        throw Error("password is too short");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    user.passwordHash = passwordHash;

    return await user.save();
};

const sendResetPasswordMail = async (req: express.Request) => {
    const email = req.body.email;
    if (!email) {
        throw Error("email not found");
    }

    const user = await User.findOne({ email });

    if (user) {
        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL_USER}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            }
        });

        const mailOptions = {
            from: 'Kauppalappu app',
            to: `${user.email}`,
            subject: 'Link to reset password',
            text:
                'You are receiving this because you (or someone else) have requested the reset of the password for your Kauppalappu app account.\n\n'
                + 'Please click the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                // + `http://localhost:3000/users/reset-password/${token} \n\n`
                + `https://lappu.herokuapp.com/users/reset-password/${token} \n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.error('there was an error sending mail: ', err);
            } else {
                return res.status(200).json('recovery email sent');
            }
        });
    } else {
        throw Error("email not in use");
    }

};


const validateToken = async (req: express.Request) => {
    const token = req.body.token;
    const user = await User.findOne({ resetPasswordToken: token });
    if (user && user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
        return { id: user.id };
    } else {
        throw Error("invalid or expired token");
    }

};

const resetPassword = async (req: express.Request) => {
    const user = await getUserByEmail(req.body.email);
    const password = req.body.password;

    if (user) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        user.passwordHash = passwordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        return await user.save();
    } else {
        return null;
    }
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
    sendResetPasswordMail,
    validateToken,
    resetPassword
};