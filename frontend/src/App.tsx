import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue, setDesktop } from './state';
import { Container, Header, Button, Segment } from 'semantic-ui-react';
import ProfilePage from './components/ProfilePage';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

const App: React.FC = () => {
    const [{ user, profilePageOpen }, dispatch] = useStateValue();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

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

    const pageToRender = () => {
        if (user) {
            if (profilePageOpen) {
                return <ProfilePage />;
            } else {
                return <ActiveList />;
            }

        }

        if (isDesktop) {
            return (
                <Container style={contStyle}>
                    <Header as="h2" style={adviceStyle}>Please login or register to use the site.</Header>
                    <Segment basic textAlign={"center"}>
                        <Button style={{ marginRight: "1rem" }} secondary content="Login" onClick={() => setLoginModalOpen(true)} />
                        <Button style={{ marginLeft: "1rem" }} secondary content="Register" onClick={() => setRegisterModalOpen(true)} />
                    </Segment>

                    <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
                    <RegisterModal open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} />
                </Container>
            );
        } else {
            return (
                <Container style={contStyle}>
                    <Header as="h2" style={adviceStyle}>Please login or register to use the site.</Header>
                    <Segment basic textAlign={"center"}>
                        <Button style={{ marginBottom: "1rem" }} secondary content="Login" onClick={() => setLoginModalOpen(true)} />
                        <Button secondary content="Register" onClick={() => setRegisterModalOpen(true)} />
                    </Segment>

                    <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
                    <RegisterModal open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} />
                </Container>
            );
        }

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
