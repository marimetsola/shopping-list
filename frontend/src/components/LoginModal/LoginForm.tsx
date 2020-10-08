import React from "react";
import { Grid, Button, Message } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, PasswordField } from '../FieldForm';
import ButtonLink from '../ButtonLink';
import { setOpenModalType, useStateValue } from '../../state';
import { ModalType } from "../../types";

interface Props {
    onSubmit: (values: { name: string; password: string }) => void;
    onCancel: () => void;
    loginFailed: boolean;
}

export const LoginForm: React.FC<Props> = ({ onSubmit, onCancel, loginFailed }) => {
    const [, dispatch] = useStateValue();
    return (
        <Formik
            initialValues={{
                name: "",
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
                            label="Username or email"
                            placeholder="Username / email"
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
                        {loginFailed &&
                            <Message negative>
                                <p>Invalid username or password.</p>
                            </Message>}
                        <div style={{ marginBottom: "1rem" }}>
                            <ButtonLink
                                onClick={() => dispatch(setOpenModalType(ModalType.RecoveryModal))}>
                                Forgot password?
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
                                    Login
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik >
    );
};

export default LoginForm;
