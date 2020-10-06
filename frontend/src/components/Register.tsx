import React, { Fragment } from 'react';
import { useStateValue, setOpenModalType } from '../state';
import { Menu } from 'semantic-ui-react';
import { ModalType } from '../types';

const Register: React.FC = () => {
    const [{ user }, dispatch] = useStateValue();

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