import React, { createContext, useContext, useReducer } from "react";
import { ItemList, User, ModalType } from "../types";

import { Action } from "./reducer";

export type State = {
    lists: ItemList[];
    activeList: ItemList | null;
    listModalOpen: boolean;
    user: null | User;
    modalType: ModalType;
    isDesktop: boolean;
};

const initialState: State = {
    lists: [],
    activeList: null,
    listModalOpen: false,
    user: null,
    modalType: ModalType.None,
    isDesktop: true,
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
    initialState,
    () => initialState
]);

type StateProviderProps = {
    reducer: React.Reducer<State, Action>;
    children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
    reducer,
    children
}: StateProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StateContext.Provider value={[state, dispatch]}>
            {children}
        </StateContext.Provider>
    );
};
export const useStateValue = () => useContext(StateContext);
