import React from 'react';
import ShoppingLists from './ShoppingLists';
import { Menu, Container, Icon } from 'semantic-ui-react';
import LogInOut from './LogInOut';

const NavBar: React.FC = () => {
    return (
        <Menu borderless inverted size="massive">
            <Container>
                <Menu.Item header>
                    <Icon name="list alternate outline" size="large" />
                    Shopping List
                </Menu.Item>
                <Menu.Menu position='right'>
                    <ShoppingLists />
                    <LogInOut />
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

export default NavBar;