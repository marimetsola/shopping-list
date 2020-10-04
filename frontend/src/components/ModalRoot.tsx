import React from 'react';
import { useStateValue } from '../state';
import ModalTest from './ModalTest';
import LoginModal from './LoginModal';
import { ModalType } from '../types';

const MODAL_COMPONENTS = {
    [ModalType.TestModal]: ModalTest,
    [ModalType.LoginModal]: LoginModal,
};

interface Props {
    open: boolean;
    onClose: () => void;
}

const ModalRoot: React.FC<Props> = ({ open, onClose }) => {
    const [{ modalType }] = useStateValue();

    if (modalType === ModalType.None) {
        return null;
    }

    const SpecificModal = MODAL_COMPONENTS[modalType];
    return <SpecificModal open={open} onClose={onClose} />;
};

export default ModalRoot;