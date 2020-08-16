import React, { useEffect, useState } from 'react';
import { useStateValue, clearActiveList, acceptInvitation, declineInvitation, closeProfilePage, changeUserName } from '../state';
import { Container, Header, Icon, Divider, Table, Button } from 'semantic-ui-react';
import { ItemList, User } from '../types';
import userService from '../services/users';
import PromptModal from './PromptModal';

const ProfilePage: React.FC = () => {
    const [{ user, profilePageOpen }, dispatch] = useStateValue();
    const [listInvitations, setListInvitations] = useState<ItemList[]>();
    const [nameModalOpen, setNameModalOpen] = useState<boolean>(false);

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

    const changeName = (values: { name: string }) => {
        if (user) {
            changeUserName(user, values.name, dispatch);
            setNameModalOpen(false);
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
                        <Table.Cell textAlign='right'>
                            <Button color="olive" size="mini" onClick={() => setNameModalOpen(true)}>
                                <Icon name='edit' />Change
                            </Button>
                        </Table.Cell>
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
            <PromptModal open={nameModalOpen} onSubmit={changeName} onClose={() => setNameModalOpen(false)} label="Enter new name" placeHolder="Name" />
        </Container >
    );
};

export default ProfilePage;
