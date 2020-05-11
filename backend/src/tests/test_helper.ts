import ItemList from '../models/itemList';
import { ItemListType } from '../types';

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

export default { initialLists, listsInDb };