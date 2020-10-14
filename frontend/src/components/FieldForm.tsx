import React, { useState } from "react";
import { Form as UIForm, Input, Icon } from "semantic-ui-react";
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

interface PasswordProps extends FieldProps {
    label: string;
    placeholder: string;
    autoFocus: boolean;
    type: string;
}

export const PasswordField: React.FC<PasswordProps> = ({
    field,
    label,
    placeholder,
    autoFocus
}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <UIForm.Field>
            <label>{label}</label>
            {/* <Field type={type} placeholder={placeholder} {...field} autoFocus={autoFocus} /> */}
            <Input
                autoFocus={autoFocus}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                {...field}
                icon={
                    <Icon name={showPassword ? 'eye slash' : 'eye'} size="large" link onClick={() => setShowPassword(!showPassword)} />}
            />
            {/* <div style={{ color: 'red', minHeight: "1.3571rem" }}></div> */}
            <div style={{ color: 'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </UIForm.Field >);
};

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
