import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { TextField, PasswordField } from '../FieldForm';

interface Props {
    onSubmit: (values: { oldPassword: string; newPassword0: string; newPassword1: string },
        action: FormikHelpers<{ oldPassword: string; newPassword0: string; newPassword1: string }>) => void;
    onCancel: () => void;
    validate: any;
}

export const ModalForm: React.FC<Props> = ({ onSubmit, onCancel, validate }) => {
    return (
        <Formik
            initialValues={{
                oldPassword: "",
                newPassword0: "",
                newPassword1: ""
            }}
            onSubmit={onSubmit}
            validate={validate}
            validateOnChange={true}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Current password"
                            placeholder="Current password"
                            name="oldPassword"
                            component={PasswordField}
                            autoFocus={true}
                        />
                        <Field
                            label="New password"
                            placeholder="Password"
                            name="newPassword0"
                            component={PasswordField}
                            autoFocus={false}
                        />
                        <Field
                            label="New password again"
                            placeholder="Password"
                            name="newPassword1"
                            component={PasswordField}
                            autoFocus={false}
                        />
                        <Grid>
                            <Grid.Column floated="left" width={5}>
                                <Button type="button" onClick={onCancel} color="red">
                                    Cancel
                                </Button>
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button
                                    type="submit"
                                    floated="right"
                                    color="green"
                                    disabled={!dirty || !isValid}
                                >
                                    Ok
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default ModalForm;
