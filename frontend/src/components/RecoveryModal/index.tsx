import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, setOpenModalType } from '../../state';
import { ModalType } from '../../types';
import RecoveryForm from './RecoveryForm';
import userService from '../../services/users';

interface Props {
    open: boolean;
    onClose: () => void;
}

const RecoveryModal: React.FC<Props> = ({ open, onClose }) => {
    const [, dispatch] = useStateValue();
    const [emailNotFound, setEmailNotFound] = useState(false);

    const closeModal = () => {
        onClose();
        setEmailNotFound(false);
    };

    const openResetModal = () => {
        closeModal();
        dispatch(setOpenModalType(ModalType.LoginModal));
    };

    const sendMail = async (values: { email: string }) => {
        try {
            const response = await userService.getUserByEmail(values.email);
            console.log(response);
            if (response) {
                // Open password reset modal
            } else {
                setEmailNotFound(true);
            }
        } catch (error) {
            setEmailNotFound(true);
        }
    };

    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Recover account information</Modal.Header>
            <Modal.Content>
                <RecoveryForm onSubmit={sendMail} onCancel={closeModal} onOpenResetModal={openResetModal} emailNotFound={emailNotFound} />
            </Modal.Content>
        </Modal >
    );
};

export default RecoveryModal;
