import express from 'express';
import listService from './listService';
import userService from './userService';
import itemList from '../models/itemList';

// Add a user to the invitiations of a list and list to the users invitations
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

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $addToSet: { invitedGuests: guest } }, { new: true });

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

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $pull: { invitedGuests: guest.id } }, { new: true });

    await guest.updateOne({ $pull: { listInvitations: list.id } });

    return updatedList;
};

const acceptInvitation = async (req: express.Request) => {

    const guest = await userService.getUser(req.body.guestId);

    if (!guest) {
        throw Error('no guest user found');
    }

    const list = await itemList.findByIdAndUpdate(req.params.id, {
        $pull: { invitedGuests: guest.id },
        $addToSet: { guests: guest }
    }, { new: true });


    if (!list) {
        throw Error('no list found');
    }

    await guest.updateOne({
        $pull: { listInvitations: list.id },
        $push: { lists: list.id }
    }, { new: true });

    await guest.save();

    return await list.save();
};

const declineInvitation = async (req: express.Request) => {

    const guest = await userService.getUser(req.body.guestId);

    if (!guest) {
        throw Error('no guest user found');
    }

    const list = await itemList.findByIdAndUpdate(req.params.id, {
        $pull: { invitedGuests: guest.id }
    }, { new: true });

    if (!list) {
        throw Error('no list found');
    }

    await guest.updateOne({
        $pull: { listInvitations: list.id }
    }, { new: true });

    await guest.save();

    return await list.save();
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

    const updatedList = await itemList.findByIdAndUpdate(list.id, { $pull: { guests: guest.id } }, { new: true });

    await guest.updateOne({ $pull: { lists: list.id } });

    return updatedList;
};

export default {
    addInvitation,
    removeInvitation,
    acceptInvitation,
    declineInvitation,
    removeGuest
};