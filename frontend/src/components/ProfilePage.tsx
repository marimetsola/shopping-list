import React, { useEffect, useState } from 'react';
import { useStateValue, clearActiveList, acceptInvitation, declineInvitation } from '../state';
import { Container, Header, Icon, Divider, Table, Button } from 'semantic-ui-react';
import { ItemList, User } from '../types';
import userService from '../services/users';

const ProfilePage: React.FC = () => {
    const [{ user, profilePageOpen }, dispatch] = useStateValue();
    const [listInvitations, setListInvitations] = useState<ItemList[]>();

    const contStyle = { padding: "0 4.6rem" };
    const dividerStyle = { padding: "1rem 0 1rem 0" };

    useEffect(() => {
        if (profilePageOpen) {
            dispatch(clearActiveList());
        }
    }, [dispatch, profilePageOpen]);

    useEffect(() => {
        const getListInvitations = async () => {
            if (user) {
                const userToReturn: User = await userService.getUser(user.id);
                setListInvitations(userToReturn.listInvitations);
            }
        };
        getListInvitations();
    }, [user]);

    const acceptListInvitation = (list: ItemList) => {
        if (user) {
            acceptInvitation(list, user, dispatch);
        }
    };

    const declineListInvitation = (list: ItemList) => {
        if (user) {
            declineInvitation(list, user, dispatch);
        }
    };

    if (!user) {
        return null;
    }

    const listInvTable = () => {
        return (
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
            </Table>
        );
    };

    return (
        <Container style={contStyle}>
            <Divider style={dividerStyle} horizontal>
                <Header as='h4'>
                    Account information
                </Header>
            </Divider>
            <Table definition>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={2}>Username</Table.Cell>
                        <Table.Cell>{user.name}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <Divider style={dividerStyle} horizontal>
                <Header as='h4'>
                    List Invitations
                </Header>
            </Divider>
            {listInvitations &&
                (listInvitations.length === 0
                    ?
                    <p style={{ paddingBottom: "1.3rem" }}>No new invitations.</p>
                    :
                    listInvTable())}
        </Container >
    );
};

export default ProfilePage;
