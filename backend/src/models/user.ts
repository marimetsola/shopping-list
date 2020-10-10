import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { UserType } from '../types';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    email: {
        type: String,
        index: true,
        sparse: true,
        unique: true,
        uniqueCaseInsensitive: true
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
    ],
    activeList:
    {
        type: Schema.Types.ObjectId,
        ref: 'ItemList'
    }
});

userSchema.plugin(uniqueValidator);

userSchema.post('save', (error: any, doc: any, next: any) => {
    if (error.name === 'ValidationError') {
        if (error.errors['name']) {
            next(new Error('Username is already taken.'));
        } else if (error.errors['email']) {
            next(new Error('Email adress is already in use.'));
        }
    }
    else {
        next();
    }
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

export default mongoose.model<UserType>('User', userSchema);