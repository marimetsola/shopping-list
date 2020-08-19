import React from 'react';
import { Modal } from 'semantic-ui-react';
import ModalForm from './ModalForm';

interface Props {
    open: boolean;
    onSubmit: (values: { name: string }, action: any) => void;
    onClose: () => void;
    label: string;
    header: string;
    placeHolder: string;
}

const PromptModal: React.FC<Props> = ({ open, onSubmit, onClose, label, header, placeHolder }) => {

    return (
        <Modal open={open} onClose={onClose} centered={false} size="tiny" closeIcon>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                <ModalForm onSubmit={onSubmit} onCancel={onClose} label={label} placeHolder={placeHolder} />
            </Modal.Content>
        </Modal >
    );
};

export default PromptModal;
