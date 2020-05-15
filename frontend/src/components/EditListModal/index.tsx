import React, { useState } from 'react';
import { Modal, Button, Grid, Icon } from 'semantic-ui-react';
import listService from '../../services/lists';
import { useStateValue, deleteList } from '../../state';
import { ItemList } from '../../types';

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
            await listService.deleteList(list.id);
            dispatch(deleteList(list));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="small" closeIcon>
            <Modal.Header>Edit list {list.name}</Modal.Header>
            <Modal.Content>
                <Button color="red" onClick={() => setDeleteModalOpen(true)}>
                    <Icon name='delete' />Delete
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

const DeleteListModal: React.FC<{ open: boolean; list: ItemList; onConfirm: () => void; onClose: () => void }> = ({ open, onConfirm, onClose, list }) => {

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>Really delete list {list.name}?</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Column floated="left" width={5}>
                        <Button type="button" onClick={onConfirm} color="red">
                            Yes
                    </Button>
                    </Grid.Column>
                    <Grid.Column floated="right" width={5}>
                        <Button floated="right" type="button" onClick={onClose} color="grey">
                            No
                    </Button>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
        </Modal>
    );
};

export default EditListModal;
