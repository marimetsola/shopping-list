import React, { Fragment, useState } from 'react';
import { useStateValue, setOpenModalType } from '../state';
import { Menu } from 'semantic-ui-react';

import RegisterModal from './RegisterModal';
import { ModalType } from '../types';

const Register: React.FC = () => {
    const [{ user, modalType }, dispatch] = useStateValue();
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    return (
        <Fragment>
            {!user ?
                <Menu.Item type="button" onClick={() => dispatch(setOpenModalType(ModalType.RegisterModal))} color="grey">
                    Register
                </Menu.Item>
                :
                null
            }
        </Fragment>
    );
};

export default Register;