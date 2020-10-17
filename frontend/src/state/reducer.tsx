import React from 'react';
import { State } from "./state";
import { ItemList, ItemType, User } from "../types";
import listService from '../services/lists';
import userService from '../services/users';
import { ModalType } from '../types';

export type Action =
    | {
        type: "SET_DEVICE_TO_DESKTOP";
        payload: boolean;
    }
    | {
        type: "SET_LISTS";
        payload: ItemList[];
    }
    | {
        type: "SET_ACTIVE_LIST";
        payload: ItemList;
    }
    | {
        type: "CLEAR_ACTIVE_LIST";
    }
    | {
        type: "ADD_LIST";
        payload: ItemList;
    }
    | {
        type: "EDIT_LIST";
        payload: ItemList;
    }
    | {
        type: "DELETE_LIST";
        payload: ItemList;
    }
    | {
        type: "OPEN_LIST_MODAL";
    }
    | {
        type: "CLOSE_LIST_MODAL";
    }
    | {
        type: "ADD_ITEM";
        payload: { list: ItemList; item: ItemType };
    }
    | {
        type: "DELETE_ITEM";
        payload: { list: ItemList; item: ItemType };
    }
    | {
        type: "EDIT_ITEM";
        payload: { list: ItemList; editedItem: ItemType };
    }
    | {
        type: "MARK_ITEM";
        payload: { list: ItemList; editedItem: ItemType };
    }
    | {
        type: "SET_USER";
        payload: { user: User };
    }
    | {
        type: "DISCARD_USER";
    }
    | {
        type: "INVITE_GUEST";
        payload: { list: ItemList };
    }
    | {
        type: "UNINVITE_GUEST";
        payload: { list: ItemList };
    }
    | {
        type: "ACCEPT_INVITATION";
        payload: { list: ItemList; user: User };
    }
    | {
        type: "DECLINE_INVITATION";
        payload: { list: ItemList; user: User };
    }
    | {
        type: "LEAVE_LIST";
        payload: { list: ItemList };
    }
    | {
        type: "REMOVE_GUEST";
        payload: { list: ItemList };
    }
    | {
        type: "CHANGE_USER_NAME";
        payload: { user: User };
    }
    | {
        type: "CHANGE_USER_EMAIL";
        payload: { user: User };
    } | {
        type: "SET_OPEN_MODAL_TYPE";
        payload: { modal: ModalType };
    };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_DEVICE_TO_DESKTOP":
            return {
                ...state,
                isDesktop: action.payload
            };
        case "SET_LISTS":
            return {
                ...state,
                lists: action.payload
            };
        case "SET_ACTIVE_LIST":
            return {
                ...state,
                activeList: action.payload
            };
        case "CLEAR_ACTIVE_LIST":
            return {
                ...state,
                activeList: null
            };
        case "OPEN_LIST_MODAL":
            return {
                ...state,
                listModalOpen: true
            };
        case "CLOSE_LIST_MODAL":
            return {
                ...state,
                listModalOpen: false
            };
        case "ADD_LIST":
            return {
                ...state,
                lists: [...state.lists, action.payload]
            };
        case "EDIT_LIST":
            return {
                ...state,
                activeList: action.payload
            };
        case "DELETE_LIST":
            return {
                ...state,
                lists: state.lists.filter(l => l.id !== action.payload.id),
                activeList: null
            };
        case "ADD_ITEM":
            action.payload.list.items.push(action.payload.item);
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l)
            };
        case "DELETE_ITEM":
            action.payload.list.items = action.payload.list.items.filter(i => i.id !== action.payload.item.id);
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l)
            };
        case "EDIT_ITEM":
            action.payload.list.items = action.payload.list.items.map(i => i.id === action.payload.editedItem.id ? action.payload.editedItem : i);
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l)
            };
        case "MARK_ITEM":
            action.payload.list.items = action.payload.list.items.map(i => i.id === action.payload.editedItem.id ? action.payload.editedItem : i);
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l)
            };
        case "SET_USER":
            // window.localStorage.setItem('loggedShoppingListAppUser', JSON.stringify(action.payload.user));
            listService.setToken(action.payload.user.token);
            return {
                ...state,
                user: action.payload.user
            };
        case "DISCARD_USER":
            return {
                ...state,
                user: null
            };
        case "INVITE_GUEST":
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l)
            };
        case "UNINVITE_GUEST":
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l)
            };
        case "ACCEPT_INVITATION":
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l),
                user: {
                    ...state.user as User,
                    listInvitations: action.payload.user.listInvitations
                }
            };
        case "DECLINE_INVITATION":
            return {
                ...state,
                user: {
                    ...state.user as User,
                    listInvitations: action.payload.user.listInvitations
                }
            };
        case "LEAVE_LIST":
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l),
            };
        case "REMOVE_GUEST":
            return {
                ...state,
                lists: state.lists.map(l => l.id === action.payload.list.id ? action.payload.list : l),
                activeList: action.payload.list
            };
        case "CHANGE_USER_NAME":
            return {
                ...state,
                user: action.payload.user
            };
        case "CHANGE_USER_EMAIL":
            return {
                ...state,
                user: action.payload.user
            };
        case "SET_OPEN_MODAL_TYPE":
            return {
                ...state,
                modalType: action.payload.modal
            };

        default:
            return state;
    }
};

