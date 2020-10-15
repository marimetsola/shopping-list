import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, PasswordField } from '../FieldForm';

interface Props {
    onSubmit: (values: { email: string; password: string }) => void;
}

export const ResetForm: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            onSubmit={onSubmit}
            validateOnChange={true}
            validateOnBlur={false}
            validate={values => {
                const errors: { [field: string]: string } = {};
                if (!values.password) {
                    errors.password = "Field is required.";
                } else if (values.password.length < 5) {
                    errors.password = "Password is too short. Please use at least 5 characters.";
                }
                return errors;
            }}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Email"
                            placeholder="Email"
                            name="email"
                            component={TextField}
                            autoFocus={true}
                        />
                        <Field
                            label="Password"
                            placeholder="Password"
                            name="password"
                            component={PasswordField}
                            autoFocus={false}
                        />
                        <div style={{ marginBottom: "1rem" }}>
                        </div>

                        <Grid>
                            <Grid.Column floated="left" width={5}>
                                {/* <Button type="button" onClick={onCancel} color="red">
                                    Cancel
                                </Button> */}
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button
                                    type="submit"
                                    floated="right"
                                    color="green"
                                    disabled={!dirty || !isValid}
                                >
                                    Save
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik >
    );
};

export default ResetForm;
