import { Document } from 'mongoose';

export interface ItemType extends Document {
    id: string;
    name: string;
    list: string;
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
    passwordHash: string;
    lists: ItemListType[];
    guestLists: ItemListType[];
    listInvitations: ItemListType[];
}