import type { InputHTMLAttributes } from "react";
import './authForm.css';


interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
 label: string;
}

export const InputField = ({ label, ...props }: InputFieldProps) => {
    return(
        <div className="inputContainer">
            <label>
                {label}
            </label>
            <input {...props}/>
        </div>
    );
};