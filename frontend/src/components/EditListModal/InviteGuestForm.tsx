import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, } from "formik";
import { TextField } from '../FieldForm';

interface Props {
    onSubmit: (values: { name: string }) => void;
}

export const InviteGuestForm: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Formik
            initialValues={{
                name: "",
            }}
            onSubmit={onSubmit}
            validate={values => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string } = {};
                if (!values.name) {
                    errors.name = requiredError;
                }
                return errors;
            }}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Invite user to the list"
                            placeholder="Name"
                            name="name"
                            component={TextField}
                        />
                        <Grid>
                            {/* <Grid.Column floated="left" width={5}>
                                <Button type="button" onClick={onCancel} color="red">
                                    Cancel
                                </Button>
                            </Grid.Column> */}
                            <Grid.Column floated="left" width={5}>
                                <Button
                                    type="submit"
                                    floated="left"
                                    color="green"
                                    disabled={!dirty || !isValid}
                                >
                                    Invite
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default InviteGuestForm;