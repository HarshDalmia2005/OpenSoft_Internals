import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="app-shell">
            <div className="dashboard-container">
                <h1>Welcome, {user?.username}!</h1>
                <p>{user?.email}</p>
                <div className="dashboard-actions">
                    <Link to="/canvas" className="btn-primary">
                        🎨 New Canvas
                    </Link>
                    <button onClick={logout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
