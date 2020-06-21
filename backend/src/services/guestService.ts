import express from 'express';
import listService from './listService';
import userService from './userService';

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

    // list.invitedGuests = list.invitedGuests.concat(guest);
    // await list.save();
    // guest.listInvitations = guest.listInvitations.concat(list);
    // await guest.save();

    const updatedList = await list.updateOne({ $addToSet: { invitedGuests: guest } });
    // list.save();

    await guest.updateOne({ $addToSet: { listInvitations: list } });
    // guest.save();

    return updatedList;
};

export default {
    addInvitation
};