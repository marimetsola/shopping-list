import ItemList from '../models/itemList';

const getAll = () => {
    const lists = ItemList.find({});
    return lists;
};

const findById = (id: string) => {
    const list = ItemList.findById(id);
    return list;
};

const addList = (name: string) => {
    if (name) {
        const newList = new ItemList({ name });
        const savedList = newList.save();
        return savedList;
    } else {
        throw new Error('list name missing');
    }

};

const deleteList = (id: string) => {
    return ItemList.findByIdAndRemove(id);
};

const addItem = (id: string, itemName: string) => {
    if (!itemName) throw new Error('item name not provided');
    return ItemList.findByIdAndUpdate(id, { $push: { "items": itemName } }, { new: true });
};

const deleteItem = (id: string, itemName: string) => {
    return ItemList.findByIdAndUpdate(id, { $pull: { "items": itemName } }, { new: true });
};

const updateList = (id: string, items: string[]) => {
    if (!items || items.length === 0) {
        throw new Error('items not provided');
    }

    items.forEach(i => {
        if (!i) throw new Error('item with no name provided');
    });

    const list = ItemList.findByIdAndUpdate(id, { items }, { new: true });
    return list;
};

export default {
    getAll,
    findById,
    addList,
    deleteList,
    addItem,
    deleteItem,
    updateList
};