"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listService_1 = __importDefault(require("./listService"));
const userService_1 = __importDefault(require("./userService"));
const itemList_1 = __importDefault(require("../models/itemList"));
// Add a user to the invitiations of a list and list to the user's invitations
const addInvitation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { list } = yield listService_1.default.authUserToList(req);
    const guestName = req.body.guestName;
    const guest = yield userService_1.default.getUserByName(guestName);
    if (!list) {
        throw Error('no list found');
    }
    if (!guest) {
        throw Error('no guest user found');
    }
    const updatedList = yield itemList_1.default.findByIdAndUpdate(list.id, { $addToSet: { invitedGuests: guest } }, { new: true })
        .populate('user')
        .populate('items')
        .populate('invitedGuests')
        .populate('guests');
    yield guest.updateOne({ $addToSet: { listInvitations: list } });
    return updatedList;
});
const removeInvitation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { list } = yield listService_1.default.authUserToList(req);
    const guest = yield userService_1.default.getUser(req.body.guestId);
    if (!list) {
        throw Error('no list found');
    }
    if (!guest) {
        throw Error('no guest user found');
    }
    const updatedList = yield itemList_1.default.findByIdAndUpdate(list.id, { $pull: { invitedGuests: guest.id } }, { new: true })
        .populate('user')
        .populate('items')
        .populate('invitedGuests')
        .populate('guests');
    yield guest.updateOne({ $pull: { listInvitations: list.id } });
    return updatedList;
});
const acceptInvitation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = listService_1.default.getTokenFromReq(req);
    const user = yield userService_1.default.getUserFromToken(token);
    if (!user) {
        throw Error('no guest user found');
    }
    const list = yield itemList_1.default.findById(req.params.id).populate('invitedGuests');
    if (!list) {
        throw Error('no list found');
    }
    if (!(list.invitedGuests.map(g => g.id).includes(user.id))) {
        throw Error('user not authorized');
    }
    const returnedList = yield itemList_1.default.findByIdAndUpdate(req.params.id, {
        $pull: { invitedGuests: user.id },
        $addToSet: { guests: user }
    }, { new: true });
    yield user.updateOne({
        $pull: { listInvitations: list.id },
        $push: { guestLists: list.id }
    }, { new: true });
    yield user.save();
    return returnedList;
});
const declineInvitation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = listService_1.default.getTokenFromReq(req);
    const user = yield userService_1.default.getUserFromToken(token);
    if (!user) {
        throw Error('no guest user found');
    }
    const list = yield itemList_1.default.findById(req.params.id).populate('invitedGuests');
    if (!list) {
        throw Error('no list found');
    }
    if (!(list.invitedGuests.map(g => g.id).includes(user.id))) {
        throw Error('user not authorized');
    }
    const returnedList = yield itemList_1.default.findByIdAndUpdate(req.params.id, {
        $pull: { invitedGuests: user.id }
    }, { new: true });
    yield user.updateOne({
        $pull: { listInvitations: list.id }
    }, { new: true });
    yield user.save();
    return returnedList;
});
const removeGuest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { list } = yield listService_1.default.authUserToList(req);
    const guest = yield userService_1.default.getUser(req.body.guestId);
    if (!list) {
        throw Error('no list found');
    }
    if (!guest) {
        throw Error('no guest user found');
    }
    const updatedList = yield itemList_1.default.findByIdAndUpdate(list.id, { $pull: { guests: guest.id } }, { new: true })
        .populate('items')
        .populate('user')
        .populate('guests')
        .populate('invitedGuests');
    yield guest.updateOne({ $pull: { guestLists: list.id } });
    return updatedList;
});
const leaveList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, list } = yield listService_1.default.authGuestToList(req);
    // const guest = await userService.getUser(req.body.guestId);
    if (!list) {
        throw Error('no list found');
    }
    if (!user) {
        throw Error('no guest user found');
    }
    const updatedList = yield itemList_1.default.findByIdAndUpdate(list.id, { $pull: { guests: user.id } }, { new: true });
    yield user.updateOne({ $pull: { guestLists: list.id } });
    return updatedList;
});
exports.default = {
    addInvitation,
    removeInvitation,
    acceptInvitation,
    declineInvitation,
    removeGuest,
    leaveList
};
