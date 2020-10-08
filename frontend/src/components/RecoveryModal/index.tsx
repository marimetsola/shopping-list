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
    const [emailFound, setEmailFound] = useState(false);
    const [emailNotFound, setEmailNotFound] = useState(false);

    const closeModal = () => {
        onClose();
        setEmailNotFound(false);
    };

    const openLoginModal = () => {
        closeModal();
        dispatch(setOpenModalType(ModalType.LoginModal));
    };

    const sendMail = async (values: { email: string }) => {
        try {
            const response = await userService.getUserByEmail(values.email);
            console.log(response);
            if (response) {
                setEmailNotFound(false);
                setEmailFound(true);
            } else {
                setEmailFound(false);
                setEmailNotFound(true);
            }
        } catch (error) {
            setEmailNotFound(true);
        }
    };

    const resetMessage = () => {
        setEmailFound(false);
        setEmailNotFound(false);
    };

    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Request a password reset</Modal.Header>
            <Modal.Content>
                <RecoveryForm
                    onSubmit={sendMail}
                    onCancel={closeModal}
                    onOpenLoginModal={openLoginModal}
                    emailFound={emailFound}
                    emailNotFound={emailNotFound}
                    resetMessage={resetMessage} />
            </Modal.Content>
        </Modal >
    );
};

export default RecoveryModal;
