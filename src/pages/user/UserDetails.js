import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { jwtDecode } from "jwt-decode";

export default function UserDetails() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [promotionRole, setPromotionRole] = useState("");
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState({});

    const fetchUser = async () => {
        try {
            const res = await api.get(`/api/users/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Failed to fetch user.");
        }
    };

    const fetchLoggedInUser = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
    };

    useEffect(() => {
        fetchUser();
        fetchLoggedInUser();
    }, [userId]);

    const handlePromotion = async () => {
        try {
            await api.patch(`/api/users/${userId}/promote`, {
                role: promotionRole,
            });
            setMessage(`User promoted to ${promotionRole}`);
            fetchUser(); // Refresh user data
        } catch (err) {
            console.error("Promotion failed:", err);
            setMessage(
                err?.response?.data?.message ||
                    "Promotion failed. Please try again."
            );
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>Loading...</p>;

    const canPromote =
        currentUser.role === "admin" || currentUser.role === "staff";

    const promotionOptions =
        currentUser.role === "admin"
            ? ["guest", "staff", "admin"]
            : ["guest", "staff"]; // staff cannot promote to admin

    return (
        <div style={{ padding: "2rem" }}>
            <h2>User Details</h2>

            <p>
                <strong>ID:</strong> {user.userId}
            </p>
            <p>
                <strong>Name:</strong> {user.firstName} {user.middleName || ""}{" "}
                {user.lastName}
            </p>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>Phone:</strong> {user.phone || "N/A"}
            </p>
            <p>
                <strong>Billing Address:</strong> {user.billingAddress || "N/A"}
            </p>
            <p>
                <strong>Role:</strong> {user.role}
            </p>

            {canPromote && (
                <div style={{ marginTop: "1.5rem" }}>
                    <h3>Promote User</h3>
                    <select
                        value={promotionRole}
                        onChange={(e) => setPromotionRole(e.target.value)}
                    >
                        <option value="">Select new role</option>
                        {promotionOptions.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handlePromotion}
                        style={{ marginLeft: "0.5rem" }}
                        disabled={!promotionRole}
                    >
                        Promote
                    </button>
                    {message && (
                        <p style={{ marginTop: "0.5rem", color: "green" }}>
                            {message}
                        </p>
                    )}
                </div>
            )}

            <div style={{ marginTop: "2rem" }}>
                <Link to={`/users/${user.userId}/edit`}>
                    <button>Edit</button>
                </Link>
                <Link to="/users">
                    <button style={{ marginLeft: "1rem" }}>Back</button>
                </Link>
            </div>
        </div>
    );
}
