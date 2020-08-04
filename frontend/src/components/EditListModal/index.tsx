import React, { useState } from 'react';
import { Modal, Button, Icon, Divider } from 'semantic-ui-react';
import { useStateValue, deleteList, inviteGuest, changeActiveList, leaveList, resetActiveList } from '../../state';
import { ItemList } from '../../types';
import DeleteListModal from './DeleteListModal';
import InviteGuestForm from './InviteGuestForm';
import InvitedGuests from './InvitedGuests';
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
                leaveList(list, user, dispatch);
                resetActiveList(user, dispatch);
                onClose();
            }

        } catch (error) {
            console.log(error);
        }
    };

    if (user) {
        if (list.guests.map(g => g.id).includes(user.id)) {
            return (
                <Modal open={open} onClose={onClose} centered={false} size="small" closeIcon>
                    <Modal.Header>Edit list {list.name}</Modal.Header>
                    <Modal.Content>
                        <label style={{ fontWeight: 'bold' }}>You are a guest on this list.</label>
                        {/* List Members */}
                        <Divider />
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
                    <Modal.Header>Edit list {list.name}</Modal.Header>
                    <Modal.Content>
                        <InvitedGuests list={list} />
                        <InviteGuestForm onSubmit={addInvitation} />
                        <Divider />
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
