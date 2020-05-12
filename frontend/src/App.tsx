import React, { useEffect } from 'react';
import axios from 'axios';
import NavBar from './components/NavBar'
import ActiveList from './components/ActiveList'
import AddListModal from './components/AddListModal'
import { ItemList } from './types'

import { apiBaseUrl } from './constants';
import { useStateValue, setLists } from './state'

import { Container } from 'semantic-ui-react'

const App: React.FC = () => {
    const [, dispatch] = useStateValue();
    useEffect(() => {
        const fetchLists = async () => {
            try {
                const { data: listsFromApi } = await axios.get<ItemList[]>(
                    `${apiBaseUrl}/lists`
                );
                dispatch(setLists(listsFromApi));
            } catch (e) {
                console.error(e);
            }
        };
        fetchLists();
    }, [dispatch])
    return (
        <Container>
            <NavBar />
            <ActiveList />
            <AddListModal />
        </Container>
    );
}

export default App;
