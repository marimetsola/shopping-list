import { Document } from 'mongoose';

export interface ItemType extends Document {
    id: string;
    name: string;
    list: string;
    strikethrough: boolean;
}

export interface ItemListType extends Document {
    id: string;
    name: string;
    items: ItemType[];
    user: UserType;
    invitedGuests: UserType[];
    guests: UserType[];
}

export interface UserType extends Document {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    lists: ItemListType[];
    guestLists: ItemListType[];
    listInvitations: ItemListType[];
    activeList: ItemListType | undefined;
    resetPasswordToken: string | undefined;
    resetPasswordExpires: number | undefined;
}