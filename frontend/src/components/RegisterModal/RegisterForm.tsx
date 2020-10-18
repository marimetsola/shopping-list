import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { TextField, PasswordField } from '../FieldForm';
import ButtonLink from '../ButtonLink';
import { setOpenModalType, useStateValue } from '../../state';
import { ModalType } from "../../types";

interface Props {
    onSubmit: (values: { name: string; email: string; password: string }, action: FormikHelpers<{ name: string; email: string; password: string }>) => void;
    onCancel: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
    const [, dispatch] = useStateValue();
    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: ""
            }}
            onSubmit={onSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            validate={values => {
                const errors: { [field: string]: string } = {};
                if (!values.name) {
                    errors.name = "Field is required";
                }
                if (values.name.length < 3) {
                    errors.name = "Name is too short. Please use at least 3 characters.";
                }
                if (!values.password) {
                    errors.password = "Field is required";
                }
                if (values.password.length < 5) {
                    errors.password = "Password is too short. Please use at least 5 characters";
                }
                if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
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
                        {/* {registerFailed &&
                            <Message negative>
                                <p>{registerFailed}</p>
                            </Message>} */}
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