export const setDesktop = (desktop: boolean) => {
    return (
        {
            type: "SET_DEVICE_TO_DESKTOP" as "SET_DEVICE_TO_DESKTOP",
            payload: desktop
        }
    );
};

export const setLists = (lists: ItemList[]) => {
    return (
        {
            type: "SET_LISTS" as "SET_LISTS",
            payload: lists
        }
    );
};

export const setActiveList = async (user: User, dispatch: React.Dispatch<Action>) => {
    const userFromApi: User = await userService.getUser(user.id);
    const list = userFromApi.activeList;

    if (list) {
        if (list.guests.map(g => g.id).includes(userFromApi.id) || list.user.id === userFromApi.id) {
            dispatch(
                {
                    type: "SET_ACTIVE_LIST" as "SET_ACTIVE_LIST",
                    payload: list
                }
            );
        }
    }
};

export const changeActiveList = async (list: ItemList, user: User, dispatch: React.Dispatch<Action>) => {
    const userFromApi: User = await userService.setActiveList(user.id, list.id);
    dispatch(
        {
            type: "SET_ACTIVE_LIST" as "SET_ACTIVE_LIST",
            payload: userFromApi.activeList
        }
    );
};

export const openListModal = () => {
    return (
        {
            type: "OPEN_LIST_MODAL" as "OPEN_LIST_MODAL"
        }
    );
};

export const closeListModal = () => {
    return (
        {
            type: "CLOSE_LIST_MODAL" as "CLOSE_LIST_MODAL"
        }
    );
};

export const addList = async (name: string, user: User, dispatch: React.Dispatch<Action>) => {
    const addedList = await listService.addList(name);
    const userFromApi: User = await userService.getUser(user.id);
    await userService.setActiveList(userFromApi.id, addedList.id);
    dispatch(
        {
            type: "ADD_LIST" as "ADD_LIST",
            payload: addedList
        }
    );
    dispatch(
        {
            type: "SET_ACTIVE_LIST" as "SET_ACTIVE_LIST",
            payload: addedList
        }
    );
};

export const editList = async (list: ItemList, items: ItemType[], dispatch: React.Dispatch<Action>) => {
    await listService.editList(list.id, items);
    dispatch(
        {
            type: "EDIT_LIST" as "EDIT_LIST",
            payload: list
        }
    );
};

export const deleteList = async (list: ItemList, dispatch: React.Dispatch<Action>) => {
    await listService.deleteList(list.id);
    dispatch(
        {
            type: "DELETE_LIST" as "DELETE_LIST",
            payload: list
        }
    );
};

