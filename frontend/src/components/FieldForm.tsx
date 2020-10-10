import React from "react";
import { Form as UIForm } from "semantic-ui-react";
import { Field, ErrorMessage, FieldProps } from "formik";

interface TextProps extends FieldProps {
    label: string;
    placeholder: string;
    autoFocus: boolean;
}

export const TextField: React.FC<TextProps> = ({
    field,
    label,
    placeholder,
    autoFocus
}) => (
        <UIForm.Field>
            <label>{label}</label>
            <Field placeholder={placeholder} {...field} autoFocus={autoFocus} />
            <div style={{ color: 'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </UIForm.Field>
    );

export const PasswordField: React.FC<TextProps> = ({
    field,
    label,
    placeholder,
    autoFocus
}) => (
        <UIForm.Field>
            <label>{label}</label>
            <Field type="password" placeholder={placeholder} {...field} autoFocus={autoFocus} />
            {/* <div style={{ color: 'red', minHeight: "1.3571rem" }}></div> */}
            <div style={{ color: 'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </UIForm.Field>
    );

interface CheckboxProps extends FieldProps {
    label: string;
    placeholder: string;
    type: string;
    checked: boolean;
    onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ field, type, checked, onChange }) => {
    return (
        <label>
            {/* remove {...field} to see changes not propagated */}
            <input {...field} type={type} checked={checked} onChange={onChange} />
            {field.name}
        </label>
    );
};
