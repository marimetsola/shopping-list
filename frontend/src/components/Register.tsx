import React, { Fragment, useState } from 'react';
import { useStateValue } from '../state';
import { Menu } from 'semantic-ui-react';

import RegisterModal from './RegisterModal';

interface Props {
    onLogin: (values: { name: string; password: string }) => void;
    onCancel: () => void;
}

const Register: React.FC = () => {
    const [{ user }] = useStateValue();
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    return (
        <Fragment>
            {!user ?
                <Menu.Item type="button" onClick={() => setRegisterModalOpen(true)} color="grey">
                    Register
                </Menu.Item>
                :
                null
            }

            <RegisterModal open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} />
        </Fragment>
    );
};

export default Register;