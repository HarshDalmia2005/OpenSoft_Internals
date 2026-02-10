import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="app-shell">
            <div className="dashboard-container">
                <h1>Welcome, {user?.username}!</h1>
                <p>Email: {user?.email}</p>
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};
