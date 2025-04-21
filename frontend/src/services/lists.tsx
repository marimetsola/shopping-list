import { ItemList, ItemType } from '../types';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

let token: string | null = null;

const config = () => ({
    headers: {
      Authorization: token ?? '', // fallback to empty string if token is null
    },
  });

const setToken = (newToken: string) => {
    token = `bearer ${newToken}`;
};

const getListsByUser = async () => {
    // const { data: listsFromApi } = await axios.get<ItemList[]>(
    //     `${apiBaseUrl}/lists`, config()
    // );

    const response = await axios.get<ItemList[]>(`${apiBaseUrl}/lists`, config());
    const listsFromApi = response.data;

    return listsFromApi;
};

const addList = async (name: string) => {
    const { data: addedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists`, { name }, config()
    );

    return addedList;
};

const editList = async (id: string, items: ItemType[]) => {
    return await axios.put<ItemList>(
        `${apiBaseUrl}/lists/${id}/update`, { items }, config()
    );
};

const deleteList = async (listID: string) => {
    await axios.delete(`${apiBaseUrl}/lists/${listID}`, config());
};

const addItem = async (listID: string, item: string) => {
    const addedItem = await axios.post<ItemType>(
        `${apiBaseUrl}/lists/${listID}/add-item`, { name: item }, config()
    );
    return addedItem;
};

const deleteItem = async (listID: string, itemId: string) => {
    await axios.delete<ItemList>(
        `${apiBaseUrl}/lists/${listID}/delete-item/${itemId}`, config()
    );
};

const editItem = async (listID: string, item: ItemType) => {
    await axios.patch<ItemList>(
        `${apiBaseUrl}/lists/${listID}/edit-item`, { item }, config()
    );
};

const markItem = async (listID: string, item: ItemType) => {
    await axios.patch<ItemList>(
        `${apiBaseUrl}/lists/${listID}/mark-item`, { item }, config()
    );
};

const inviteGuest = async (listID: string, guestName: string) => {
    const { data: editedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/invite-guest`, { guestName }, config()
    );

    return editedList;
};

const uninviteGuest = async (listID: string, guestId: string) => {
    const { data: editedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/uninvite-guest`, { guestId }, config()
    );

    return editedList;
};

const acceptInvitation = async (listID: string, user: string) => {
    const { data: editedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/accept-invite`, { user }, config()
    );

    return editedList;
};

const declineInvitation = async (listID: string, user: string) => {
    const { data: editedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/decline-invite`, { user }, config()
    );

    return editedList;
};

const leaveList = async (listID: string) => {
    const { data: editedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/leave-list`, {}, config()
    );

    return editedList;
};

const removeGuest = async (listID: string, guestId: string) => {
    const { data: editedList } = await axios.post<ItemList>(
        `${apiBaseUrl}/lists/${listID}/remove-guest`, { guestId }, config()
    );

    return editedList;
};

export default {
    config,
    setToken,
    getListsByUser,
    addList,
    addItem,
    deleteItem,
    editItem,
    markItem,
    deleteList,
    editList,
    inviteGuest,
    uninviteGuest,
    acceptInvitation,
    declineInvitation,
    leaveList,
    removeGuest
};