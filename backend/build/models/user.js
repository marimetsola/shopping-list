"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        index: true,
        sparse: true,
        unique: true
    },
    passwordHash: String,
    lists: [
        {
            type: mongoose_1.Schema.Types.ObjectId, ref: 'ItemList'
        }
    ],
    guestLists: [
        {
            type: mongoose_1.Schema.Types.ObjectId, ref: 'ItemList'
        }
    ],
    listInvitations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'ItemList'
        }
    ],
    activeList: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ItemList'
    }
});
userSchema.plugin(mongoose_unique_validator_1.default);
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
exports.default = mongoose_1.default.model('User', userSchema);