export const addItem = async (list: ItemList, itemName: string, dispatch: React.Dispatch<Action>) => {
    const item = (await listService.addItem(list.id, itemName)).data;
    dispatch(
        {
            type: "ADD_ITEM" as "ADD_ITEM",
            payload: { list, item }
        }
    );
};

export const deleteItem = async (list: ItemList, item: ItemType, dispatch: React.Dispatch<Action>) => {
    await listService.deleteItem(list.id, item.id);
    dispatch(
        {
            type: "DELETE_ITEM" as "DELETE_ITEM",
            payload: { list, item }
        }
    );
};

export const editItem = async (list: ItemList, item: ItemType, newName: string, dispatch: React.Dispatch<Action>) => {
    const newItem = { ...item, name: newName };
    await listService.editItem(list.id, newItem);
    dispatch(
        {
            type: "EDIT_ITEM" as "EDIT_ITEM",
            payload: { list, editedItem: newItem }
        }
    );
};

export const markItem = async (list: ItemList, item: ItemType, dispatch: React.Dispatch<Action>) => {
    const markedItem = { ...item, strikethrough: !item.strikethrough };
    await listService.markItem(list.id, item);
    dispatch(
        {
            type: "MARK_ITEM" as "MARK_ITEM",
            payload: { list, editedItem: markedItem }
        }
    );
};

export const getUserFromLocal = async (dispatch: React.Dispatch<Action>) => {
    const loggedUserJSON = window.localStorage.getItem('loggedShoppingListAppUser');
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        const userFromApi = await userService.getUser(user.id);
        user.listInvitations = userFromApi.listInvitations;
        dispatch(
            {
                type: "SET_USER" as "SET_USER",
                payload: { user }
            }
        );
    }
};

export const discardUser = (dispatch: React.Dispatch<Action>) => {
    window.localStorage.removeItem('loggedShoppingListAppUser');
    listService.setToken("");
    dispatch(
        {
            type: "DISCARD_USER" as "DISCARD_USER"
        }
    );
};

export const login = async (name: string, password: string, dispatch: React.Dispatch<Action>) => {
    const user = await userService.login(name, password);
    window.localStorage.setItem('loggedShoppingListAppUser', JSON.stringify(user));
    const userFromApi = await userService.getUser(user.id);
    user.listInvitations = userFromApi.listInvitations;
    if (user) {
        dispatch(
            {
                type: "CLEAR_ACTIVE_LIST" as "CLEAR_ACTIVE_LIST"
            }
        );
        dispatch(
            {
                type: "SET_USER" as "SET_USER",
                payload: { user }
            }
        );
    }
};

export const register = async (name: string, email: string, password: string, dispatch: React.Dispatch<Action>) => {
    await userService.register(name, email, password);
    const user = await userService.login(name, password);
    dispatch(
        {
            type: "CLEAR_ACTIVE_LIST" as "CLEAR_ACTIVE_LIST"
        }
    );
    dispatch(
        {
            type: "SET_USER" as "SET_USER",
            payload: { user }
        }
    );
};

export const openProfilePage = () => {
    return (
        {
            type: "OPEN_PROFILE_PAGE" as "OPEN_PROFILE_PAGE"
        }
    );
};

export const closeProfilePage = () => {
    return (
        {
            type: "CLOSE_PROFILE_PAGE" as "CLOSE_PROFILE_PAGE"
        }
    );
};

export const clearActiveList = () => {
    return (
        {
            type: "CLEAR_ACTIVE_LIST" as "CLEAR_ACTIVE_LIST"
        }
    );
};

export const resetActiveList = async (user: User, dispatch: React.Dispatch<Action>) => {
    await userService.clearActiveList(user.id);
    const lists = await listService.getListsByUser();
    dispatch(
        {
            type: "CLEAR_ACTIVE_LIST" as "CLEAR_ACTIVE_LIST"
        }
    );
    dispatch(
        {
            type: "SET_LISTS" as "SET_LISTS",
            payload: lists
        }
    );
};

