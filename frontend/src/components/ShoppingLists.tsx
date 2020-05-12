import React from 'react'
import AddNewList from './AddNewList'
import { useStateValue, setActiveList } from '../state'
import { ItemList } from '../types'
import { Dropdown } from 'semantic-ui-react'

const ShoppingLists: React.FC = () => {
    const [{ lists, activeList }, dispatch] = useStateValue();

    const setActive = (list: ItemList) => {
        dispatch(setActiveList(list));
    }

    if (lists.length === 0) {
        return <AddNewList />
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
    )
}

export default ShoppingLists