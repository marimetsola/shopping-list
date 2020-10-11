import React, { useEffect, Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AddNewList from './AddNewList';
import { useStateValue, setActiveList, setLists, changeActiveList } from '../state';
import { ItemList } from '../types';
import { Dropdown, Icon } from 'semantic-ui-react';
import listService from '../services/lists';

const ShoppingLists: React.FC = () => {
    const [{ lists, activeList, user, isDesktop, isLoadingList }, dispatch] = useStateValue();
    const history = useHistory();
    const location = useLocation();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);



    const setActive = (list: ItemList) => {
        if (user) {
            changeActiveList(list, user, dispatch);
            history.push('/list');
        }
    };

    const showActiveList = () => {
        if (location.pathname === '/profile' || !activeList) {
            return false;
        }
        return true;
    };

    if (isLoadingList) {
        return (
            <Dropdown item text={(showActiveList()) ? activeList?.name : 'Select list'} style={{ minWidth: "11rem" }}></Dropdown >
        );
    }

    if (lists.length === 0) {
        return <AddNewList />;
    }

    if (isDesktop) {
        return (
            <Dropdown item text={(showActiveList()) ? activeList?.name : 'Select list'} style={{ minWidth: "11rem" }}>
                <Dropdown.Menu>
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