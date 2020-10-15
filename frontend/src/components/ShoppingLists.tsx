import React, { useEffect, Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AddNewList from './AddNewList';
import { useStateValue, setActiveList, setLists, changeActiveList } from '../state';
import { ItemList } from '../types';
import { Dropdown, Icon } from 'semantic-ui-react';
import listService from '../services/lists';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

const ShoppingLists: React.FC = () => {
    const [{ lists, activeList, user, isDesktop }, dispatch] = useStateValue();
    const history = useHistory();
    const location = useLocation();
    const { promiseInProgress } = usePromiseTracker();

    useEffect(() => {
        const fetchLists = async () => {
            // const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));
            // await waitFor(2000);
            try {
                const listsFromApi = await listService.getListsByUser();
                dispatch(setLists(listsFromApi));
                if (user) {
                    trackPromise(setActiveList(user, dispatch));
                }

            } catch (e) {
                console.error(e);
            }
        };
        trackPromise(fetchLists());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);



    const setActive = (list: ItemList) => {
        if (user) {
            trackPromise(changeActiveList(list, user, dispatch));
            history.push('/list');
        }
    };

    const showActiveList = () => {
        if (location.pathname === '/profile' || !activeList) {
            return false;
        }
        return true;
    };

    if (promiseInProgress) {
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