import React, { useState, Fragment, useEffect } from 'react';
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
    const [{ isDesktop }, dispatch] = useStateValue();
    const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
    const [emailChanged, setEmailChanged] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        let nameChangedTimer: ReturnType<typeof setTimeout>;
        if (emailChanged) {
            setShowSuccess(true);
            nameChangedTimer = setTimeout(() => {
                setShowSuccess(false);
                setEmailChanged(false);
            }, 5000);
        }
        return () => clearTimeout(nameChangedTimer);
    }, [emailChanged]);

    const changeEmail = async (values: { name: string; password: string }, action: FormikHelpers<{ name: string; password: string }>) => {
        if (user) {
            try {
                const editedUser = await userService.changeEmail(user.id, values.name, values.password);
                changeUserEmail(editedUser, dispatch);

                setEmailModalOpen(false);
                setEmailChanged(true);
            } catch (error) {
                if (error.response.status === 400) {
                    action.setErrors({ name: error.response.data });
                } else {
                    action.setErrors({ password: "Invalid password." });
                }
            }
        }
    };

    if (!user) {
        return null;
    }

    if (isDesktop) {
        return (
            <Table.Row>
                <Table.Cell width={2}>Email</Table.Cell>
                <Table.Cell>{user.email ? user.email : ""}
                    {showSuccess &&
                        <Fragment>
                            <Icon style={{ marginLeft: "1rem" }} name="check" color="green" />
                            <span style={{ color: "#21ba45" }}>Email changed!</span>
                        </Fragment>
                    }
                </Table.Cell>
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
                    type="email"
                    header="Change email"
                    placeHolder="Email"
                    initialValue={user.email ? user.email : ""}
                />
            </Table.Row>
        );
    } else {
        return (
            <Table.Row style={{ paddingTop: 0 }}>
                <Table.Cell width={1}>Email</Table.Cell>
                <Table.Cell style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", textAlign: "justify", textJustify: "inter-word", marginTop: "1rem" }}>
                        <p style={{ lineHeight: "2rem", marginBottom: 0 }}>{user.email ? user.email : ""}</p>

                        <Button style={{ justifySelf: "end" }} color="olive" size="mini" onClick={() => setEmailModalOpen(true)}>
                            <Icon name='edit' />Edit
                    </Button>
                    </div>
                </Table.Cell>

                <PromptModal
                    open={emailModalOpen}
                    onSubmit={changeEmail}
                    onClose={() => setEmailModalOpen(false)}
                    label="Email address"
                    type="email"
                    header="Change email"
                    placeHolder="Email"
                    initialValue={user.email ? user.email : ""}
                />
            </Table.Row>
        );
    }
};

export default Email;