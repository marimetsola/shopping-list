import ItemList from '../models/itemList';
import Item from '../models/item';
import { ItemType } from '../types';
import express from 'express';
import itemList from '../models/itemList';
import userService from './userService';

const getTokenFromReq = (req: express.Request) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

const authUserToList = async (req: express.Request) => {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const user = await userService.getUserFromToken(token);
    const list =
        await ItemList.findById(listId)
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
};

const authGuestToList = async (req: express.Request) => {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const guestUser = await userService.getUserFromToken(token);
    const list =
        await ItemList.findById(listId)
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
};

const authToList = async (req: express.Request, listId: string) => {
    const token = getTokenFromReq(req);
    const user = await userService.getUserFromToken(token);
    const list =
        await ItemList.findById(listId)
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
};

const authUserOrGuestToList = async (req: express.Request) => {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const user = await userService.getUserFromToken(token);
    const list =
        await ItemList.findById(listId)
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
};

// const getAll = () => {
//     const lists = ItemList.find({}).populate('items');
//     return lists;
// };

const getListsByUser = async (req: express.Request) => {
    const user = await userService.getUserFromReq(req);
    if (user) {
        const listsByUser = await itemList.find({ user: user })
            .populate('items')
            .populate('invitedGuests')
            .populate('user')
            .populate('guests');
        return listsByUser;
    }
    return null;
};

const getGuestListsByUser = async (req: express.Request) => {
    const user = await userService.getUserFromReq(req);
    if (user) {
        return user.guestLists;
    }
    return null;
};

const findById = async (req: express.Request) => {
    const { list } = await authUserToList(req);
    return list;
};

const addList = async (req: express.Request) => {
    const name = req.body.name;
    const user = await userService.getUserFromReq(req);

    if (name) {
        const newList = new ItemList({ name, user: user.id });
        const savedList = await newList.save();
        savedList.populate('user').execPopulate();
        user.lists = user.lists.concat(savedList);
        await user.save();
        return savedList;
    } else {
        throw Error('list name missing');
    }
};

const deleteList = async (req: express.Request) => {
    const { user, list } = await authUserToList(req);

    if (user.id === list.user.id) {
        await list.remove();
    }
};

const addItem = async (req: express.Request) => {
    const itemName = req.body.name;
    if (!itemName) throw Error('item name not provided');
    const { list } = await authUserOrGuestToList(req);

    const newItem = new Item({ name: itemName });
    newItem.list = list.id;
    await newItem.save();
    await ItemList.findByIdAndUpdate(list.id, { $push: { "items": newItem } }, { new: true }).populate('items');
    return newItem;
};

const deleteItem = async (req: express.Request) => {
    const itemId = req.params.itemId;
    // id: string, itemID: string
    const { list } = await authUserOrGuestToList(req);
    if (list) {
        await Item.findByIdAndRemove(itemId);
        ItemList.findByIdAndUpdate(list.id, { $pull: { "items": { id: itemId } } }, { new: true });
    }
};

const editItem = async (req: express.Request) => {
    const item = req.body.item;
    const { user } = await authUserOrGuestToList(req);
    if (user) {
        return await Item.findByIdAndUpdate(item.id, { name: item.name }, { new: true });
    }
    return null;
};

const markItem = async (req: express.Request) => {
    const item: ItemType = req.body.item;
    const { user } = await authUserOrGuestToList(req);
    if (user) {
        return await Item.findByIdAndUpdate(item.id, { strikethrough: !item.strikethrough }, { new: true });
    }
    return null;
};

const updateList = async (req: express.Request) => {
    const items = req.body.items;
    if (!items || items.length === 0) {
        throw new Error('items not provided');
    }

    items.forEach((i: ItemType) => {
        if (!i.name) throw new Error('item with no name provided');
    });

    const { list } = await authUserOrGuestToList(req);

    await Item.deleteMany({ list: list.id });

    const itemsToSave: ItemType[] = items.map((i: ItemType) => new Item({ name: i.name, list: list.id, strikethrough: i.strikethrough }));
    const itemObjects = await Item.insertMany(itemsToSave);

    const editedList = ItemList.findByIdAndUpdate(list.id, { items: itemObjects }, { new: true });
    return editedList;
};

export default {
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