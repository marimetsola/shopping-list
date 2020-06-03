import ItemList from '../models/itemList';
import Item from '../models/item';
import { ItemType } from '../types';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const getTokenFrom = (req: any) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

const getAll = () => {
    const lists = ItemList.find({}).populate('items');
    return lists;
};

const findById = (id: string) => {
    const list = ItemList.findById(id).populate('items');
    return list;
};

const addList = async (req: any) => {
    const userId = req.body.userId;
    const name = req.body.name;
    const token = getTokenFrom(req);

    if (process.env.JWT_SECRET) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!token || (typeof (decodedToken) === Object && !decodedToken.id)) {
            throw Error('token missing or invalid');
        }
        const user = await User.findById(userId);
        if (name && user) {
            const newList = new ItemList({ name, user: user.id });
            const savedList = await newList.save();
            user.lists = user.lists.concat(savedList);
            await user.save();
            return savedList;
        } else {
            throw new Error('list name missing or user missing');
        }
    }
};

const deleteList = (id: string) => {
    return ItemList.findByIdAndRemove(id);
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