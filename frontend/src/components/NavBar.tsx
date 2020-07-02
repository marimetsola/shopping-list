import React from 'react';
import ShoppingLists from './ShoppingLists';
import { Menu, Container, Icon } from 'semantic-ui-react';
import LogInOut from './LogInOut';
import Register from './Register';
import { useStateValue, openProfilePage } from '../state';

const NavBar: React.FC = () => {
    const [{ user }, dispatch] = useStateValue();
    return (
        <Menu borderless inverted size="massive">
            <Container>
                <Menu.Item position='left' header>
                    <Icon name="list alternate outline" size="large" />
                    Shopping List
                </Menu.Item>
                <Menu.Menu position='right'>
                    {user && <ShoppingLists />}
                    {user &&
                        <Menu.Item type="button" onClick={() => dispatch(openProfilePage())} color="grey">
                            <Icon name="user" size="large" />
                            {user.name}
                        </Menu.Item>
                    }
                    <LogInOut />
                    <Register />
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

export default NavBar;