import React from 'react';
import ShoppingLists from './ShoppingLists';
import { Menu, Container, Icon } from 'semantic-ui-react';
import LogInOut from './LogInOut';
import { useStateValue } from '../state';

const NavBar: React.FC = () => {
    const [{ user }] = useStateValue();
    return (
        <Menu borderless inverted size="massive">
            <Container>
                <Menu.Item position='left' header>
                    <Icon name="list alternate outline" size="large" />
                    Shopping List
                </Menu.Item>
                {user ? <Menu.Item>
                    Welcome, {user.name} !
                </Menu.Item> : null}
                <Menu.Menu position='right'>
                    {user ? <ShoppingLists /> : null}
                    <LogInOut />
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

export default NavBar;