import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/UserForm.css";

export default function ProfileEdit() {
    const { user } = useAuth();
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
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/api/users/${user.userId}`);
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
                console.error("Error fetching profile:", err);
                setError("Failed to load profile.");
            }
        };

        if (user?.userId) fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password;

            await api.put(`/api/users/${user.userId}`, payload);
            alert("Profile updated successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile.");
        }
    };

    return (
        <div className="user-form-container">
            <h2>Edit My Profile</h2>
            {error && <p className="error">{error}</p>}

            <form className="user-form" onSubmit={handleSubmit}>
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

                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}
