import React from 'react';
import { useStateValue } from '../state';
import ModalTest from './ModalTest';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import RecoveryModal from './RecoveryModal';
import { ModalType } from '../types';

const MODAL_COMPONENTS = {
    [ModalType.TestModal]: ModalTest,
    [ModalType.LoginModal]: LoginModal,
    [ModalType.RegisterModal]: RegisterModal,
    [ModalType.RecoveryModal]: RecoveryModal
};

interface Props {
    open: boolean;
    onClose: () => void;
}

const ModalRoot: React.FC<Props> = ({ open }) => {
    const [{ modalType }] = useStateValue();

    if (modalType === ModalType.None) {
        return null;
    }

    const SpecificModal = MODAL_COMPONENTS[modalType];
    return <SpecificModal open={open} />;
};

export default ModalRoot;