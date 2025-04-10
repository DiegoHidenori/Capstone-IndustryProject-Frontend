import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) return null; // ⏳ Wait until auth state is restored

    return (
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
            <Link to="/">Home</Link>
            {user ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    {["admin", "staff"].includes(user.role) && (
                        <Link to="/bookings">Bookings</Link>
                    )}
                    {["admin", "staff"].includes(user.role) && (
                        <Link to="/rooms">Rooms</Link>
                    )}
                    <Link to="/create-booking">New Booking</Link>
                    {["admin", "staff"].includes(user.role) && (
                        <Link to="/meals">Meals</Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}
