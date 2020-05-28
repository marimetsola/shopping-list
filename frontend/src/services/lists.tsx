import { ItemList, ItemType } from '../types';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

const getLists = async () => {
    const { data: listsFromApi } = await axios.get<ItemList[]>(
        `${apiBaseUrl}/lists`
    );

    return listsFromApi;
};

const addList = async (name: string) => {
    const { data: addedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists`, { name }
    );

    return addedList;
};

const deleteList = async (listID: string) => {
    await axios.delete(`${apiBaseUrl}/lists/${listID}`);
};

const addItem = async (listID: string, item: string) => {
    const addedItem = await axios.post<ItemType>(
        `${apiBaseUrl}/lists/${listID}/add-item`, { name: item }
    );
    return addedItem;
};

const deleteItem = async (listID: string, item: ItemType) => {
    await axios.delete<ItemList>(
        `${apiBaseUrl}/lists/${listID}/delete-item`, { data: { itemID: item.id } }
    );
};

const editItem = async (listID: string, item: ItemType) => {
    await axios.patch<ItemList>(
        `${apiBaseUrl}/lists/${listID}/edit-item`, { item }
    );
};

export default { getLists, addList, addItem, deleteItem, editItem, deleteList };