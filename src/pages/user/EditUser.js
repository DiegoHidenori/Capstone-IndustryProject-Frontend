import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/EditUser.css";

export default function EditUser() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        billingAddress: "",
        password: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/users/${userId}`);
                const u = res.data;
                setFormData({
                    firstName: u.firstName || "",
                    middleName: u.middleName || "",
                    lastName: u.lastName || "",
                    email: u.email || "",
                    phone: u.phone || "",
                    billingAddress: u.billingAddress || "",
                    password: "",
                });
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to load user.");
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password;

            await api.put(`/api/users/${userId}`, payload);
            alert("User updated!");
            navigate(`/users/${userId}`);
        } catch (err) {
            console.error("Error updating user:", err);
            setError("Failed to update user.");
        }
    };

    return (
        <div className="edit-user-container">
            <h2>Edit User #{userId}</h2>
            {error && <p className="error">{error}</p>}

            <form className="edit-user-form" onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Middle Name:
                    <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Billing Address:
                    <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    New Password (optional):
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
