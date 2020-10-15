import React from 'react';
import { Modal } from 'semantic-ui-react';
import AddListForm from './AddListForm';
import { useStateValue, closeListModal, addList } from '../../state';
import { trackPromise } from 'react-promise-tracker';

const AddListModal: React.FC = () => {
    const [{ listModalOpen, user }, dispatch] = useStateValue();

    const addNewList = async (values: { name: string }) => {
        dispatch(closeListModal());
        try {
            if (user) {
                trackPromise(addList(values.name, user, dispatch));
            }
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
