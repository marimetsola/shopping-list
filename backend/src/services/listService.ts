import ItemList from '../models/itemList';
import Item from '../models/item';
import { ItemType } from '../types';
import User from '../models/user';

const getAll = () => {
    const lists = ItemList.find({}).populate('items');
    return lists;
};

const findById = (id: string) => {
    const list = ItemList.findById(id).populate('items');
    return list;
};

const addList = async (name: string, userId: string) => {
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