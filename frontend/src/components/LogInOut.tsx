import React, { Fragment, useState, useEffect } from 'react';
import { useStateValue, setUser, discardUser, closeProfilePage, setOpenModalType } from '../state';
import { Menu } from 'semantic-ui-react';

import LoginModal from './LoginModal';
import { ModalType } from '../types';

// interface Props {
//     onLogin: (values: { name: string; password: string }) => void;
//     onCancel: () => void;
// }

const LogInOut: React.FC = () => {
    const [{ user, modalType }, dispatch] = useStateValue();

    const Logout = () => {
        discardUser(dispatch);
        dispatch(closeProfilePage());
    };

    useEffect(() => {
        setUser(dispatch);

    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            {user ?
                <Menu.Item type="button" onClick={Logout} color="grey">
                    Logout
                </Menu.Item>
                :
                <Menu.Item type="button" onClick={() => dispatch(setOpenModalType(ModalType.LoginModal))} color="grey">
                    Login
                </Menu.Item>
            }
        </Fragment >
    );
};

export default LogInOut;