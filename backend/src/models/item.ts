import mongoose, { Schema } from 'mongoose';
import { ItemType } from '../types';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    list: { type: Schema.Types.ObjectId, ref: 'ItemList' },
    strikethrough: {
        type: Boolean
    }
});

itemSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model<ItemType>('Item', itemSchema);
