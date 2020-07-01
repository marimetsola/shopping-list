import React from 'react';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue } from './state';
import { Container, Header } from 'semantic-ui-react';

const App: React.FC = () => {
    const [{ user }] = useStateValue();

    const contStyle = { padding: "0 4.6rem" };


    const adviceStyle =
    {
        marginTop: "4rem",
        textAlign: "center"
    };

    return (
        <div>
            <NavBar />
            <Container>
                {user ?
                    <ActiveList />
                    :
                    <Container style={contStyle}>
                        <Header as="h2" style={adviceStyle}>Please login to use the site.</Header>
                    </Container >
                }
                <AddListModal />
            </Container>
        </div >
    );
};

export default App;
