import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, } from "formik";
import { TextField, PasswordField } from '../FieldForm';

interface Props {
    onSubmit: (values: { name: string; password: string }) => void;
    onCancel: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
    return (
        <Formik
            initialValues={{
                name: "",
                password: ""
            }}
            onSubmit={onSubmit}
            validate={values => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string } = {};
                if (!values.name) {
                    errors.name = requiredError;
                }
                if (!values.password) {
                    errors.password = requiredError;
                }
                return errors;
            }}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Username"
                            placeholder="Username"
                            name="name"
                            component={TextField}
                            autoFocus="true"
                        />
                        <Field
                            label="Password"
                            placeholder="Password"
                            name="password"
                            component={PasswordField}
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
                                    Confirm
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default RegisterForm;
