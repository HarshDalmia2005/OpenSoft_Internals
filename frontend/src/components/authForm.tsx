import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthMode, AuthFormData } from "../types/auth";
import { useAuth } from "../context/AuthContext";
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

  const { login, signup, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => {
    clearError();
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === "signup" && authData.password !== authData.confirmPassword) {
      return;
    }

    try {
      if (mode === "login") {
        await login(authData.email, authData.password);
      } else {
        await signup(authData.email, authData.password, authData.name || '');
      }
      navigate("/dashboard");
    } catch {
      // Error is already set in context
    }
  };

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Welcome Back" : "Hello There"}</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {mode === "signup" && <InputField label="Name" name="name" value={authData.name} onChange={handleChange} type="text" />}
        <InputField label="Email" name="email" value={authData.email} onChange={handleChange} type="text" />
        <InputField label="Password" name="password" value={authData.password} onChange={handleChange} type="password" />
        {mode === "signup" && (
          <InputField label="Confirm Password" name="confirmPassword" value={authData.confirmPassword} onChange={handleChange} type="password" />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
        </button>
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
