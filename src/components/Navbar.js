import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css"; // ✅ Add this line

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) return null;

    return (
        <nav>
            <div className="nav-left">
                <Link to="/">Home</Link>
                {user && <Link to="/dashboard">Dashboard</Link>}
            </div>

            <div className="nav-right">
                {user ? (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
