import React from "react";
import { Grid, Button, Form as UIForm } from "semantic-ui-react";
import { Field, Formik, Form, FieldProps, ErrorMessage } from "formik";

interface TextProps extends FieldProps {
    label: string;
    placeholder: string;
}

export const TextField: React.FC<TextProps> = ({
    field,
    label,
    placeholder
}) => (
        <UIForm.Field>
            <label>{label}</label>
            <Field placeholder={placeholder} {...field} />
            <div style={{ color: 'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </UIForm.Field>
    );

interface Props {
    onSubmit: (values: { name: string }) => void;
    onCancel: () => void;
}

export const AddListForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
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
                            label="Name"
                            placeholder="Name"
                            name="name"
                            component={TextField}
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
                                    Add
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default AddListForm;
