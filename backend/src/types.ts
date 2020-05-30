import { Document } from 'mongoose';

export interface ItemType extends Document {
    id: string;
    name: string;
}

export interface ItemListType extends Document {
    id: string;
    name: string;
    items: ItemType[];
}

export interface UserType extends Document {
    id: string;
    name: string;
    passwordHash: string;
    lists: ItemListType[];
}