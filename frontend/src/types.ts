export interface ItemType extends Document {
    id: string;
    name: string;
}

export interface ItemList {
    id: string;
    name: string;
    items: ItemType[];
}

export interface User {
    id: string;
    name: string;
}