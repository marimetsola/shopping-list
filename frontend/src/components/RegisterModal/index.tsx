import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, register } from '../../state';
import LoginForm from './RegisterForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const Register = async (values: { name: string; password: string }) => {
        try {
            await register(values.name, values.password, dispatch);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>Register</Modal.Header>
            <Modal.Content>
                <LoginForm onSubmit={Register} onCancel={onClose} />
            </Modal.Content>
        </Modal >
    );
};

export default RegisterModal;
