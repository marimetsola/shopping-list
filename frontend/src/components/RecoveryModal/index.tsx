import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, login } from '../../state';
import RecoveryForm from './RecoveryForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

const RecoveryModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const [loginFailed, setLoginFailed] = useState(false);

    const closeModal = () => {
        onClose();
        setLoginFailed(false);
    };

    const Login = async (values: { name: string; password: string }) => {
        try {
            await login(values.name, values.password, dispatch);
            closeModal();
        } catch (error) {
            setLoginFailed(true);
        }
    };

    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Recover account information</Modal.Header>
            <Modal.Content>
                <RecoveryForm onSubmit={Login} onCancel={closeModal} loginFailed={loginFailed} />
            </Modal.Content>
        </Modal >
    );
};

export default RecoveryModal;
