import mongoose, { Schema } from 'mongoose';
import { ItemListType } from '../types';
import Item from './item';
import User from './user';

const itemListSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    invitedGuests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    guests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

itemListSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

itemListSchema.pre('remove', function (next) {
    Item.deleteMany({ list: this._id }).exec();
    User.updateMany({ lists: { $in: this._id } }, { $pull: { lists: this._id } }).exec();
    User.updateMany({ guestLists: { $in: this._id } }, { $pull: { guestLists: this._id } }).exec();
    User.updateMany({ listInvitations: { $in: this._id } }, { $pull: { listInvitations: this._id } }).exec();
    next();
});

export default mongoose.model<ItemListType>('ItemList', itemListSchema);
