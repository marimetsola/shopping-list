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
const item_1 = __importDefault(require("./item"));
const user_1 = __importDefault(require("./user"));
const itemListSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    items: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Item' }],
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    invitedGuests: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    guests: [{
            type: mongoose_1.Schema.Types.ObjectId,
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
    item_1.default.deleteMany({ list: this._id }).exec();
    user_1.default.updateMany({ lists: { $in: this._id } }, { $pull: { lists: this._id } }).exec();
    user_1.default.updateMany({ guestLists: { $in: this._id } }, { $pull: { guestLists: this._id } }).exec();
    user_1.default.updateMany({ listInvitations: { $in: this._id } }, { $pull: { listInvitations: this._id } }).exec();
    next();
});
exports.default = mongoose_1.default.model('ItemList', itemListSchema);
