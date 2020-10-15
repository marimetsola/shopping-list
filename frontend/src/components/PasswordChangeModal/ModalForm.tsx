import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { PasswordField } from '../FieldForm';

interface Props {
    onSubmit: (values: { oldPassword: string; newPassword: string },
        action: FormikHelpers<{ oldPassword: string; newPassword: string }>) => void;
    onCancel: () => void;
    showPassword: boolean;
    toggleShowPassword: () => void;
    validate: any;
}

export const ModalForm: React.FC<Props> = ({ onSubmit, onCancel, showPassword, toggleShowPassword, validate }) => {
    return (
        <Formik
            initialValues={{
                oldPassword: "",
                newPassword: "",
            }}
            onSubmit={onSubmit}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Current password"
                            placeholder="Password"
                            name="oldPassword"
                            component={PasswordField}
                            autoFocus={true}

                        />
                        <Field
                            label="New password"
                            placeholder="Password"
                            name="newPassword"
                            component={PasswordField}
                            autoFocus={false}
                            validate={validate}
                        />

                        {/* <Field
                            name="Show password"
                            type="checkbox"
                            checked={showPassword}
                            component={Checkbox}
                            onChange={toggleShowPassword}
                        /> */}
                        <Grid style={{ paddingTop: "1rem" }}>
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
