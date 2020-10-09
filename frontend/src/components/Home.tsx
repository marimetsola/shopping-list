import React from 'react';
import { useStateValue, setOpenModalType } from '../state';
import { Container, Header, Button, Segment } from 'semantic-ui-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import RecoveryModal from './RecoveryModal';
import { ModalType } from '../types';

const Home: React.FC = () => {
    const [{ user, isDesktop, modalType }, dispatch] = useStateValue();

    const contStyle = { padding: "0 4.6rem" };

    const adviceStyle =
    {
        marginTop: "4rem",
        textAlign: "center"
    };

    const loginButtonStyle = () => {
        if (isDesktop) {
            return { marginRight: "1rem" };
        } else {
            return { marginBottom: "1rem" };
        }
    };

    const registerButtonStyle = () => {
        if (isDesktop) {
            return { marginLeft: "1rem" };
        } else {
            return null;
        }
    };

    if (user) {

        return (
            <Container style={contStyle}>
                <Header as="h2" style={adviceStyle}>Create or select a list.</Header>
            </Container>
        );
    }


    return (
        <Container style={contStyle}>
            <Header as="h2" style={adviceStyle}>Please login or register to use the site.</Header>
            <Segment basic textAlign={"center"}>
                <Button style={loginButtonStyle()} secondary content="Login" onClick={() => dispatch(setOpenModalType(ModalType.LoginModal))} />
                <Button style={registerButtonStyle()} secondary content="Register" onClick={() => dispatch(setOpenModalType(ModalType.RegisterModal))} />
            </Segment>

            <LoginModal open={modalType === ModalType.LoginModal} />
            <RegisterModal open={modalType === ModalType.RegisterModal} />
            <RecoveryModal open={modalType === ModalType.RecoveryModal} />
        </Container>
    );


};

export default Home;
