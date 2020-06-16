import React from 'react';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { Container } from 'semantic-ui-react';

const App: React.FC = () => {
    return (
        <div>
            <NavBar />
            <Container>
                <ActiveList />
                <AddListModal />
            </Container>
        </div >
    );
};

export default App;
