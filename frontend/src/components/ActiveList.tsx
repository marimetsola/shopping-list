import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useStateValue, markItem, deleteItem, editList } from '../state';
import { Container, Header, Divider, Button, Icon } from 'semantic-ui-react';
import EditListModal from './EditListModal';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import Item from './Item';
import { ItemType } from '../types';
import { usePromiseTracker } from 'react-promise-tracker';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

const ActiveList: React.FC = () => {
    const [editListModalOpen, setEditListModalOpen] = useState<boolean>(false);
    const [editedItem, setEditedItem] = useState<ItemType | null>(null);
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
    const [{ activeList, isDesktop, user, listModalOpen }, dispatch] = useStateValue();
    const refContainer = useRef<Button>(null);
    const { promiseInProgress } = usePromiseTracker();

    const focusAddButton = () => {
        if (refContainer && refContainer.current && !addItemModalOpen && !editedItem && !editListModalOpen && !listModalOpen) {
            refContainer.current.focus();
        }
    };

    useEffect(() => {
        focusAddButton();
    });

    const clickItem = async (item: ItemType) => {
        if (activeList) {
            try {
                await markItem(activeList, item, dispatch);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const removeItem = async (item: ItemType) => {
        if (activeList) {
            try {
                deleteItem(activeList, item, dispatch);

            } catch (error) {
                console.error(error);
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
            const draggedItem = newItems.find(i => i.id === draggableId);
            if (draggedItem) {
                newItems.splice(source.index, 1);
                newItems.splice(destination.index, 0, draggedItem);
                activeList.items = newItems;
            }

            try {
                editList(activeList, newItems, dispatch);

            } catch (e) {
                console.error(e);
            }
        }
    };

    const adviceStyle =
    {
        marginTop: "4rem",
        textAlign: "center"
    };

    if (!user) {
        return <Redirect to="/" />;
    }

    if (promiseInProgress) {
        return null;
    }

    if (!activeList) {
        return (
            <Container className={isDesktop ? "cont-style" : "cont-style-mobile"}>
                <Header as="h2" style={adviceStyle}>Create or select a list.</Header>
            </Container>
        );
        // } else if ((!activeList.items)) {
        //     return null;
    }

    return (
        <Container className={isDesktop ? "cont-style" : "cont-style-mobile"}>
            {<Header as="h3" style={{ paddingRight: "1rem", marginBottom: 0 }}>{activeList.name}</Header>}
            <Divider />
            {activeList.items.length === 0 ? 'List has no items' :
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={activeList.id}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {activeList.items.map((item, index) => (
                                    <Item
                                        index={index}
                                        key={item.id}
                                        item={item}
                                        onClick={() => clickItem(item)}
                                        onRemove={(e) => { removeItem(item); e.stopPropagation(); }}
                                        onEdit={(e) => { setEditedItem(item); e.stopPropagation(); }}
                                    />))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>}
            <EditListModal open={editListModalOpen} onClose={() => setEditListModalOpen(false)} list={activeList} />
            <AddItemModal open={addItemModalOpen} onClose={() => { setAddItemModalOpen(false); focusAddButton(); }} list={activeList} />
            <EditItemModal open={editedItem ? true : false} onClose={() => setEditedItem(null)} list={activeList} item={editedItem} />
            <Divider />
            <Button style={{ marginBottom: "1rem" }} floated="left" color='olive' onClick={() => setEditListModalOpen(true)}>
                <Icon name='edit' />Edit
            </Button>
            <Button style={{ marginBottom: "1rem" }} color="green" floated="right" onClick={() => setAddItemModalOpen(true)} ref={refContainer}>
                <Icon name="add" />Add Item
            </Button>
        </Container>
    );

};

export default ActiveList;