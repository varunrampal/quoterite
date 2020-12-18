import React from "react";
import { FieldProps } from "formik";
import {ILoginForm} from "../components/views/auth/login";

interface ITextFieldProps {
    title: string;
    name: string;
    type: 'text' | 'email' | 'password';
   
  
}

type OwnProps = FieldProps<ILoginForm> & ITextFieldProps;
const AppTextField: React.FC<OwnProps> = ({ title, type, field, form, ...others}) => (
    <label htmlFor={field.name}>
        <div>{title}</div>
        <input type={type} {...others} />
        {
            form.touched[field.name] && form.errors[field.name]
            ? <div>{form.errors[field.name]}</div>
            : null
        }
    </label>
);

export default AppTextField;