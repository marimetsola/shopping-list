import React, { useState, useEffect } from 'react';
import { useStateValue, setOpenModalType } from '../../state';
import { useParams } from 'react-router-dom';
import { ModalType } from '../../types';
import ResetForm from './ResetForm';
import userService from '../../services/users';
import { Container, Header } from 'semantic-ui-react';

const ResetPassword: React.FC<{}> = () => {
    const [{ isDesktop }, dispatch] = useStateValue();
    const { token } = useParams<{ token: string }>();
    const [userId, setUserId] = useState<string>();

    useEffect(() => {

        const validateUser = async () => {
            const response = await userService.validateToken(token);
            setUserId(response.data);
        };

        validateUser();
    }, [token]);

    const resetPassword = async (values: { password: string }) => {
        console.log(userId, values.password);
        if (userId) {
            userService.resetPassword(userId, values.password);
        } else {
            // Add error telling about no user found
        }

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
