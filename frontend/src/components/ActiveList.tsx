import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { useStateValue, deleteItem, editList } from '../state';
import { Container, Header, Divider, Button, Icon } from 'semantic-ui-react';
import EditListModal from './EditListModal';
import AddItemModal from './AddItemModal';
import Item from './Item';
import { ItemList } from '../types';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

const ActiveList: React.FC = () => {
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
    const [{ activeList }, dispatch] = useStateValue();
    const refContainer = useRef<Button>(null);


    const focusAddButton = () => {
        if (refContainer && refContainer.current) {
            refContainer.current.focus();
        }
    };

    useEffect(() => {
        focusAddButton();
    }, [activeList]);

    const removeItem = async (item: string) => {
        if (activeList) {
            try {
                await axios.delete<ItemList>(
                    `${apiBaseUrl}/lists/${activeList.id}/delete-item`, { data: { name: item } }
                );
                dispatch(deleteItem(activeList, item));

            } catch (e) {
                console.error(e);
            }
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return;
        }

        const items = activeList?.items;
        if (items && activeList) {
            const newItems = [...items];
            newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, draggableId);
            activeList.items = newItems;

            try {
                await axios.put<ItemList>(
                    `${apiBaseUrl}/lists/${activeList.id}/update`, { items: newItems }
                );
                dispatch(editList(activeList));

            } catch (e) {
                console.error(e);
            }
        }
    };

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

            {/* {activeList.items.length > 0
                        ? activeList.items.map(item => (<Item key={item} item={item} onRemove={() => removeItem(item)} />))
                        : 'List has no items'} */}
            <Divider />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={activeList.id}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}>
                            {activeList.items.map((item, index) => (<Item index={index} key={item} item={item} onRemove={() => removeItem(item)} />))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <EditListModal open={editModalOpen} onClose={() => setEditModalOpen(false)} list={activeList} />
            <AddItemModal open={addItemModalOpen} onClose={() => { setAddItemModalOpen(false); focusAddButton(); }} list={activeList} />
            <Divider />
            <Button floated="left" color='olive' onClick={() => setEditModalOpen(true)}>
                <Icon name='edit' />Edit
            </Button>
            <Button color="green" floated="right" onClick={() => setAddItemModalOpen(true)} ref={refContainer}>
                <Icon name="add" />Add Item
            </Button>
        </Container>
    );

};

export default ActiveList;