export const inviteGuest = (editedList: ItemList) => {
    return (
        {
            type: "INVITE_GUEST" as "INVITE_GUEST",
            payload: { list: editedList }
        }
    );
};

export const uninviteGuest = (editedList: ItemList) => {
    return (
        {
            type: "UNINVITE_GUEST" as "UNINVITE_GUEST",
            payload: { list: editedList }
        }
    );
};

export const acceptInvitation = async (list: ItemList, user: User, dispatch: React.Dispatch<Action>) => {
    const editedList = await listService.acceptInvitation(list.id, user.id);
    // const editedUser: User = await userService.getUser(user.id);
    const lists: ItemList[] = await listService.getListsByUser();
    const editedUser: User = await userService.setActiveList(user.id, editedList.id);
    dispatch(
        {
            type: "ACCEPT_INVITATION" as "ACCEPT_INVITATION",
            payload: { list: editedList, user: editedUser }
        }
    );
    dispatch(
        {
            type: "SET_LISTS" as "SET_LISTS",
            payload: lists
        }
    );
    dispatch(
        {
            type: "SET_ACTIVE_LIST" as "SET_ACTIVE_LIST",
            payload: editedUser.activeList
        }
    );
};

export const declineInvitation = async (list: ItemList, user: User, dispatch: React.Dispatch<Action>) => {
    const editedList = await listService.declineInvitation(list.id, user.id);
    const editedUser: User = await userService.getUser(user.id);
    dispatch(
        {
            type: "DECLINE_INVITATION" as "DECLINE_INVITATION",
            payload: { list: editedList, user: editedUser }
        }
    );
};

export const leaveList = async (list: ItemList, dispatch: React.Dispatch<Action>) => {
    const editedList = await listService.leaveList(list.id);
    // const editedUser: User = await userService.getUser(user.id);
    dispatch(
        {
            type: "LEAVE_LIST" as "LEAVE_LIST",
            payload: { list: editedList }
        }
    );
};

export const removeGuest = async (list: ItemList, guest: User, dispatch: React.Dispatch<Action>) => {
    const editedList = await listService.removeGuest(list.id, guest.id);
    dispatch(
        {
            type: "REMOVE_GUEST" as "REMOVE_GUEST",
            payload: { list: editedList }
        }
    );
};

export const changeUserName = async (editedUser: User, dispatch: React.Dispatch<Action>) => {
    dispatch(
        {
            type: "CHANGE_USER_NAME" as "CHANGE_USER_NAME",
            payload: { user: editedUser }
        }
    );

    const loggedUserJSON = window.localStorage.getItem('loggedShoppingListAppUser');
    if (loggedUserJSON) {
        const storedUser = JSON.parse(loggedUserJSON);
        storedUser.name = editedUser.name;
        window.localStorage.setItem('loggedShoppingListAppUser', JSON.stringify(storedUser));
        dispatch(
            {
                type: "SET_USER" as "SET_USER",
                payload: { user: storedUser }
            }
        );
    }

};

export const changeUserEmail = async (editedUser: User, dispatch: React.Dispatch<Action>) => {
    dispatch(
        {
            type: "CHANGE_USER_EMAIL" as "CHANGE_USER_EMAIL",
            payload: { user: editedUser }
        }
    );

    const loggedUserJSON = window.localStorage.getItem('loggedShoppingListAppUser');
    if (loggedUserJSON) {
        const storedUser = JSON.parse(loggedUserJSON);
        storedUser.email = editedUser.email;
        window.localStorage.setItem('loggedShoppingListAppUser', JSON.stringify(storedUser));
        dispatch(
            {
                type: "SET_USER" as "SET_USER",
                payload: { user: storedUser }
            }
        );
    }

};

export const setOpenModalType = (modalType: ModalType) => {
    return (
        {
            type: "SET_OPEN_MODAL_TYPE" as "SET_OPEN_MODAL_TYPE",
            payload: { modal: modalType }
        }
    );
};
