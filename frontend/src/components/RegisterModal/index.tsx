import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, register } from '../../state';
import RegisterForm from './RegisterForm';
import LoginModal from '../LoginModal';

interface Props {
    open: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const [registerFailed, setRegisterFailed] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const closeModal = () => {
        onClose();
        setRegisterFailed(false);
    };

    const Register = async (values: { name: string; email: string; password: string }) => {
        try {
            await register(values.name, values.email, values.password, dispatch);
            onClose();
        } catch (error) {
            setRegisterFailed(true);
        }
    };
    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Register</Modal.Header>
            <Modal.Content>
                <RegisterForm onSubmit={Register} onCancel={closeModal} onLoginClick={() => setLoginModalOpen(true)} registerFailed={registerFailed} />
            </Modal.Content>
        </Modal >
    );

};

export default RegisterModal;
