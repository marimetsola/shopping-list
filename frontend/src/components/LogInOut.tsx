import React, { Fragment, useState, useEffect } from 'react';
import { useStateValue, setUser, discardUser } from '../state';
import { Menu } from 'semantic-ui-react';

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
                <Menu.Item type="button" onClick={() => setLoginModalOpen(true)} color="grey">
                    Login
                </Menu.Item>
            }

            <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </Fragment>
    );
};

export default LogInOut;