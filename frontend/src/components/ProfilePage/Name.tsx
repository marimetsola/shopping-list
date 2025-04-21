import React, { useState, useEffect } from 'react';
import { useStateValue, changeUserName } from '../../state';
import { Icon, Table, Button } from 'semantic-ui-react';
import { FormikHelpers } from "formik";
import userService from '../../services/users';
import PromptModal from '../PromptModal';
import { User } from '../../types';
import DataChanged from './DataChanged';

interface Props {
    user: User;
}

const Name: React.FC<Props> = ({ user }) => {
    const [{ isDesktop }, dispatch] = useStateValue();
    const [nameModalOpen, setNameModalOpen] = useState<boolean>(false);
    const [nameChanged, setNameChanged] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        let nameChangedTimer: ReturnType<typeof setTimeout>;
        if (nameChanged) {
            setShowSuccess(true);
            nameChangedTimer = setTimeout(() => {
                setShowSuccess(false);
                setNameChanged(false);
            }, 7500);
        }
        return () => clearTimeout(nameChangedTimer);
    }, [nameChanged]);

    const changeName = async (values: { name: string; password: string }, action: FormikHelpers<{ name: string; password: string }>) => {
        if (user) {
            try {
                const editedUser = await userService.changeName(user.id, values.name, values.password);
                changeUserName(editedUser, dispatch);

                setNameModalOpen(false);
                setNameChanged(true);
            } catch (error) {
                if ((error as any).response.status === 400) {
                    action.setErrors({ name: "Username already taken." });
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
                <Table.Cell width={2}>Username</Table.Cell>
                <Table.Cell>
                    {user.name}
                    {showSuccess &&
                        <DataChanged />
                    }
                </Table.Cell>
                <Table.Cell textAlign='right'>
                    <Button color="olive" size="mini" onClick={() => setNameModalOpen(true)}>
                        <Icon name='edit' />Edit
                </Button>
                </Table.Cell>
                <PromptModal open={nameModalOpen}
                    onSubmit={changeName}
                    onClose={() => setNameModalOpen(false)}
                    label="Enter new name"
                    header="Change username"
                    placeHolder="Name"
                    type="text"
                    initialValue={user.name}
                />
            </Table.Row>
        );
    } else {
        return (
            <Table.Row style={{ paddingTop: 0 }}>
                <Table.Cell>Username
                    {showSuccess &&
                        <DataChanged />
                    }
                </Table.Cell>
                <Table.Cell style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", textAlign: "justify", textJustify: "inter-word", marginTop: "1rem" }}>
                        <p style={{ lineHeight: "2rem", marginBottom: 0 }}> {user.name}</p>
                        <Button style={{ justifySelf: "end" }} color="olive" size="mini" onClick={() => setNameModalOpen(true)}>
                            <Icon name='edit' />Edit
                    </Button>
                    </div>
                </Table.Cell>
                <PromptModal open={nameModalOpen}
                    onSubmit={changeName}
                    onClose={() => setNameModalOpen(false)}
                    label="Enter new name"
                    header="Change username"
                    placeHolder="Name"
                    type="text"
                    initialValue={user.name}
                />
            </Table.Row >
        );
    }
};

export default Name;