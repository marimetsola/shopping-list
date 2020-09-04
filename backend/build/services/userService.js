"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const listService_1 = __importDefault(require("./listService"));
const getUserFromToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw Error('token missing');
    }
    if (!process.env.JWT_SECRET) {
        throw Error('jwt secret missing');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.id) {
        throw Error('token invalid');
    }
    const user = yield user_1.default.findById(decodedToken.id)
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
    }
    else {
        throw Error('user not found');
    }
});
const getUserFromReq = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = listService_1.default.getTokenFromReq(req);
    const user = yield getUserFromToken(token);
    return user;
});
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.find({});
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(id)
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
});
const getUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findOne({ name });
});
const validateEmail = (email) => {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRe.test(String(email).toLowerCase())) {
        return email;
    }
    return null;
};
const addUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    const user = new user_1.default({
        name,
        passwordHash
    });
    const validatedEmail = validateEmail(email);
    if (validatedEmail) {
        user.email = validatedEmail;
    }
    return yield user.save();
});
const setActiveList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, list } = yield listService_1.default.authToList(req, req.body.listId);
    user.activeList = list;
    return user.save();
});
const clearActiveList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserFromReq(req);
    // user.updateOne({ $unset: { activeList: "" } }, { new: true });
    user.activeList = undefined;
    return user.save();
});
const changeName = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserFromReq(req);
    const desiredName = req.body.name;
    if (yield user_1.default.findOne({ name: desiredName })) {
        throw Error(`user with the name ${desiredName} already exists`);
    }
    else {
        user.name = desiredName;
        return yield user.save();
    }
});
const changeEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserFromReq(req);
    const desiredEmail = req.body.email.toLowerCase();
    if (yield user_1.default.findOne({ email: desiredEmail })) {
        throw Error(`email adress ${desiredEmail} is already in use`);
    }
    else {
        const validatedEmail = validateEmail(desiredEmail);
        if (validatedEmail) {
            user.email = desiredEmail;
            return yield user.save();
        }
        else {
            throw Error(`${desiredEmail} is not a proper email adress`);
        }
    }
});
exports.default = {
    getUserFromReq,
    getUserFromToken,
    getAll,
    addUser,
    getUser,
    getUserByName,
    setActiveList,
    clearActiveList,
    changeName,
    changeEmail
};
