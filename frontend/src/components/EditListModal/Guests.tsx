import React, { Fragment } from 'react';
import { ItemList } from '../../types';
import { Button, Segment, Grid } from "semantic-ui-react";
import { User } from '../../types';
import listService from '../../services/lists';
import { uninviteGuest, changeActiveList, useStateValue } from '../../state';

const Guests: React.FC<{ list: ItemList }> = ({ list }) => {
    const [{ user }, dispatch] = useStateValue();

    const removeGuest = async (guest: User) => {
        // try {
        //     const editedList = await listService.uninviteGuest(list.id, guest.id);
        //     dispatch(uninviteGuest(editedList));
        //     if (user) {
        //         changeActiveList(editedList, user, dispatch);
        //     }
        // } catch (error) {
        //     // action.setErrors({ name: "User does not exist." });
        //     console.log(error);
        // }
        console.log('remove', guest);
    };
    if (!list) {
        return null;
    }

    const contStyle = {
        padding: "7px 7px 7px 14px",
    };
    return (
        <Fragment>
            <label style={{ fontWeight: 'bold' }}>Guests</label>
            {list.guests.map(g =>

                <Segment key={g.id}>
                    <Grid>
                        <Grid.Column style={contStyle} floated="left" verticalAlign="middle" width={5}>
                            <span>{g.name}</span>
                        </Grid.Column>
                        <Grid.Column style={contStyle} floated="right" width={5}>
                            <Button floated="right" size="mini" color="red" onClick={() => removeGuest(g)} icon="delete" />
                        </Grid.Column>

                    </Grid>

                </Segment>
            )
            }
        </Fragment >
    );
};

export default Guests;