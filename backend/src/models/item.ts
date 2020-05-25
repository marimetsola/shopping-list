import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ItemType } from '../types';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    list: { type: Schema.Types.ObjectId, ref: 'ItemList' }
});

itemSchema.plugin(uniqueValidator);

itemSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model<ItemType>('Item', itemSchema);
