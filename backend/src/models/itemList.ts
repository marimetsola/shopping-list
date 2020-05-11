import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ItemListType } from '../types';

const itemListSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    },
    items: [String]
});

itemListSchema.plugin(uniqueValidator);

itemListSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model<ItemListType>('ItemList', itemListSchema);
