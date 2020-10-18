import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CommentActions, Modal } from 'semantic-ui-react';
import { useStateValue, register, setOpenModalType } from '../../state';
import { ModalType } from '../../types';
import RegisterForm from './RegisterForm';
import { FormikHelpers } from "formik";

interface Props {
    open: boolean;
}

const RegisterModal: React.FC<Props> = ({ open }) => {
    const [, dispatch] = useStateValue();
    const history = useHistory();

    const closeModal = () => {
        dispatch(setOpenModalType(ModalType.None));
    };

    // const changeName = async (values: { name: string; password: string }, action: FormikHelpers<{ name: string; password: string }>) => {

    const Register = async (values: { name: string; email: string; password: string }, action: FormikHelpers<{ name: string; email: string; password: string }>) => {
        try {
            await register(values.name, values.email, values.password, dispatch);
            history.push('/list');
            dispatch(setOpenModalType(ModalType.None));
        } catch (error) {
            if (error.response.data) {
                action.setErrors({ name: error.response.data });
            }

        }
    };
    return (
        <Modal open={open} onClose={closeModal} centered={false} size="tiny" closeIcon>
            <Modal.Header>Register</Modal.Header>
            <Modal.Content>
                <RegisterForm onSubmit={Register} onCancel={closeModal} />
            </Modal.Content>
        </Modal >
    );

};

export default RegisterModal;
