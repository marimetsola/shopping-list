import React from 'react';
import { useHistory } from 'react-router-dom';
import ShoppingLists from './ShoppingLists';
import { Menu, Container, Icon, Dropdown } from 'semantic-ui-react';
import LogInOut from './LogInOut';
import Register from './Register';
import { useStateValue } from '../state';

const NavBar: React.FC = () => {
    const [{ user, isDesktop }] = useStateValue();
    const history = useHistory();

    const getNameCapitalized = () => {
        if (!user) {
            return null;
        }

        const firstChar = user.name.charAt(0);

        // eslint-disable-next-line
        if (firstChar.toLowerCase() != firstChar.toUpperCase()) {
            return user.name.charAt(0).toUpperCase() + user.name.slice(1);
        } else {
            return user.name;
        }
    };

    if (isDesktop) {
        return (
            <Menu borderless inverted size="massive" style={{ minHeight: "4.315rem" }}>
                <Container>
                    <Menu.Item position='left' header>
                        {/* <Icon color="black" name="list alternate outline" size="large" /> */}
                    Kauppalappu
                </Menu.Item>
                    <Menu.Menu position='right'>
                        {user && <ShoppingLists />}
                        {user &&
                            <Menu.Item type="button" onClick={() => history.push('/profile')} color="grey">
                                <Icon name="user" size="large" />
                                {user.listInvitations && user.listInvitations.length > 0 &&
                                    <div className="ui floating circular red label" style={{ top: "0.3rem", left: "4.4rem" }}>{user.listInvitations.length}</div>}
                                {getNameCapitalized()}
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
            <Menu borderless inverted size="huge" style={{ minHeight: "4.077rem" }}>
                <Container>
                    <Menu.Item header className="mobile-logo" >
                        {/* <Icon name="list alternate outline" size="large" /> */}
                        Kauppalappu
                    </Menu.Item>
                    <Dropdown item text="Menu" className="mobile-menu">
                        <Dropdown.Menu>
                            {user && <ShoppingLists />}
                            {user &&
                                <Dropdown.Item type="button" onClick={() => history.push('/profile')} color="grey">
                                    <Icon name="user" size="large" />
                                    {getNameCapitalized()}
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