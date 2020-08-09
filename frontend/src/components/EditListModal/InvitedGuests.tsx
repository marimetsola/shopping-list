import React, { Fragment } from 'react';
import { ItemList } from '../../types';
import { Button, Segment, Grid } from "semantic-ui-react";
import { User } from '../../types';
import listService from '../../services/lists';
import { uninviteGuest, changeActiveList, useStateValue } from '../../state';

const InvitedGuests: React.FC<{ list: ItemList }> = ({ list }) => {
    const [{ user }, dispatch] = useStateValue();

    const removeInvitation = async (guest: User) => {
        try {
            const editedList = await listService.uninviteGuest(list.id, guest.id);
            dispatch(uninviteGuest(editedList));
            if (user) {
                changeActiveList(editedList, user, dispatch);
            }
        } catch (error) {
            // action.setErrors({ name: "User does not exist." });
            console.log(error);
        }
    };
    if (!list) {
        return null;
    }

    const contStyle = {
        padding: "7px 7px 7px 14px",
    };

    const normalStyle = {
        fontSize: "1rem"
    };

    if (list.invitedGuests.length === 0) {
        return (
            <Fragment>
                <label style={{ fontWeight: 'bold' }}>Invitations</label>
                <p style={normalStyle}>List has no pending invitations.</p>
            </Fragment >

        );
    }
    return (
        <Fragment>
            <label style={{ fontWeight: 'bold' }}>Invitations</label>
            {list.invitedGuests.map(g =>

                <Segment key={g.id}>
                    <Grid>
                        <Grid.Column style={contStyle} floated="left" verticalAlign="middle" width={5}>
                            <span>{g.name}</span>
                        </Grid.Column>
                        <Grid.Column style={contStyle} floated="right" width={5}>
                            <Button floated="right" size="mini" color="red" onClick={() => removeInvitation(g)} icon="delete" />
                        </Grid.Column>

                    </Grid>

                </Segment>
            )
            }
        </Fragment >
    );
};

export default InvitedGuests;