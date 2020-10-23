import React, { useState, useEffect } from 'react';
import { useStateValue, setOpenModalType } from '../../state';
import { useParams } from 'react-router-dom';
import { ModalType } from '../../types';
import ResetForm from './ResetForm';
import userService from '../../services/users';
import { Container, Header, Button } from 'semantic-ui-react';
import ButtonLink from '../ButtonLink';

const ResetPassword: React.FC<{}> = () => {
    const [{ isDesktop }, dispatch] = useStateValue();
    const { token } = useParams<{ token: string }>();
    const [validatedUserId, setValidatedUserId] = useState<string | undefined>(undefined);
    const [resetSuccessful, setResetSuccessful] = useState(false);

    useEffect(() => {

        const validateUser = async () => {
            try {
                const response = await userService.validateToken(token);
                setValidatedUserId(response.data.id);
            } catch (error) {
                setValidatedUserId("");
            }

        };

        validateUser();
    }, [token]);

    const resetPassword = async (values: { email: string; password: string }) => {
        if (validatedUserId) {
            userService.resetPassword(values.email, values.password);
            setResetSuccessful(true);
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

    if (validatedUserId === undefined) {
        return null;
    }

    if (validatedUserId === "") {
        return <Container className={isDesktop ? "cont-style" : 'cont-style-mobile'} style={isDesktop ? { width: "60%" } : {}}>
            <Header as="h2" style={adviceStyle}>Password reset link expired.</Header>
            <div className="center-container">
                <ButtonLink
                    onClick={() => dispatch(setOpenModalType(ModalType.RecoveryModal))}>
                    Click here to request a new one.
                </ButtonLink>
            </div>
        </Container>;
    }

    if (resetSuccessful) {
        return <Container className={isDesktop ? "cont-style" : 'cont-style-mobile'} style={isDesktop ? { width: "60%" } : {}}>
            <Header as="h2" style={adviceStyle}>Password changed.</Header>
            <div className="center-container">
                <Button secondary content="Login" onClick={() => dispatch(setOpenModalType(ModalType.LoginModal))} />
            </div>
        </Container>;
    }

    return <Container className={isDesktop ? "cont-style" : 'cont-style-mobile'} style={isDesktop ? { width: "60%" } : {}}>
        <Header as="h2" style={adviceStyle}>Set new password</Header>
        <ResetForm
            onSubmit={resetPassword}
        />
    </Container>;
};


export default ResetPassword;
