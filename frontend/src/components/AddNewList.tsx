import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { useStateValue, openListModal } from '../state';

const AddNewList: React.FC = () => {
    const [, dispatch] = useStateValue();
    return (
        <Menu.Item name='newList' as='a' onClick={() => dispatch(openListModal())}>
            <Icon name='add' size='tiny' />
        Add List
        </Menu.Item>
    );
};

export default AddNewList;