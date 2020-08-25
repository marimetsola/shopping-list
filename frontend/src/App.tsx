import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue, setDesktop } from './state';
import { Container, Header } from 'semantic-ui-react';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
    const [{ user, profilePageOpen }, dispatch] = useStateValue();

    const handleMediaQueryChange = (matches: boolean) => {
        dispatch(setDesktop(matches));
    };

    const isDesktop = useMediaQuery({ minDeviceWidth: 900 }, undefined, handleMediaQueryChange);

    useEffect(() => {
        dispatch(setDesktop(isDesktop));
    }, []);

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
        return (
            <Container style={contStyle}>
                <Header as="h2" style={adviceStyle}>Please login to use the site.</Header>
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
