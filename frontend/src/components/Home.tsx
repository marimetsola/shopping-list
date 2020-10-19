import React from 'react';
import { Redirect } from 'react-router-dom';
import { useStateValue, setOpenModalType } from '../state';
import { Container, Header, Button, Segment } from 'semantic-ui-react';
import { ModalType } from '../types';
import { usePromiseTracker } from 'react-promise-tracker';

const Home: React.FC = () => {
    const [{ user, isDesktop }, dispatch] = useStateValue();
    const contStyle = { padding: "0 4.6rem" };
    const { promiseInProgress } = usePromiseTracker();

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

    if (promiseInProgress) {
        return null;
    }

    if (user) {
        return <Redirect to="/list" />;
        // return (
        //     <Container style={contStyle}>
        //         <Header as="h2" style={adviceStyle}>Create or select a list. *home*</Header>
        //     </Container>
        // );
    }

    return (
        <Container style={contStyle}>
            <Header as="h2" style={adviceStyle}>Please login or register to use the site.</Header>
            <Segment basic textAlign={"center"}>
                <Button style={loginButtonStyle()} secondary content="Login" onClick={() => dispatch(setOpenModalType(ModalType.LoginModal))} />
                <Button style={registerButtonStyle()} secondary content="Register" onClick={() => dispatch(setOpenModalType(ModalType.RegisterModal))} />
            </Segment>
        </Container>
    );


};

export default Home;
