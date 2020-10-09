import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { TextField, PasswordField } from '../FieldForm';

interface Props {
    onSubmit: (values: { name: string }, action: FormikHelpers<{ name: string }>) => void;
    onCancel: () => void;
    label: string;
    placeHolder: string;
    validate: any;
    initialValue: string;
    type: string;
}

export const ModalForm: React.FC<Props> = ({ onSubmit, onCancel, label, placeHolder, validate, initialValue, type }) => {
    return (
        <Formik
            initialValues={{
                name: initialValue,
            }}
            onSubmit={onSubmit}
            validate={validate}
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
                            component={type === 'password' ? PasswordField : TextField}
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

export default ModalForm;
