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
const itemList_1 = __importDefault(require("../models/itemList"));
const item_1 = __importDefault(require("../models/item"));
const itemList_2 = __importDefault(require("../models/itemList"));
const userService_1 = __importDefault(require("./userService"));
const getTokenFromReq = (req) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};
const authUserToList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const user = yield userService_1.default.getUserFromToken(token);
    const list = yield itemList_1.default.findById(listId)
        .populate('user')
        .populate('items')
        .populate('invitedGuests')
        .populate('guests');
    if (!list) {
        throw Error('list not found');
    }
    if (user.id === list.user.id) {
        return { user, list };
    }
    throw Error('user not authorized');
});
const authGuestToList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const guestUser = yield userService_1.default.getUserFromToken(token);
    const list = yield itemList_1.default.findById(listId)
        .populate('user')
        .populate('items')
        .populate('guests');
    if (!list) {
        throw Error('list not found');
    }
    if (list.guests.map(g => g.id).includes(guestUser.id)) {
        return { user: guestUser, list };
    }
    throw Error('user not authorized');
});
const authToList = (req, listId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getTokenFromReq(req);
    const user = yield userService_1.default.getUserFromToken(token);
    const list = yield itemList_1.default.findById(listId)
        .populate('user')
        .populate('items')
        .populate('guests')
        .populate('invitedGuests');
    if (!list) {
        throw Error('list not found');
    }
    if (user.id === list.user.id) {
        return { user, list };
    }
    if (list.guests.map(g => g.id).includes(user.id)) {
        return { user, list };
    }
    throw Error('user not authorized');
});
const authUserOrGuestToList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const user = yield userService_1.default.getUserFromToken(token);
    const list = yield itemList_1.default.findById(listId)
        .populate('user')
        .populate('items')
        .populate('guests');
    if (!list) {
        throw Error('list not found');
    }
    if (user.id === list.user.id) {
        return { user, list };
    }
    if (list.guests.map(g => g.id).includes(user.id)) {
        return { user, list };
    }
    throw Error('user not authorized');
});
// const getAll = () => {
//     const lists = ItemList.find({}).populate('items');
//     return lists;
// };
const getListsByUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.getUserFromReq(req);
    if (user) {
        const listsByUser = yield itemList_2.default.find({ user: user })
            .populate('items')
            .populate('invitedGuests')
            .populate('user')
            .populate('guests');
        return listsByUser;
    }
    return null;
});
const getGuestListsByUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.getUserFromReq(req);
    if (user) {
        return user.guestLists;
    }
    return null;
});
const findById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { list } = yield authUserToList(req);
    return list;
});
const addList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const user = yield userService_1.default.getUserFromReq(req);
    if (name) {
        const newList = new itemList_1.default({ name, user: user.id });
        const savedList = yield newList.save();
        savedList.populate('user').execPopulate();
        user.lists = user.lists.concat(savedList);
        yield user.save();
        return savedList;
    }
    else {
        throw Error('list name missing');
    }
});
const deleteList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, list } = yield authUserToList(req);
    if (user.id === list.user.id) {
        yield list.remove();
    }
});
const addItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const itemName = req.body.name;
    if (!itemName)
        throw Error('item name not provided');
    const { list } = yield authUserOrGuestToList(req);
    const newItem = new item_1.default({ name: itemName });
    newItem.list = list.id;
    yield newItem.save();
    yield itemList_1.default.findByIdAndUpdate(list.id, { $push: { "items": newItem } }, { new: true }).populate('items');
    return newItem;
});
const deleteItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.itemId;
    // id: string, itemID: string
    const { list } = yield authUserOrGuestToList(req);
    if (list) {
        yield item_1.default.findByIdAndRemove(itemId);
        itemList_1.default.findByIdAndUpdate(list.id, { $pull: { "items": { id: itemId } } }, { new: true });
    }
});
const editItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body.item;
    const { user } = yield authUserOrGuestToList(req);
    if (user) {
        return yield item_1.default.findByIdAndUpdate(item.id, { name: item.name }, { new: true });
    }
    return null;
});
const markItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const item = req.body.item;
    const { user } = yield authUserOrGuestToList(req);
    if (user) {
        return yield item_1.default.findByIdAndUpdate(item.id, { strikethrough: !item.strikethrough }, { new: true });
    }
    return null;
});
const updateList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const items = req.body.items;
    if (!items || items.length === 0) {
        throw new Error('items not provided');
    }
    items.forEach((i) => {
        if (!i.name)
            throw new Error('item with no name provided');
    });
    const { list } = yield authUserOrGuestToList(req);
    yield item_1.default.deleteMany({ list: list.id });
    const itemsToSave = items.map((i) => new item_1.default({ name: i.name, list: list.id, strikethrough: i.strikethrough }));
    const itemObjects = yield item_1.default.insertMany(itemsToSave);
    const editedList = itemList_1.default.findByIdAndUpdate(list.id, { items: itemObjects }, { new: true });
    return editedList;
});
exports.default = {
    getTokenFromReq,
    getListsByUser,
    getGuestListsByUser,
    findById,
    addList,
    deleteList,
    addItem,
    deleteItem,
    editItem,
    markItem,
    updateList,
    authUserToList,
    authGuestToList,
    authUserOrGuestToList,
    authToList
};
