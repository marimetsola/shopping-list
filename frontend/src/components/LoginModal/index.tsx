import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';
import { useStateValue, login, setOpenModalType } from '../../state';
import LoginForm from './LoginForm';
import { ModalType } from '../../types';

interface Props {
    open: boolean;
}

const LoginModal: React.FC<Props> = ({ open }) => {
    const [, dispatch] = useStateValue();
    const [loginFailed, setLoginFailed] = useState(false);
    const history = useHistory();


    const Login = async (values: { name: string; password: string }) => {
        try {
            await login(values.name, values.password, dispatch);
            dispatch(setOpenModalType(ModalType.None));
            setLoginFailed(false);
            history.push('/list');
        } catch (error) {
            setLoginFailed(true);
        }
    };

    return (
        <Modal open={open} onClose={() => dispatch(setOpenModalType(ModalType.None))} centered={false} size="tiny" closeIcon>
            <Modal.Header>Login</Modal.Header>
            <Modal.Content>
                <LoginForm onSubmit={Login} onCancel={() => dispatch(setOpenModalType(ModalType.None))} loginFailed={loginFailed} />
            </Modal.Content>
        </Modal >
    );
};

export default LoginModal;
