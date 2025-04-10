import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function CreateDiscount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { name, description, discountType, discountValue } = formData;

        if (!name || !discountType || discountValue === "") {
            setError("Please fill in all required fields.");
            return;
        }

        if (
            discountType === "percentage" &&
            (discountValue < 0 || discountValue > 100)
        ) {
            setError("Percentage discount must be between 0 and 100.");
            return;
        }

        try {
            await api.post("/api/discounts", {
                name,
                description,
                discountType,
                discountValue: parseFloat(discountValue),
            });
            navigate("/discounts");
        } catch (err) {
            console.error("Error creating discount:", err);
            setError("Failed to create discount.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
            <h2>Add New Discount</h2>
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
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Discount Type:
                    <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                        required
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                    </select>
                </label>

                <label>
                    Discount Value:
                    <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        required
                        step="0.01"
                    />
                </label>

                <button type="submit" style={{ marginTop: "1rem" }}>
                    Create Discount
                </button>
            </form>
        </div>
    );
}
