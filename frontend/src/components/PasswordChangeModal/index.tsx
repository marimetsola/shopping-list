import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import ModalForm from './ModalForm';

interface Props {
    open: boolean;
    onSubmit: (values: { oldPassword: string; newPassword: string },
        action: FormikHelpers<{ oldPassword: string; newPassword: string }>) => void;
    onClose: () => void;
    header: string;
    validate: any;
    initialValue: string;
}

const PasswordChangeModal: React.FC<Props> = ({ open, onSubmit, onClose, header, validate }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                <ModalForm onSubmit={onSubmit} onCancel={() => { onClose(); setShowPassword(false); }} showPassword={showPassword} toggleShowPassword={toggleShowPassword} validate={validate} />
            </Modal.Content>
        </Modal >
    );
};

export default PasswordChangeModal;
