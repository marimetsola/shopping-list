import { ItemList, ItemType } from '../types';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

let token: string | null = null;

const config = () => ({ headers: { Authorization: token } });

const setToken = (newToken: string) => {
    token = `bearer ${newToken}`;
};

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

const editList = async (id: string, items: ItemType[]) => {
    return await axios.put<ItemList>(
        `${apiBaseUrl}/lists/${id}/update`, { items }
    );
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

const deleteItem = async (listID: string, itemID: string) => {
    await axios.delete<ItemList>(
        `${apiBaseUrl}/lists/${listID}/delete-item`, { data: { itemID } }
    );
};

const editItem = async (listID: string, item: ItemType) => {
    await axios.patch<ItemList>(
        `${apiBaseUrl}/lists/${listID}/edit-item`, { item }
    );
};

export default { setToken, getLists, addList, addItem, deleteItem, editItem, deleteList, editList };