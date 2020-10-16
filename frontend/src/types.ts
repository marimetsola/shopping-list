export interface ItemType extends Document {
    id: string;
    name: string;
    strikethrough: boolean;
}

export interface ItemList {
    id: string;
    name: string;
    items: ItemType[];
    user: User;
    invitedGuests: User[];
    guests: User[];
}

export interface User {
    id: string;
    name: string;
    email: string | null;
    token: string;
    listInvitations: ItemList[];
    activeList: ItemList;
}

export enum ModalType {
    None,
    TestModal,
    LoginModal,
    RegisterModal,
    RecoveryModal
}