import { useState } from "react";
import type { AuthMode, AuthFormData } from "../types/auth";
import "./authForm.css";
import { InputField } from "./inputField";

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [authData, setAuthData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setAuthData((prev) => ({
        ...prev,
        [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Welcome Back" : "Hello There"}</h2>
      <form>
        {mode === "signup" && <InputField label="Name" name="name" value={authData.name} onChange={handleChange} type="text" />}
        <InputField label="Email" name="email" value={authData.email} onChange={handleChange} type="text"/>
        <InputField label="Password" name="password" value={authData.password} onChange={handleChange} type="password"/>
        {mode === "signup" && (
        <InputField label="Confirm Password" name="confirmPassword" value={authData.confirmPassword} onChange={handleChange} type="password"/>
        )}
        <button type="submit">{mode === "login" ? "login" : "signup"}</button>
      </form>
      <div>
        <span>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <button onClick={toggleMode}>
          {mode === "login" ? "signup" : "login"}
        </button>
      </div>
    </div>
  );
};
