import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import { ItemList } from '../../types';

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

export default DeleteListModal;