import { Document } from 'mongoose';

export interface ItemListType extends Document {
    id: string;
    name: string;
    items: string[];
}