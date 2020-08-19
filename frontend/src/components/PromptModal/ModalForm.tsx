import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, } from "formik";
import { TextField } from '../FieldForm';

interface Props {
    onSubmit: (values: { name: string }, action: any) => void;
    onCancel: () => void;
    label: string;
    placeHolder: string;
}

export const AddItemForm: React.FC<Props> = ({ onSubmit, onCancel, label, placeHolder }) => {
    return (
        <Formik
            initialValues={{
                name: "",
            }}
            onSubmit={onSubmit}
        // validate={values => {
        //     const requiredError = "Field is required";
        //     const errors: { [field: string]: string } = {};
        //     if (!values.name) {
        //         errors.name = requiredError;
        //     }
        //     return errors;
        // }}
        >
            {({ isValid, dirty }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label={label}
                            placeholder={placeHolder}
                            name="name"
                            component={TextField}
                            autoFocus={true}
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

export default AddItemForm;
