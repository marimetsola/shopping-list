import React, { useState } from 'react';
import { useStateValue } from '../state';
import { Container, Header, Divider, Button, Icon } from 'semantic-ui-react';
import EditListModal from './EditListModal';
import AddItemModal from './AddItemModal';

const ActiveList: React.FC = () => {
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
    const [{ activeList }] = useStateValue();

    const contStyle = { padding: "0 4.6rem" };

    if (!activeList) {
        return (
            <Container style={contStyle}>
            </Container>
        );
    }

    return (
        <Container style={contStyle}>
            {<Header as="h3" style={{ paddingRight: "1rem", marginBottom: 0 }}>{activeList.name}</Header>}

            <Divider />
            {activeList.items.length > 0 ? activeList.items.map(item => (<li key={item}>{item}</li>)) : 'List has no items'}
            <EditListModal open={editModalOpen} onClose={() => setEditModalOpen(false)} list={activeList} />
            <AddItemModal open={addItemModalOpen} onClose={() => setAddItemModalOpen(false)} list={activeList} />
            <Divider />
            <Button floated="left" color='olive' onClick={() => setEditModalOpen(true)}>
                <Icon name='edit' />Edit
            </Button>
            <Button color="green" floated="right" onClick={() => setAddItemModalOpen(true)}>
                <Icon name="add" />Add Item
            </Button>
        </Container>
    );

};

export default ActiveList;