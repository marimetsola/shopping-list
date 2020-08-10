import express from 'express';
import listService from './listService';
import userService from './userService';
import itemList from '../models/itemList';

// Add a user to the invitiations of a list and list to the user's invitations
const addInvitation = async (req: express.Request) => {
    const { list } = await listService.authUserToList(req);
    const guestName: string = req.body.guestName;
    const guest = await userService.getUserByName(guestName);

    if (!list) {
        throw Error('no list found');
    }

    if (!guest) {
        throw Error('no guest user found');
    }

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $addToSet: { invitedGuests: guest } }, { new: true })
        .populate('user')
        .populate('items')
        .populate('invitedGuests')
        .populate('guests');

    await guest.updateOne({ $addToSet: { listInvitations: list } });

    return updatedList;
};

const removeInvitation = async (req: express.Request) => {
    const { list } = await listService.authUserToList(req);
    const guest = await userService.getUser(req.body.guestId);

    if (!list) {
        throw Error('no list found');
    }

    if (!guest) {
        throw Error('no guest user found');
    }

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $pull: { invitedGuests: guest.id } }, { new: true })
        .populate('user')
        .populate('items')
        .populate('invitedGuests')
        .populate('guests');

    await guest.updateOne({ $pull: { listInvitations: list.id } });

    return updatedList;
};

const acceptInvitation = async (req: express.Request) => {

    const token = listService.getTokenFromReq(req);
    const user = await userService.getUserFromToken(token);

    if (!user) {
        throw Error('no guest user found');
    }

    const list = await itemList.findById(req.params.id).populate('invitedGuests');

    if (!list) {
        throw Error('no list found');
    }

    if (!(list.invitedGuests.map(g => g.id).includes(user.id))) {
        throw Error('user not authorized');
    }

    const returnedList = await itemList.findByIdAndUpdate(req.params.id, {
        $pull: { invitedGuests: user.id },
        $addToSet: { guests: user }
    }, { new: true });

    await user.updateOne({
        $pull: { listInvitations: list.id },
        $push: { guestLists: list.id }
    }, { new: true });

    await user.save();

    return returnedList;
};

const declineInvitation = async (req: express.Request) => {

    const token = listService.getTokenFromReq(req);
    const user = await userService.getUserFromToken(token);

    if (!user) {
        throw Error('no guest user found');
    }

    const list = await itemList.findById(req.params.id).populate('invitedGuests');

    if (!list) {
        throw Error('no list found');
    }

    if (!(list.invitedGuests.map(g => g.id).includes(user.id))) {
        throw Error('user not authorized');
    }

    const returnedList = await itemList.findByIdAndUpdate(req.params.id, {
        $pull: { invitedGuests: user.id }
    }, { new: true });

    await user.updateOne({
        $pull: { listInvitations: list.id }
    }, { new: true });

    await user.save();

    return returnedList;
};

const removeGuest = async (req: express.Request) => {
    const { list } = await listService.authUserToList(req);
    const guest = await userService.getUser(req.body.guestId);

    if (!list) {
        throw Error('no list found');
    }

    if (!guest) {
        throw Error('no guest user found');
    }

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $pull: { guests: guest.id } }, { new: true })
        .populate('items')
        .populate('user')
        .populate('guests')
        .populate('invitedGuests');

    await guest.updateOne({ $pull: { guestLists: list.id } });

    return updatedList;
};

const leaveList = async (req: express.Request) => {
    const { user, list } = await listService.authGuestToList(req);
    // const guest = await userService.getUser(req.body.guestId);

    if (!list) {
        throw Error('no list found');
    }

    if (!user) {
        throw Error('no guest user found');
    }

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $pull: { guests: user.id } }, { new: true });

    await user.updateOne({ $pull: { guestLists: list.id } });

    return updatedList;
};

export default {
    addInvitation,
    removeInvitation,
    acceptInvitation,
    declineInvitation,
    removeGuest,
    leaveList
};