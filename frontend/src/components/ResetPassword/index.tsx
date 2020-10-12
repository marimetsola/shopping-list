import React, { useState } from 'react';
import { useStateValue, setOpenModalType } from '../../state';
import { ModalType } from '../../types';
import ResetForm from './ResetForm';
import userService from '../../services/users';
import { Container, Header } from 'semantic-ui-react';

// interface Props {
//     open: boolean;
// }

const ResetPassword: React.FC<{}> = () => {
    const [{ isDesktop }, dispatch] = useStateValue();


    const resetPassword = async (values: { password: string }) => {
        console.log(values.password);
    };


    const adviceStyle =
    {
        marginTop: "2rem",
        marginBottom: "1rem",
        textAlign: "center"
    };


    if (isDesktop) {
        return <Container className={"cont-style"} style={{ width: "60%" }}>
            <Header as="h2" style={adviceStyle}>Set new password</Header>
            <ResetForm
                onSubmit={resetPassword}
            />
        </Container>;
    } else {
        return <Container className={"cont-style-mobile"} >
            <Header as="h2" style={adviceStyle}>Set new password</Header>
            <ResetForm
                onSubmit={resetPassword}
            />
        </Container>;
    }

};

export default ResetPassword;
