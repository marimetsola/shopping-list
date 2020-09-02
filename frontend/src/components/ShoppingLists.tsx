import React, { useEffect, Fragment } from 'react';
import AddNewList from './AddNewList';
import { useStateValue, setActiveList, setLists, changeActiveList, closeProfilePage } from '../state';
import { ItemList } from '../types';
import { Dropdown, Icon } from 'semantic-ui-react';
import listService from '../services/lists';

const ShoppingLists: React.FC = () => {
    const [{ lists, activeList, user, profilePageOpen, isDesktop }, dispatch] = useStateValue();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const listsFromApi = await listService.getListsByUser();
                dispatch(setLists(listsFromApi));
                if (user) {
                    setActiveList(user, dispatch);
                }

            } catch (e) {
                console.error(e);
            }
        };
        fetchLists();
    }, [dispatch, user]);



    const setActive = (list: ItemList) => {
        if (user) {
            changeActiveList(list, user, dispatch);
            dispatch(closeProfilePage());
        }
    };

    if (lists.length === 0) {
        return <AddNewList />;
    }

    if (isDesktop) {
        return (
            <Dropdown item text={(activeList && !profilePageOpen) ? activeList.name : 'Select list'} style={{ minWidth: "11rem" }}>
                <Dropdown.Menu>
                    {lists.map(list => (
                        <Dropdown.Item key={list.id} onClick={() => setActive(list)}>{list.name}</Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <AddNewList />
                </Dropdown.Menu>
            </Dropdown >
        );
    } else {
        return (
            <Fragment>
                <Dropdown.Header text={'Lists'} style={{ minWidth: "11rem" }}>Lists</Dropdown.Header>

                {lists.map(list => (
                    <Dropdown.Item key={list.id} onClick={() => setActive(list)}>

                        {activeList && activeList.id === list.id ?
                            <Icon name="selected radio" size="mini" />
                            :
                            <Icon name="circle outline" size="mini" />
                        }

                        {list.name}
                    </Dropdown.Item>
                ))}
                <AddNewList />
                <Dropdown.Divider />
            </Fragment>
        );
    }
};

export default ShoppingLists;