import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, login } from '../../state';
import LoginForm from './LoginForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const [loginFailed, setLoginFailed] = useState(false);

    const closeModal = () => {
        setLoginFailed(false);
        onClose();
    };

    const Login = async (values: { name: string; password: string }) => {
        try {
            closeModal();
            await login(values.name, values.password, dispatch);
        } catch (error) {
            setLoginFailed(true);
        }
    };

    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Login</Modal.Header>
            <Modal.Content>
                <LoginForm onSubmit={Login} onCancel={closeModal} loginFailed={loginFailed} />
            </Modal.Content>
        </Modal >
    );
};

export default LoginModal;
