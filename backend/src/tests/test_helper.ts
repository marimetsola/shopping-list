import ItemList from '../models/itemList';
import { ItemListType } from '../types';
import User from '../models/user';

const initialLists = [
    {
        name: "Prisma"
    },
    {
        name: "Lidl"
    }
];

const listsInDb = async () => {
    const lists = await ItemList.find({});
    return lists.map((list: ItemListType) => list.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

export default { initialLists, listsInDb, usersInDb };