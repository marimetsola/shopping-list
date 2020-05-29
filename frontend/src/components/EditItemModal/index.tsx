import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, editItem } from '../../state';
import { ItemList, ItemType } from '../../types';
import EditItemForm from './EditItemForm';

interface Props {
    open: boolean;
    onClose: () => void;
    item: ItemType | null;
    list: ItemList;
}

const EditItemModal: React.FC<Props> = ({ open, onClose, item, list }) => {
    const [, dispatch] = useStateValue();
    const EditItem = async (values: { name: string }) => {
        try {
            if (item) {
                editItem(list, item, values.name, dispatch);
            }
        } catch (e) {
            console.error(e);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>Edit item</Modal.Header>
            <Modal.Content>
                <EditItemForm onSubmit={EditItem} onCancel={onClose} item={item} />
            </Modal.Content>
        </Modal >
    );
};

export default EditItemModal;
