export interface ItemType extends Document {
    id: string;
    name: string;
}

export interface ItemList {
    id: string;
    name: string;
    items: ItemType[];
}