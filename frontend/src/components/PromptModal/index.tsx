import React from 'react';
import { Modal } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import ModalForm from './ModalForm';

interface Props {
    open: boolean;
    onSubmit: (values: { name: string }, action: FormikHelpers<{ name: string }>) => void;
    onClose: () => void;
    label: string;
    header: string;
    placeHolder: string;
    validate: any;
    initialValue: string;
}

const PromptModal: React.FC<Props> = ({ open, onSubmit, onClose, label, header, placeHolder, validate, initialValue }) => {

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                <ModalForm onSubmit={onSubmit} onCancel={onClose} label={label} placeHolder={placeHolder} validate={validate} initialValue={initialValue} />
            </Modal.Content>
        </Modal >
    );
};

export default PromptModal;
