import React, { useState } from 'react';
import { useStateValue, changeUserEmail } from '../../state';
import { Icon, Table, Button } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import userService from '../../services/users';
import PromptModal from '../PromptModal';
import { User } from '../../types';

interface Props {
    user: User;
}

const Email: React.FC<Props> = ({ user }) => {
    const [, dispatch] = useStateValue();
    const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);

    const changeEmail = async (values: { name: string }, action: FormikHelpers<{ name: string }>) => {
        if (user) {
            try {
                const editedUser = await userService.changeEmail(user.id, values.name);
                changeUserEmail(editedUser, dispatch);

                setEmailModalOpen(false);
            } catch (error) {
                action.setErrors({ name: "Email adress already in use." });
            }
        }
    };

    const validate = (values: { name: string }) => {
        const errors: { [field: string]: string } = {};
        if (values.name && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.name)) {
            errors.name = 'Invalid email address';
        }
        return errors;
    };

    if (!user) {
        return null;
    }

    return (
        <Table.Row>
            <Table.Cell width={2}>Email</Table.Cell>
            <Table.Cell>{user.email ? user.email : ""}</Table.Cell>
            <Table.Cell textAlign='right'>
                <Button color="olive" size="mini" onClick={() => setEmailModalOpen(true)}>
                    <Icon name='edit' />Edit
                </Button>
            </Table.Cell>
            <PromptModal
                open={emailModalOpen}
                onSubmit={changeEmail}
                onClose={() => setEmailModalOpen(false)}
                label="Email adress"
                header="Change email"
                placeHolder="Email"
                validate={validate}
                initialValue={user.email ? user.email : ""}
            />
        </Table.Row>
    );
};

export default Email;