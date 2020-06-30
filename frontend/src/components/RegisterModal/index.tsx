import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, register } from '../../state';
import LoginForm from './RegisterForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const [registerFailed, setRegisterFailed] = useState(false);

    const closeModal = () => {
        onClose();
        setRegisterFailed(false);
    };

    const Register = async (values: { name: string; password: string }) => {
        try {
            await register(values.name, values.password, dispatch);
            onClose();
        } catch (error) {
            setRegisterFailed(true);
        }
    };

    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Register</Modal.Header>
            <Modal.Content>
                <LoginForm onSubmit={Register} onCancel={closeModal} registerFailed={registerFailed} />
            </Modal.Content>
        </Modal >
    );
};

export default RegisterModal;
