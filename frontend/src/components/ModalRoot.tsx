import React from 'react';
import { useStateValue } from '../state';
import ModalTest from './ModalTest';
import { ModalType } from '../types';

const MODAL_COMPONENTS = {
    [ModalType.TestModal]: ModalTest,
};

const ModalRoot: React.FC = () => {
    const [{ modalType }] = useStateValue();

    if (modalType === ModalType.None) {
        return null;
    }

    const SpecificModal = MODAL_COMPONENTS[modalType];
    return <SpecificModal />;
    // return <SpecificModal {...modalProps} />;
};



export default ModalRoot;