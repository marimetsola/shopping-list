import ItemList from '../models/itemList';
import Item from '../models/item';
import { ItemType } from '../types';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import express from 'express';

const getTokenFrom = (req: express.Request) => {
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
    const token = getTokenFrom(req);
    const user = await getUserFromToken(token);
    return user;
};

const authUserToList = async (req: express.Request) => {
    const listId = req.params.id;
    const token = getTokenFrom(req);
    const user = await getUserFromToken(token);
    const list = await ItemList.findById(listId).populate('user');
    if (!list) {
        throw Error('list not found');
    }

    if (user.id === list.user.id) {
        return list;
    }
};

const getAll = () => {
    // const token = getTokenFrom(req);
    // const user = getUserFromToken(token);
    const lists = ItemList.find({}).populate('items');
    return lists;
};

const findById = async (req: express.Request) => {
    // const list = ItemList.findById(req.params.id).populate('items');
    // return list;

    const list = authUserToList(req);
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
    const listId = req.params.id;
    const token = getTokenFrom(req);
    const user = await getUserFromToken(token);
    const list = await ItemList.findById(listId).populate('user');

    if (!list) {
        throw Error('list not found');
    }

    if (user.id === list.user.id) {
        return await list.remove();
    } else {
        throw Error('user not authorized to delete the list');
    }

};

const addItem = async (id: string, itemName: string) => {
    if (!itemName) throw new Error('item name not provided');
    const newItem = new Item({ name: itemName });
    await newItem.save();
    await ItemList.findByIdAndUpdate(id, { $push: { "items": newItem } }, { new: true }).populate('items');
    return newItem;
};

const deleteItem = async (id: string, itemID: string) => {
    await Item.findByIdAndRemove(itemID);
    return ItemList.findByIdAndUpdate(id, { $pull: { "items": { id: itemID } } }, { new: true });
    // return ItemList.findById(id);
};

const editItem = async (item: ItemType) => {
    return await Item.findByIdAndUpdate(item.id, { name: item.name }, { new: true });
};

const updateList = async (id: string, items: ItemType[]) => {
    if (!items || items.length === 0) {
        throw new Error('items not provided');
    }

    items.forEach(i => {
        if (!i) throw new Error('item with no name provided');
    });

    await Item.deleteMany({ list: id });

    const itemsToSave = items.map(i => new Item({ name: i.name, list: id }));
    const itemObjects = await Item.insertMany(itemsToSave);

    const list = ItemList.findByIdAndUpdate(id, { items: itemObjects }, { new: true });
    return list;
};

export default {
    getAll,
    findById,
    addList,
    deleteList,
    addItem,
    deleteItem,
    editItem,
    updateList
};