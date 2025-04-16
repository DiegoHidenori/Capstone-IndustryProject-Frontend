import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "../../styles/UserDetails.css";
import { toast } from "react-toastify";

export default function UserDetails() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [promotionRole, setPromotionRole] = useState("");
    const [isPromoting, setIsPromoting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/users/${userId}`);
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to fetch user.");
            }
        };
        fetchUser();
    }, [userId]);

    const handlePromotion = async () => {
        if (!promotionRole) return;
        setIsPromoting(true);
        try {
            await api.patch(`/api/users/${userId}/promote`, {
                role: promotionRole,
            });
            toast.success(`User promoted to ${promotionRole}`);
            setUser((prev) => ({ ...prev, role: promotionRole }));
        } catch (err) {
            console.error("Promotion failed:", err);
            toast.error(err?.response?.data?.message || "Promotion failed");
        } finally {
            setIsPromoting(false);
        }
    };

    if (error) return <p className="error">{error}</p>;
    if (!user) return <p>Loading...</p>;

    const canPromote =
        currentUser?.role === "admin" || currentUser?.role === "staff";

    const promotionOptions =
        currentUser?.role === "admin"
            ? ["guest", "staff", "admin"]
            : ["guest", "staff"];

    return (
        <div className="user-details-container">
            <h2>User Details</h2>
            <div className="user-field">
                <strong>ID:</strong> {user.userId}
            </div>
            <div className="user-field">
                <strong>Name:</strong> {user.firstName} {user.middleName || ""}{" "}
                {user.lastName}
            </div>
            <div className="user-field">
                <strong>Email:</strong> {user.email}
            </div>
            <div className="user-field">
                <strong>Phone:</strong> {user.phone || "N/A"}
            </div>
            <div className="user-field">
                <strong>Billing Address:</strong> {user.billingAddress || "N/A"}
            </div>
            <div className="user-field">
                <strong>Role:</strong> {user.role}
            </div>

            {canPromote && (
                <div className="promotion-section">
                    <h3>Promote User</h3>
                    <div className="promotion-controls">
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
                            disabled={!promotionRole || isPromoting}
                        >
                            {isPromoting ? "Promoting..." : "Promote"}
                        </button>
                    </div>
                </div>
            )}

            <div className="user-actions">
                <Link to={`/users/${user.userId}/edit`}>
                    <button>Edit</button>
                </Link>
                <Link to="/users">
                    <button className="back-btn">Back</button>
                </Link>
            </div>
        </div>
    );
}
