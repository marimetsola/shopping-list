import React, { useState } from 'react';
import { useStateValue } from '../../state';
import { Icon, Table, Button } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import userService from '../../services/users';
import PasswordChangeModal from '../PasswordChangeModal';
import { User } from '../../types';

interface Props {
    user: User;
}


const Password: React.FC<Props> = ({ user }) => {
    const [{ isDesktop }, dispatch] = useStateValue();
    const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

    const changePassword = async (values: { oldPassword: string; newPassword0: string; newPassword1: string },
        action: FormikHelpers<{ oldPassword: string; newPassword0: string; newPassword1: string }>) => {
        if (values.newPassword0 !== values.newPassword1) {
            return action.setErrors({ newPassword1: "Passwords must match!" });
        }
        if (user) {
            try {
                await userService.changePassword(user.id, values.oldPassword, values.newPassword0);
                // const editedUser = await userService.changePassword(user.id, values.name);
                // changeUserName(editedUser, dispatch);

                setPasswordModalOpen(false);
            } catch (error) {
                action.setErrors({ newPassword1: "Password is too short. Please use at least 5 characters." });
            }
        }
    };

    const validatePassword = (values: { newPassword0: string; newPassword1: string }) => {
        const errors: { [field: string]: string } = {};
        if (values.newPassword0.length < 5 && values.newPassword1.length < 5) {
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
                <PasswordChangeModal open={passwordModalOpen}
                    onSubmit={changePassword}
                    onClose={() => setPasswordModalOpen(false)}
                    header="Change password"
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
                <PasswordChangeModal open={passwordModalOpen}
                    onSubmit={changePassword}
                    onClose={() => setPasswordModalOpen(false)}
                    header="Change password"
                    validate={validatePassword}
                    initialValue={""}
                />
            </Table.Row >
        );
    }
};

export default Password;