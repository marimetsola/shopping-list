import React, { useState, Fragment } from 'react';
import { Modal, Button, Icon, Divider, Segment } from 'semantic-ui-react';
import { useStateValue, deleteList, inviteGuest, changeActiveList, leaveList, resetActiveList } from '../../state';
import { ItemList } from '../../types';
import DeleteListModal from './DeleteListModal';
import InviteGuestForm from './InviteGuestForm';
import InvitedGuests from './InvitedGuests';
import Guests from './Guests';
import listService from '../../services/lists';

interface Props {
    open: boolean;
    onClose: () => void;
    list: ItemList;
}

const EditListModal: React.FC<Props> = ({ open, onClose, list }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [{ user }, dispatch] = useStateValue();

    const removeList = async () => {
        setDeleteModalOpen(false);
        onClose();
        try {
            deleteList(list, dispatch);
        } catch (error) {
            console.log(error);
        }
    };
    const addInvitation = async (values: { name: string }, action: any) => {
        if (list.guests.map(g => g.name).includes(values.name) ||
            list.invitedGuests.map(g => g.name).includes(values.name)) {
            return action.setErrors({ name: "User is already invited to the list." });
        }
        try {
            const editedList = await listService.inviteGuest(list.id, values.name);
            dispatch(inviteGuest(editedList));
            if (user) {
                changeActiveList(editedList, user, dispatch);
            }
            action.resetForm();
        } catch (error) {
            action.setErrors({ name: "User does not exist." });
        }
    };
    const leaveGuestList = async () => {
        try {

            if (user) {
                leaveList(list, dispatch);
                resetActiveList(user, dispatch);
                onClose();
            }

        } catch (error) {
            console.log(error);
        }
    };

    const usersModal = () => {
        return (
            <Fragment>
                <label style={{ fontWeight: "bold" }}>Owner of the list</label>
                <Segment size="mini">
                    <span style={{ fontSize: "1rem", fontWeight: "bold" }}>{list.user.name}</span>
                </Segment>
                <Divider />
                <Guests list={list} isGuest={false} />
                <Divider />
                <InvitedGuests list={list} />
                <Divider />
                <InviteGuestForm onSubmit={addInvitation} />
                <Divider />
            </Fragment>
        );
    };

    const guestsModal = () => {
        return (
            <Fragment>
                <label style={{ fontWeight: 'bold' }}>Owner of the list</label>
                <Segment size="mini">
                    <span style={{ fontSize: "1rem" }}>{list.user.name}</span>
                </Segment>
                <Divider />
                <Guests list={list} isGuest={true} />
                <Divider />
            </Fragment>
        );
    };

    if (user) {
        if (list.guests.map(g => g.id).includes(user.id)) {
            return (
                <Modal open={open} onClose={onClose} centered={false} size="small" closeIcon>
                    <Modal.Header>Configure list {list.name}</Modal.Header>
                    <Modal.Content>
                        {guestsModal()}
                        <Button color="orange" onClick={leaveGuestList}>
                            <Icon name='delete' />Leave list
                        </Button>
                        <DeleteListModal open={deleteModalOpen} list={list} onConfirm={removeList} onClose={() => setDeleteModalOpen(false)} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type="button" onClick={onClose} color="grey">
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        } else if (list.user.id === user.id) {
            return (
                <Modal open={open} onClose={onClose} centered={false} size="small" closeIcon>
                    <Modal.Header>Configure list {list.name}</Modal.Header>
                    <Modal.Content>
                        {usersModal()}
                        <Button color="red" onClick={() => setDeleteModalOpen(true)}>
                            <Icon name='delete' />Delete list
                        </Button>
                        <DeleteListModal open={deleteModalOpen} list={list} onConfirm={removeList} onClose={() => setDeleteModalOpen(false)} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type="button" onClick={onClose} color="grey">
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        }
    }

    return (
        <Modal open={open} onClose={onClose} centered={false} size="small" closeIcon>
            <Modal.Header>Login to edit the list</Modal.Header>
            <Modal.Actions>
                <Button type="button" onClick={onClose} color="grey">
                    Cancel
            </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default EditListModal;
