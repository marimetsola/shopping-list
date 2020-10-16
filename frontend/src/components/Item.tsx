import React from 'react';
import { Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { ItemType } from '../types';
import { useStateValue } from '../state';

interface Props {
    item: ItemType;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    index: number;
}

const Item: React.FC<Props> = ({ item, onClick, onRemove, onEdit, index }) => {
    const [{ isDesktop }] = useStateValue();
    return (
        <Draggable draggableId={item.id} index={index} >
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <Segment onClick={onClick}>
                        <Grid>
                            <Grid.Column floated="left" verticalAlign="middle" width={5}>
                                <span style={item.strikethrough ? { textDecoration: "line-through", color: "grey" } : {}}>{item.name}</span>
                            </Grid.Column>
                            <Grid.Column floated="right" width={10} className={!isDesktop ? "item-button-container-mobile" : ""}>
                                <Button floated="right" size="tiny" color="red" onClick={onRemove} icon>
                                    <Icon name="delete" />
                                </Button>
                                <Button floated="right" size="tiny" color="olive" onClick={onEdit} icon>
                                    <Icon name="edit" />
                                </Button>
                                {/* <Button basic floated="right" size="tiny" color="black" onClick={onMark} icon>
                                    <Icon name="strikethrough" />
                                </Button> */}
                            </Grid.Column>

                        </Grid>

                    </Segment>
                </div>
            )}
        </Draggable>
    );
};



export default Item;