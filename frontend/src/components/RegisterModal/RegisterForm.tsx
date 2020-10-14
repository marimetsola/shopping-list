import React from "react";
import { Grid, Button, Message } from "semantic-ui-react";
import { Field, Formik, Form, } from "formik";
import { TextField, PasswordField } from '../FieldForm';
import ButtonLink from '../ButtonLink';
import { setOpenModalType, useStateValue } from '../../state';
import { ModalType } from "../../types";

interface Props {
    onSubmit: (values: { name: string; email: string; password: string }) => void;
    onCancel: () => void;
    registerFailed: string;
}

export const RegisterForm: React.FC<Props> = ({ onSubmit, onCancel, registerFailed }) => {
    const [, dispatch] = useStateValue();
    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: ""
            }}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
            validate={values => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string } = {};
                if (!values.name) {
                    errors.name = requiredError;
                }
                if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
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
                            autoFocus={true}
                        />
                        <Field
                            label="Password"
                            placeholder="Password"
                            name="password"
                            component={PasswordField}
                        />
                        <Field
                            label="Email"
                            placeholder="Optional email address. Can be added later in account settings"
                            name="email"
                            component={TextField}
                        />
                        {registerFailed &&
                            <Message negative>
                                <p>{registerFailed}</p>
                            </Message>}
                        <div style={{ marginBottom: "1rem" }}>
                            <ButtonLink
                                onClick={() => dispatch(setOpenModalType(ModalType.LoginModal))}>
                                Already have an account? Click here to login.
                            </ButtonLink>
                        </div>
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
