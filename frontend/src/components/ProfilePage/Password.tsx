import React, { useState } from 'react';
import { useStateValue, changeUserName } from '../../state';
import { Icon, Table, Button } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import userService from '../../services/users';
import PromptModal from '../PromptModal';
import { User } from '../../types';

interface Props {
    user: User;
}


const Password: React.FC<Props> = ({ user }) => {
    const [{ isDesktop }, dispatch] = useStateValue();
    const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

    const changePassword = async (values: { name: string }, action: FormikHelpers<{ name: string }>) => {
        if (user) {
            try {
                await userService.changePassword(user.id, values.name);
                // const editedUser = await userService.changePassword(user.id, values.name);
                // changeUserName(editedUser, dispatch);

                setPasswordModalOpen(false);
            } catch (error) {
                action.setErrors({ name: "Password is too short. Please use at least 5 characters." });
            }
        }
    };

    const validatePassword = (values: { name: string }, action: FormikHelpers<{ name: string }>) => {
        const errors: { [field: string]: string } = {};
        if (values.name.length < 5) {
            errors.name = "Password is too short. Please use at least 5 characters.";
        }
        console.log(errors);
        return errors;
    };

    if (!user) {
        return null;
    }

    if (isDesktop) {
        return (
            <Table.Row>
                <Table.Cell width={2}>Password</Table.Cell>
                <Table.Cell>{"********"}</Table.Cell>
                <Table.Cell textAlign='right'>
                    <Button color="olive" size="mini" onClick={() => setPasswordModalOpen(true)}>
                        <Icon name='edit' />Edit
                </Button>
                </Table.Cell>
                <PromptModal open={passwordModalOpen}
                    onSubmit={changePassword}
                    onClose={() => setPasswordModalOpen(false)}
                    label="Enter new password"
                    header="Change password"
                    placeHolder="Password"
                    type="password"
                    validate={validatePassword}
                    initialValue={""}
                />
            </Table.Row>
        );
    } else {
        return (
            <Table.Row style={{ paddingTop: 0 }}>
                <Table.Cell>Password</Table.Cell>
                <Table.Cell style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", textAlign: "justify", textJustify: "inter-word", marginTop: "1rem" }}>
                        <p style={{ lineHeight: "2rem", marginBottom: 0 }}> {"********"}</p>
                        <Button style={{ justifySelf: "end" }} color="olive" size="mini" onClick={() => setPasswordModalOpen(true)}>
                            <Icon name='edit' />Edit
                    </Button>
                    </div>
                </Table.Cell>
                <PromptModal open={passwordModalOpen}
                    onSubmit={changePassword}
                    onClose={() => setPasswordModalOpen(false)}
                    label="Enter new password"
                    header="Change password"
                    placeHolder="Password"
                    type="password"
                    validate={undefined}
                    initialValue={""}
                />
            </Table.Row >
        );
    }
};

export default Password;