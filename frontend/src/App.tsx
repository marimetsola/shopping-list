import React, { useEffect } from 'react';
import NavBar from './components/NavBar';
import ActiveList from './components/ActiveList';
import AddListModal from './components/AddListModal';
import { useStateValue, setLists } from './state';
import listService from './services/lists';
import { Container } from 'semantic-ui-react';

const App: React.FC = () => {
    const [, dispatch] = useStateValue();
    useEffect(() => {
        const fetchLists = async () => {
            try {
                const listsFromApi = await listService.getLists();
                dispatch(setLists(listsFromApi));
            } catch (e) {
                console.error(e);
            }
        };
        fetchLists();
    }, [dispatch]);
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
