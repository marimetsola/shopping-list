import React from 'react';
import { Modal } from 'semantic-ui-react';
import AddListForm from './AddListForm';
import { useStateValue, closeListModal, addList, setActiveList } from '../../state';
import listService from '../../services/lists';

const AddListModal: React.FC = () => {
    const [{ listModalOpen }, dispatch] = useStateValue();

    const addNewList = async (values: { name: string }) => {
        dispatch(closeListModal());
        try {
            const addedList = await listService.addList(values.name);
            dispatch(addList(addedList));
            dispatch(setActiveList(addedList));
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
