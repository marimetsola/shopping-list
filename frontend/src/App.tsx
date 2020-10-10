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
import Home from './components/Home';

const App: React.FC = () => {
    const [, dispatch] = useStateValue();

    const handleMediaQueryChange = (matches: boolean) => {
        dispatch(setDesktop(matches));
    };

    const isDesktop = useMediaQuery({ minDeviceWidth: 900 }, undefined, handleMediaQueryChange);

    useEffect(() => {
        dispatch(setDesktop(isDesktop));
    }, [dispatch, isDesktop]);

    return (
        <Router>
            <div>
                <NavBar />
                <Container>
                    <Switch>
                        <Route path="/profile">
                            <ProfilePage />
                        </Route>
                        <Route path="/list">
                            <ActiveList />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                    <AddListModal />
                </Container>
            </div >
        </Router>
    );
};

export default App;
