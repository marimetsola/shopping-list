import React from 'react';
import { Modal } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import ModalForm from './ModalForm';

interface Props {
    open: boolean;
    onSubmit: (values: { oldPassword: string; newPassword0: string; newPassword1: string },
        action: FormikHelpers<{ oldPassword: string; newPassword0: string; newPassword1: string }>) => void;
    onClose: () => void;
    header: string;
    validate: any;
    initialValue: string;
}

const PasswordChangeModal: React.FC<Props> = ({ open, onSubmit, onClose, header, validate }) => {

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                <ModalForm onSubmit={onSubmit} onCancel={onClose} validate={validate} />
            </Modal.Content>
        </Modal >
    );
};

export default PasswordChangeModal;
