import React from 'react';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue } from './state';
import { Container, Header } from 'semantic-ui-react';
import ModalRoot from './components/ModalRoot';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
    const [{ user, profilePageOpen }] = useStateValue();

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
                <ModalRoot />
            </Container>
        </div >
    );
};

export default App;
