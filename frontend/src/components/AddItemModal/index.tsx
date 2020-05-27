import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, addItem } from '../../state';
import listService from '../../services/lists';
import { ItemList } from '../../types';
import AddItemForm from './AddItemForm';

interface Props {
    open: boolean;
    onClose: () => void;
    list: ItemList;
}

const AddItemModal: React.FC<Props> = ({ open, onClose, list }) => {
    const [, dispatch] = useStateValue();
    const addNewItem = async (values: { name: string }) => {
        try {
            const item = (await listService.addItem(list.id, values.name)).data;
            dispatch(addItem(list, item));

        } catch (e) {
            console.error(e);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>Add item</Modal.Header>
            <Modal.Content>
                <AddItemForm onSubmit={addNewItem} onCancel={onClose} />
            </Modal.Content>
        </Modal >
    );
};

export default AddItemModal;
