import React from 'react';
import { Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';

const Item: React.FC<{ item: string; onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; index: number }> = ({ item, onRemove, index }) => {
    return (
        <Draggable draggableId={item} index={index} >
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <Segment>
                        <Grid>
                            <Grid.Column floated="left" verticalAlign="middle" width={5}>
                                <span>{item}</span>
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button floated="right" size="tiny" color="red" onClick={onRemove} icon>
                                    <Icon name="delete" />
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