import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useStateValue, deleteItem, editList, setUser, discardUser } from '../state';
import { Container, Header, Divider, Menu, Icon } from 'semantic-ui-react';
import EditListModal from './EditListModal';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import Item from './Item';
import { ItemType } from '../types';
import LoginModal from './LoginModal';

interface Props {
    onLogin: (values: { name: string; password: string }) => void;
    onCancel: () => void;
}

const LogInOut: React.FC = () => {
    const [{ user }, dispatch] = useStateValue();
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const Logout = () => {
        discardUser(dispatch);
    };
    // const Login = (values: { name: string; password: string }) => {
    //     setUser(dispatch);
    // };
    // useEffect(() => {

    // }, []);
    return (
        <Fragment>
            {user ?
                <Menu.Item type="button" onClick={Logout} color="grey">
                    Logout
                    </Menu.Item>
                :
                <Menu.Item type="button" onClick={() => setLoginModalOpen(true)} color="grey">
                    Login
                </Menu.Item>
            }

            <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </Fragment>
    );
};

export default LogInOut;