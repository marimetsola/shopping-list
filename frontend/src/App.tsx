import React, { useEffect } from 'react';
import {
    BrowserRouter as Router, Switch, Route, Link
} from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue, setDesktop, setOpenModalType } from './state';
import { Container, Header, Button, Segment } from 'semantic-ui-react';
import ProfilePage from './components/ProfilePage';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RecoveryModal from './components/RecoveryModal';
import { ModalType } from './types';

const App: React.FC = () => {
    const [{ user, profilePageOpen, modalType }, dispatch] = useStateValue();

    const handleMediaQueryChange = (matches: boolean) => {
        dispatch(setDesktop(matches));
    };

    const isDesktop = useMediaQuery({ minDeviceWidth: 900 }, undefined, handleMediaQueryChange);

    useEffect(() => {
        dispatch(setDesktop(isDesktop));
    }, [dispatch, isDesktop]);

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

    const pageToRender = () => {
        if (user) {
            if (profilePageOpen) {
                return <ProfilePage />;
            } else {
                return <ActiveList />;
            }

        }

        return (
            <Container style={contStyle}>
                <Header as="h2" style={adviceStyle}>Please login or register to use the site.</Header>
                <Segment basic textAlign={"center"}>
                    <Button style={loginButtonStyle()} secondary content="Login" onClick={() => dispatch(setOpenModalType(ModalType.LoginModal))} />
                    <Button style={registerButtonStyle()} secondary content="Register" onClick={() => dispatch(setOpenModalType(ModalType.RegisterModal))} />
                </Segment>

                <LoginModal open={modalType === ModalType.LoginModal} onClose={() => dispatch(setOpenModalType(ModalType.None))} />
                <RegisterModal open={modalType === ModalType.RegisterModal} onClose={() => dispatch(setOpenModalType(ModalType.None))} />
                <RecoveryModal open={modalType === ModalType.RecoveryModal} onClose={() => dispatch(setOpenModalType(ModalType.None))} />
            </Container>
        );
    };

    return (
        <div>
            <NavBar />
            <Container>
                {pageToRender()}
                <AddListModal />
            </Container>
        </div >
    );
};

export default App;
