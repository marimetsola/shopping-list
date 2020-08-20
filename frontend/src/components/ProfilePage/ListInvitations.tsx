import React, { useState, useEffect, Fragment } from 'react';
import { useStateValue, acceptInvitation, declineInvitation, closeProfilePage } from '../../state';
import { Icon, Table, Button, Divider, Header } from 'semantic-ui-react';
import { ItemList, User } from '../../types';

interface Props {
    user: User;
}

const ListInvitations: React.FC<Props> = ({ user }) => {
    const [, dispatch] = useStateValue();
    const [listInvitations, setListInvitations] = useState<ItemList[]>();

    useEffect(() => {
        setListInvitations(user.listInvitations);

    }, [user]);

    const acceptListInvitation = async (list: ItemList) => {
        if (user) {
            await acceptInvitation(list, user, dispatch);
            dispatch(closeProfilePage());
        }
    };

    const declineListInvitation = (list: ItemList) => {
        if (user) {
            declineInvitation(list, user, dispatch);
        }
    };

    if (!user || !listInvitations) {
        return null;
    }

    const dividerStyle = { padding: "1rem 0 1rem 0" };

    return (
        <Fragment>
            <Divider style={dividerStyle} horizontal>
                <Header as='h4'>
                    List Invitations
            </Header>
            </Divider>
            {listInvitations && listInvitations.length === 0 ?
                <p style={{ paddingBottom: "1.3rem" }}>No new invitations.</p>
                :
                <Table>
                    <Table.Body>
                        {listInvitations && listInvitations.map((inv) =>
                            <Table.Row key={inv.id}>
                                <Table.Cell>{inv.name} by {inv.user.name}</Table.Cell>
                                <Table.Cell textAlign='right'>
                                    <Button positive size="mini" onClick={() => acceptListInvitation(inv)}>
                                        <Icon name='check' />Accept
                                </Button>
                                    <Button negative size="mini" onClick={() => declineListInvitation(inv)}>
                                        <Icon name='delete' />Decline
                                </Button>
                                </Table.Cell>
                            </Table.Row>)}
                    </Table.Body>
                </Table>}
        </Fragment>
    );
};

export default ListInvitations;