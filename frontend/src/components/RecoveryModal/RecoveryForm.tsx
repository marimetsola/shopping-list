import React from "react";
import { Grid, Button, Message } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField } from '../FieldForm';
import ButtonLink from '../ButtonLink';

interface Props {
    onSubmit: (values: { email: string }) => void;
    onCancel: () => void;
    onOpenLoginModal: () => void;
    emailFound: boolean;
    emailNotFound: boolean;
    resetMessage: () => void;
}

export const RecoveryForm: React.FC<Props> = ({ onSubmit, onCancel, onOpenLoginModal, emailFound, emailNotFound, resetMessage }) => {
    return (
        <Formik
            initialValues={{
                email: "",
            }}
            onSubmit={onSubmit}
            validateOnChange={true}
            validateOnBlur={false}
            validate={values => {
                const errors: { [field: string]: string } = {};
                if (!values.email) {
                    errors.email = "Field is required";
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = "Invalid email address";
                }
                resetMessage();
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
                        {emailFound &&
                            <Message info>
                                <p style={{ textAlign: "center" }}>Password reset email successfully sent.</p>
                                <div className="center-container">
                                    <ButtonLink
                                        onClick={onOpenLoginModal}>
                                        Click here to login.
                                    </ButtonLink>
                                </div>
                            </Message>}
                        {emailNotFound &&
                            <Message negative>
                                <p>Email is not in use.</p>
                                {/* <div className="center-container">
                                    <ButtonLink
                                        onClick={onOpenLogin}>
                                        Click here to login.
                                    </ButtonLink>
                                </div> */}
                            </Message>}
                        <div style={{ marginBottom: "1rem" }}>
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
                                    Send
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik >
    );
};

export default RecoveryForm;
