import React, { useEffect, useState } from 'react';
import { useStateValue, clearActiveList } from '../../state';
import { Container, Header, Divider, Table } from 'semantic-ui-react';
import Name from './Name';
import Email from './Email';
import Password from './Password';
import ListInvitations from './ListInvitations';
import userService from '../../services/users';
import { User } from '../../types';
import { usePromiseTracker } from 'react-promise-tracker';
import { Redirect, useHistory } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const [{ user, isDesktop, activeList }, dispatch] = useStateValue();
    const [userProp, setUserProp] = useState<User>();
    const dividerStyle = { padding: "1rem 0 1rem 0" };
    const { promiseInProgress } = usePromiseTracker();
    const history = useHistory();

    useEffect(() => {
        dispatch(clearActiveList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user?.listInvitations]);

    useEffect(() => {
        let isMounted = true;
        const getUser = async () => {
            if (user) {
                const userToReturn: User = await userService.getUser(user.id);
                if (isMounted) {
                    setUserProp(userToReturn);
                }
            }
        };
        getUser();
        return () => { isMounted = false; };
    }, [user]);

    if (!user) {
        history.push('/');
    }
    if (!user || !userProp || promiseInProgress) {
        return null;
    }

    if (activeList) {
        return <Redirect to="/list" />;
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
                    <Password user={userProp} />
                </Table.Body>
            </Table>
            <ListInvitations user={userProp} />

        </Container >
    );
};

export default ProfilePage;
