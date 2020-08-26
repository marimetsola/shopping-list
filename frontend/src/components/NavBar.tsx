import React from 'react';
import ShoppingLists from './ShoppingLists';
import { Menu, Container, Icon, Dropdown } from 'semantic-ui-react';
import LogInOut from './LogInOut';
import Register from './Register';
import { useStateValue, openProfilePage } from '../state';

const NavBar: React.FC = () => {
    const [{ user, isDesktop }, dispatch] = useStateValue();

    if (isDesktop) {
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
    } else {
        return (
            <Menu borderless inverted size="huge" >
                <Container>
                    <Menu.Item header className="mobile-logo">
                        <Icon name="list alternate outline" size="large" />
                        Shopping List
                    </Menu.Item>
                    <Dropdown item text="Menu" className="mobile-menu">
                        <Dropdown.Menu>
                            {user && <ShoppingLists />}
                            {user &&
                                <Dropdown.Item type="button" onClick={() => dispatch(openProfilePage())} color="grey">
                                    <Icon name="user" size="large" />
                                    {user.name}
                                </Dropdown.Item>
                            }
                            <LogInOut />
                            <Register />
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Menu >
        );
    }
};

export default NavBar;