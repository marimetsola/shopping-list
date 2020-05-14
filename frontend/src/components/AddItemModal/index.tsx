import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, addItem } from '../../state';
import { apiBaseUrl } from '../../constants';
import axios from 'axios';
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
            await axios.post<ItemList>(
                `${apiBaseUrl}/lists/${list.id}/add-item`, values
            );
            dispatch(addItem(list, values.name));

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
