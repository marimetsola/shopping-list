import React, { useEffect } from 'react';
import AddNewList from './AddNewList';
import { useStateValue, setActiveList, setLists } from '../state';
import { ItemList } from '../types';
import { Dropdown } from 'semantic-ui-react';
import listService from '../services/lists';

const ShoppingLists: React.FC = () => {
    const [{ lists, activeList }, dispatch] = useStateValue();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const listsFromApi = await listService.getListsByUser();
                dispatch(setLists(listsFromApi));
            } catch (e) {
                console.error(e);
            }
        };
        fetchLists();
    }, [dispatch]);

    const setActive = (list: ItemList) => {
        // dispatch(setActiveList(list));
        setActiveList(list, dispatch);
    };

    if (lists.length === 0) {
        return <AddNewList />;
    }

    return (
        <Dropdown item text={activeList ? activeList.name : 'Select list'} style={{ minWidth: "11rem" }}>
            <Dropdown.Menu>
                {lists.map(list => (
                    <Dropdown.Item key={list.id} onClick={() => setActive(list)}>{list.name}</Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <AddNewList />
            </Dropdown.Menu>
        </Dropdown >
    );
};

export default ShoppingLists;