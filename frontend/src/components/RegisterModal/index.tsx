import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';
import { useStateValue, register, setOpenModalType } from '../../state';
import { ModalType } from '../../types';
import RegisterForm from './RegisterForm';

interface Props {
    open: boolean;
}

const RegisterModal: React.FC<Props> = ({ open }) => {
    const [, dispatch] = useStateValue();
    const [registerFailed, setRegisterFailed] = useState('');
    const history = useHistory();

    const closeModal = () => {
        setRegisterFailed('');
        dispatch(setOpenModalType(ModalType.None));
    };

    const Register = async (values: { name: string; email: string; password: string }) => {
        try {
            await register(values.name, values.email, values.password, dispatch);
            history.push('/list');
            dispatch(setOpenModalType(ModalType.None));
        } catch (error) {
            setRegisterFailed(error.response.data);
        }
    };
    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Register</Modal.Header>
            <Modal.Content>
                <RegisterForm onSubmit={Register} onCancel={closeModal} registerFailed={registerFailed} />
            </Modal.Content>
        </Modal >
    );

};

export default RegisterModal;
