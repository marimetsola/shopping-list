import React from 'react';
import { State } from "./state";
import { ItemList, ItemType, User } from "../types";
import listService from '../services/lists';
import loginService from '../services/users';

export type Action =
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
        type: "SET_USER";
        payload: { user: User };
    }
    | {
        type: "DISCARD_USER";
    };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
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
        case "SET_USER":
            window.localStorage.setItem('loggedShoppingListAppUser', JSON.stringify(action.payload.user));
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

        default:
            return state;
    }
};

export const setLists = (lists: ItemList[]) => {
    return (
        {
            type: "SET_LISTS" as "SET_LISTS",
            payload: lists
        }
    );
};

export const setActiveList = (list: ItemList) => {
    return (
        {
            type: "SET_ACTIVE_LIST" as "SET_ACTIVE_LIST",
            payload: list
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

export const addList = async (name: string, dispatch: React.Dispatch<Action>) => {
    const addedList = await listService.addList(name);
    dispatch(
        {
            type: "ADD_LIST" as "ADD_LIST",
            payload: addedList
        }
    );
    dispatch({
        type: "SET_ACTIVE_LIST" as "SET_ACTIVE_LIST",
        payload: addedList
    });
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

export const setUser = (dispatch: React.Dispatch<Action>) => {
    const loggedUserJSON = window.localStorage.getItem('loggedShoppingListAppUser');
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
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
    const user = await loginService.login(name, password);
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

export const register = async (name: string, password: string, dispatch: React.Dispatch<Action>) => {
    await loginService.register(name, password);
    const user = await loginService.login(name, password);
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