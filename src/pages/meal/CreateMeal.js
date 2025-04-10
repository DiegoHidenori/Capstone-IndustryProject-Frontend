import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function CreateMeal() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", price: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/api/meals", formData);
            alert("Meal added successfully!");
            navigate("/meals");
        } catch (err) {
            console.error("Error creating meal:", err);
            setError("Failed to create meal.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
            <h2>Add New Meal</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Price:
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" style={{ marginTop: "1rem" }}>
                    Create Meal
                </button>
            </form>
        </div>
    );
}
