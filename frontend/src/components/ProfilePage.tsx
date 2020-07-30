import React, { useEffect } from 'react';
import { useStateValue, clearActiveList } from '../state';
import { Container } from 'semantic-ui-react';

const ProfilePage: React.FC = () => {
    const [{ user, profilePageOpen, activeList }, dispatch] = useStateValue();

    const contStyle = { padding: "0 4.6rem" };

    useEffect(() => {
        if (profilePageOpen) {
            dispatch(clearActiveList());
            console.log(activeList);
        }
    }, []);

    if (!user) {
        return null;
    }

    return (
        <Container style={contStyle}>
            <p>Profile page of {user.name}</p>
        </Container >
    );
};

export default ProfilePage;
