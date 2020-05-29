import React from 'react';
import { Modal } from 'semantic-ui-react';
import AddListForm from './AddListForm';
import { useStateValue, closeListModal, addList } from '../../state';

const AddListModal: React.FC = () => {
    const [{ listModalOpen }, dispatch] = useStateValue();

    const addNewList = async (values: { name: string }) => {
        dispatch(closeListModal());
        try {
            addList(values.name, dispatch);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal open={listModalOpen} onClose={() => dispatch(closeListModal())} centered={false} size="tiny" closeIcon>
            <Modal.Header>Add a new list</Modal.Header>
            <Modal.Content>
                <AddListForm onSubmit={addNewList} onCancel={() => dispatch(closeListModal())} />
            </Modal.Content>
        </Modal>
    );
};

export default AddListModal;
