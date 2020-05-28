import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, addItem, editItem } from '../../state';
import listService from '../../services/lists';
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
            // const item = (await listService.addItem(list.id, values.name)).data;
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
