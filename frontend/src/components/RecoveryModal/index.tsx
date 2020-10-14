import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { useStateValue, setOpenModalType } from '../../state';
import { ModalType } from '../../types';
import RecoveryForm from './RecoveryForm';
import userService from '../../services/users';

interface Props {
    open: boolean;
}

const RecoveryModal: React.FC<Props> = ({ open }) => {
    const [, dispatch] = useStateValue();
    const [emailFound, setEmailFound] = useState(false);
    const [emailNotFound, setEmailNotFound] = useState(false);

    const closeModal = () => {
        setEmailFound(false);
        setEmailNotFound(false);
        dispatch(setOpenModalType(ModalType.None));
    };

    const sendMail = async (values: { email: string }) => {
        const response = await userService.requestReset(values.email);
        if (response.status === 200) {
            setEmailNotFound(false);
            setEmailFound(true);
        } else {
            setEmailFound(false);
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
                    emailFound={emailFound}
                    emailNotFound={emailNotFound}
                    resetMessage={resetMessage} />
            </Modal.Content>
        </Modal >
    );
};

export default RecoveryModal;
