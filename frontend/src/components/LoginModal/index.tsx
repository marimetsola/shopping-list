import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, setUser, login } from '../../state';
import { ItemList, ItemType } from '../../types';
import LoginForm from './LoginForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const Login = async (values: { name: string; password: string }) => {
        console.log(values, "????????");
        try {
            await login(values.name, values.password, dispatch);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>Login</Modal.Header>
            <Modal.Content>
                <LoginForm onSubmit={Login} onCancel={onClose} />
            </Modal.Content>
        </Modal >
    );
};

export default LoginModal;
