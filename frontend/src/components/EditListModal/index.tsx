import React, { useState } from 'react';
import { Modal, Button, Icon, Divider } from 'semantic-ui-react';
import { useStateValue, deleteList, inviteGuest } from '../../state';
import { ItemList } from '../../types';
import DeleteListModal from './DeleteListModal';
import InviteGuestForm from './InviteGuestForm';
import InvitedGuests from './InvitedGuests';

interface Props {
    open: boolean;
    onClose: () => void;
    list: ItemList;
}

const EditListModal: React.FC<Props> = ({ open, onClose, list }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [, dispatch] = useStateValue();

    const removeList = async () => {
        setDeleteModalOpen(false);
        onClose();
        try {
            deleteList(list, dispatch);
        } catch (error) {
            console.log(error);
        }
    };
    const addInvitation = async (values: { name: string }) => {
        try {
            inviteGuest(list, values.name, dispatch);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="small" closeIcon>
            <Modal.Header>Edit list {list.name}</Modal.Header>
            <Modal.Content>
                <InvitedGuests />
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
};

export default EditListModal;
