import mongoose, { Schema } from 'mongoose';
import { ItemListType } from '../types';

const itemListSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

itemListSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model<ItemListType>('ItemList', itemListSchema);
