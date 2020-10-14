import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { TextField, PasswordField } from '../FieldForm';

interface Props {
    onSubmit: (values: { name: string; password: string }, action: FormikHelpers<{ name: string; password: string }>) => void;
    onCancel: () => void;
    label: string;
    placeHolder: string;
    initialValue: string;
    type: string;
}

export const ModalForm: React.FC<Props> = ({ onSubmit, onCancel, label, placeHolder, initialValue, type }) => {
    return (
        <Formik
            initialValues={{
                name: initialValue,
                password: ""
            }}
            onSubmit={onSubmit}
            validate={values => {
                const errors: { [field: string]: string } = {};
                if (!values.name) {
                    errors.name = "Field is required";
                }

                if (values.name === initialValue) {
                    if (type === 'text') {
                        errors.name = "Choose a new name.";
                    } else if (type === 'email') {
                        errors.name = "Choose another email address.";
                    }
                }

                if (!values.password) {
                    errors.password = "Field is required.";
                }

                if (type === 'email' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.name)) {
                    errors.name = "Invalid email address.";
                }
                // resetMessage();
                return errors;

            }}
            validateOnChange={true}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label={label}
                            placeholder={placeHolder}
                            name="name"
                            type={type}
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
