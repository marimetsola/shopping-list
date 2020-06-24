import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { UserType } from '../types';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    passwordHash: String,
    lists: [
        {
            type: Schema.Types.ObjectId, ref: 'ItemList'
        }
    ],
    guestLists: [
        {
            type: Schema.Types.ObjectId, ref: 'ItemList'
        }
    ],
    listInvitations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ItemList'
        }
    ]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

export default mongoose.model<UserType>('User', userSchema);