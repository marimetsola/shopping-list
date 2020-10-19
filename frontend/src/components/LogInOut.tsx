import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateValue, getUserFromLocal, discardUser, setOpenModalType } from '../state';
import { Menu } from 'semantic-ui-react';
import { trackPromise } from 'react-promise-tracker';
import { ModalType } from '../types';

const LogInOut: React.FC = () => {
    const [{ user }, dispatch] = useStateValue();
    const history = useHistory();

    const Logout = () => {
        discardUser(dispatch);
        dispatch(setOpenModalType(ModalType.None));
        history.push('/');
    };

    useEffect(() => {
        trackPromise(getUserFromLocal(dispatch));

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