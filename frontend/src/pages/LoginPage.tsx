import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/authForm';

export const LoginPage = () => {
    const { user } = useAuth();

    // If already authenticated, redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="app-shell">
            <AuthForm />
        </div>
    );
};
