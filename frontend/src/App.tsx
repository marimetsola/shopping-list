import React, { useEffect } from 'react';
import {
    BrowserRouter as Router, Switch, Route
} from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue, setDesktop } from './state';
import { Container } from 'semantic-ui-react';
import ProfilePage from './components/ProfilePage';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RecoveryModal from './components/RecoveryModal';
import { ModalType } from './types';
import LoadingIndicator from './components/LoadingIndicator';
import { publicUrl } from './constants';

const App: React.FC = () => {
    const [{ modalType }, dispatch] = useStateValue();

    const handleMediaQueryChange = (matches: boolean) => {
        dispatch(setDesktop(matches));
    };

    const isDesktop = useMediaQuery({ minDeviceWidth: 900 }, undefined, handleMediaQueryChange);

    useEffect(() => {
        dispatch(setDesktop(isDesktop));
    }, [dispatch, isDesktop]);

    return (
        <Router basename={publicUrl}>
            <div>
                <NavBar />
                <LoadingIndicator />
                <Container>
                    <Switch>
                        <Route path="/profile">
                            <ProfilePage />
                        </Route>
                        <Route path="/list">
                            <ActiveList />
                        </Route>
                        <Route path="/users/reset-password/:token">
                            <ResetPassword />
                        </Route>
                        <Route path="/users/reset-password/">
                            <p>Test</p>
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                    <AddListModal />
                    <LoginModal open={modalType === ModalType.LoginModal} />
                    <RegisterModal open={modalType === ModalType.RegisterModal} />
                    <RecoveryModal open={modalType === ModalType.RecoveryModal} />
                </Container>
            </div >
        </Router>
    );
};

export default App;
