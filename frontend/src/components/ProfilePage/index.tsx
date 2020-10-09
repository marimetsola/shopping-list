import React, { useEffect, useState } from 'react';
import { useStateValue, clearActiveList } from '../../state';
import { Container, Header, Divider, Table } from 'semantic-ui-react';
import Name from './Name';
import Email from './Email';
import ListInvitations from './ListInvitations';
import userService from '../../services/users';
import { User } from '../../types';

const ProfilePage: React.FC = () => {
    const [{ user, isDesktop }, dispatch] = useStateValue();
    const [userProp, setUserProp] = useState<User>();
    const dividerStyle = { padding: "1rem 0 1rem 0" };

    useEffect(() => {
        dispatch(clearActiveList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user?.listInvitations]);

    useEffect(() => {
        const getUser = async () => {
            if (user) {
                const userToReturn: User = await userService.getUser(user.id);
                setUserProp(userToReturn);
            }
        };
        getUser();
    }, [user]);

    if (!user || !userProp) {
        return null;
    }

    return (
        <Container className={isDesktop ? "cont-style" : "cont-style-mobile"}>
            <Divider style={dividerStyle} horizontal>
                <Header as='h4'>
                    Account information
                </Header>
            </Divider>
            <Table definition>
                <Table.Body>
                    <Name user={userProp} />
                    <Email user={userProp} />
                </Table.Body>
            </Table>
            <ListInvitations user={userProp} />

        </Container >
    );
};

export default ProfilePage;
