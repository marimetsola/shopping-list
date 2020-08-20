import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { TextField } from '../FieldForm';

interface Props {
    onSubmit: (values: { name: string }, action: FormikHelpers<{ name: string }>) => void;
    onCancel: () => void;
    label: string;
    placeHolder: string;
    validate: any;
}

export const AddItemForm: React.FC<Props> = ({ onSubmit, onCancel, label, placeHolder, validate }) => {
    return (
        <Formik
            initialValues={{
                name: "",
            }}
            onSubmit={onSubmit}
            validate={validate}
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
