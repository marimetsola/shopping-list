import { ItemList } from '../types';
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
    await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/add-item`, { name: item }
    );
};

const deleteItem = async (listID: string, item: string) => {
    await axios.delete<ItemList>(
        `${apiBaseUrl}/lists/${listID}/delete-item`, { data: { name: item } }
    );
};

export default { getLists, addList, addItem, deleteItem, deleteList };