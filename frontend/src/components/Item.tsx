import React from 'react';
import { Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { ItemType } from '../types';

interface Props {
    item: ItemType;
    onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    index: number;
}

const Item: React.FC<Props> = ({ item, onRemove, onEdit, index }) => {
    return (
        <Draggable draggableId={item.id} index={index} >
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <Segment>
                        <Grid>
                            <Grid.Column floated="left" verticalAlign="middle" width={5}>
                                <span>{item.name}</span>
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button floated="right" size="tiny" color="red" onClick={onRemove} icon>
                                    <Icon name="delete" />
                                </Button>
                                <Button floated="right" size="tiny" color="olive" onClick={onEdit} icon>
                                    <Icon name="edit" />
                                </Button>
                            </Grid.Column>

                        </Grid>

                    </Segment>
                </div>
            )}
        </Draggable>
    );
};



export default Item;