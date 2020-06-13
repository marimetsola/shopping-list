import React from "react";
import { Form as UIForm } from "semantic-ui-react";
import { Field, ErrorMessage, FieldProps } from "formik";

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
            <Field placeholder={placeholder} {...field} autoFocus={true} />
            <div style={{ color: 'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </UIForm.Field>
    );

export const PasswordField: React.FC<TextProps> = ({
    field,
    label,
    placeholder
}) => (
        <UIForm.Field>
            <label>{label}</label>
            <Field type="password" placeholder={placeholder} {...field} autoFocus={false} />
            <div style={{ color: 'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </UIForm.Field>
    );
