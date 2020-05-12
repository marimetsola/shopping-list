import { State } from "./state";
import { ItemList } from "../types";

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
            }
        case "OPEN_LIST_MODAL":
            return {
                ...state,
                listModalOpen: true
            }
        case "CLOSE_LIST_MODAL":
            return {
                ...state,
                listModalOpen: false
            }
        case "ADD_LIST":
            return {
                ...state,
                lists: [...state.lists, action.payload]
            }
        // case "ADD_LIST":
        //     return {
        //         ...state,
        //         lists: {
        //             ...state.lists,
        //             [action.payload.id]: action.payload
        //         }
        //     };
        // case "EDIT_LIST":
        //     return {
        //         ...state,
        //         lists: {
        //             ...state.lists,
        //             [action.payload.id]: action.payload
        //         }
        //     };
        // case "DELETE_LIST":
        //     // eslint-disable-next-line no-case-declarations
        //     const newLists = { ...state.lists }
        //     delete newLists[action.payload.id];
        //     return {
        //         ...state,
        //         lists: newLists
        //     };
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
    )
}

export const closeListModal = () => {
    return (
        {
            type: "CLOSE_LIST_MODAL" as "CLOSE_LIST_MODAL"
        }
    )
}

export const addList = (list: ItemList) => {
    return (
        {
            type: "ADD_LIST" as "ADD_LIST",
            payload: list
        }
    )
}

// // used for updating patient to include sensitive data
// export const editPatient = (patient: Patient) => {
//     return (
//         {
//             type: "EDIT_PATIENT" as "EDIT_PATIENT",
//             payload: patient
//         }
//     );
// };

// export const addPatient = (patient: Patient) => {
//     return (
//         {
//             type: "ADD_PATIENT" as "ADD_PATIENT",
//             payload: patient
//         }
//     );
// };

// export const setDiagnosisList = (diagnosisList: Diagnosis[]) => {
//     return (
//         {
//             type: "SET_DIAGNOSIS_LIST" as "SET_DIAGNOSIS_LIST",
//             payload: diagnosisList
//         }
//     );
// };

// export const addEntry = (patientID: string, entry: Entry) => {
//     return (
//         {
//             type: "ADD_ENTRY" as "ADD_ENTRY",
//             payload: { patientID, entry }
//         }
//     );
// };
