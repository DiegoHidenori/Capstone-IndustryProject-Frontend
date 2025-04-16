import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) return null;

    return (
        <nav className="navbar">
            <div className="nav-left">
                <div className="navbar-logo">
                    <a
                        href="https://sites.google.com/view/qoaca/home"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Retreat Center
                    </a>
                </div>

                <Link to="/">Home</Link>
                {user && <Link to="/dashboard">Dashboard</Link>}
            </div>

            <div className="nav-right">
                <div className="navbar-links">
                    {user ? (
                        <button
                            className="btn logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
