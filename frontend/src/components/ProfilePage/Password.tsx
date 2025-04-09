import React, { useState, useEffect } from 'react';
import { useStateValue } from '../../state';
import { Icon, Table, Button } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import userService from '../../services/users';
import PasswordChangeModal from '../PasswordChangeModal';
import { User } from '../../types';
import DataChanged from './DataChanged';

interface Props {
    user: User;
}


const Password: React.FC<Props> = ({ user }) => {
    const [{ isDesktop }] = useStateValue();
    const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        let nameChangedTimer: ReturnType<typeof setTimeout>;
        if (passwordChanged) {
            setShowSuccess(true);
            nameChangedTimer = setTimeout(() => {
                setShowSuccess(false);
                setPasswordChanged(false);
            }, 7500);
        }
        return () => clearTimeout(nameChangedTimer);
    }, [passwordChanged]);

    const changePassword = async (values: { oldPassword: string; newPassword: string },
        action: FormikHelpers<{ oldPassword: string; newPassword: string }>) => {

        if (user) {
            try {
                await userService.changePassword(user.id, values.oldPassword, values.newPassword);

                setPasswordModalOpen(false);
                setPasswordChanged(true);
            } catch (error) {
                if ((error as any).response.status === 401) {
                    action.setErrors({ oldPassword: "Invalid password." });
                } else {
                    action.setErrors({ newPassword: "Password is too short. Please use at least 5 characters." });
                }

            }
        }
    };

    const validatePassword = (password: string) => {
        if (password.length < 5) {
            return "Password is too short. Please use at least 5 characters.";
        }
    };

    if (!user) {
        return null;
    }

    if (isDesktop) {
        return (
            <Table.Row>
                <Table.Cell width={2}>Password</Table.Cell>
                <Table.Cell>{"********"}
                    {showSuccess &&
                        <DataChanged />
                    }
                </Table.Cell>
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
                <Table.Cell>Password
                    {showSuccess &&
                        <DataChanged />
                    }
                </Table.Cell>
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