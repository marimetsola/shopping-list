import ItemList from '../models/itemList';
import Item from '../models/item';
import { ItemType } from '../types';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import express from 'express';
import itemList from '../models/itemList';

const getTokenFromReq = (req: express.Request) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

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
    const user = await User.findById(decodedToken.id);
    if (user) {
        return user;
    } else {
        throw Error('user not found');
    }
};

const getUserFromReq = async (req: express.Request) => {
    const token = getTokenFromReq(req);
    const user = await getUserFromToken(token);
    return user;
};

const authUserToList = async (req: express.Request) => {
    const listId = req.params.id;
    const token = getTokenFromReq(req);
    const user = await getUserFromToken(token);
    const list =
        await ItemList.findById(listId)
            .populate('user')
            .populate('items');
    if (!list) {
        throw Error('list not found');
    }

    if (user.id === list.user.id) {
        return { user, list };
    }

    throw Error('user not authorized');
};

// const getAll = () => {
//     const lists = ItemList.find({}).populate('items');
//     return lists;
// };

const getListsByUser = async (req: express.Request) => {
    const user = await getUserFromReq(req);
    if (user) {
        const listsByUser = await itemList.find({ user: user });
        return listsByUser;
    }
    return null;
};

const findById = async (req: express.Request) => {
    const { list } = await authUserToList(req);
    return list;
};

const addList = async (req: express.Request) => {
    const name = req.body.name;
    const user = await getUserFromReq(req);

    if (name) {
        const newList = new ItemList({ name, user: user.id });
        const savedList = await newList.save();
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
    const { list } = await authUserToList(req);

    const newItem = new Item({ name: itemName });
    await newItem.save();
    await ItemList.findByIdAndUpdate(list.id, { $push: { "items": newItem } }, { new: true }).populate('items');
    return newItem;
};

const deleteItem = async (req: express.Request) => {
    const itemId = req.params.itemId;
    // id: string, itemID: string
    const { list } = await authUserToList(req);
    if (list) {
        await Item.findByIdAndRemove(itemId);
        ItemList.findByIdAndUpdate(list.id, { $pull: { "items": { id: itemId } } }, { new: true });
    }
};

const editItem = async (req: express.Request) => {
    const item = req.body.item;
    const { user } = await authUserToList(req);
    if (user) {
        return await Item.findByIdAndUpdate(item.id, { name: item.name }, { new: true });
    }
    return null;
};

const updateList = async (req: express.Request) => {
    const items = req.body.items;
    if (!items || items.length === 0) {
        throw new Error('items not provided');
    }

    items.forEach((i: ItemType) => {
        if (!i) throw new Error('item with no name provided');
    });

    const { list } = await authUserToList(req);
    //req.params.id, req.body.items

    await Item.deleteMany({ list: list.id });

    const itemsToSave: ItemType[] = items.map((i: ItemType) => new Item({ name: i, list: list.id }));
    const itemObjects = await Item.insertMany(itemsToSave);

    const editedList = ItemList.findByIdAndUpdate(list.id, { items: itemObjects }, { new: true });
    return editedList;
};

export default {
    getListsByUser,
    findById,
    addList,
    deleteList,
    addItem,
    deleteItem,
    editItem,
    updateList
};