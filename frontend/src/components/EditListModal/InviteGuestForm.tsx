import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, } from "formik";
import { TextField } from '../FieldForm';

interface Props {
    onSubmit: any;
}

export const InviteGuestForm: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Formik
            initialValues={{
                name: "",
            }}
            onSubmit={onSubmit}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Invite a user"
                            placeholder="Name"
                            name="name"
                            component={TextField}
                            autoFocus={true}
                        />
                        <Grid>
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