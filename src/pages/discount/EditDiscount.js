import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function EditDiscount() {
    const { discountId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                const res = await api.get(`/api/discounts/${discountId}`);
                const { name, description, discountType, discountValue } =
                    res.data;

                setFormData({
                    name,
                    description: description || "",
                    discountType,
                    discountValue: discountValue.toString(),
                });
            } catch (err) {
                console.error("Error loading discount:", err);
                setError("Failed to load discount.");
            }
        };

        fetchDiscount();
    }, [discountId]);

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
            await api.put(`/api/discounts/${discountId}`, {
                name,
                description,
                discountType,
                discountValue: parseFloat(discountValue),
            });
            navigate("/discounts");
        } catch (err) {
            console.error("Error updating discount:", err);
            setError("Failed to update discount.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
            <h2>Edit Discount #{discountId}</h2>
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
                    Update Discount
                </button>
            </form>
        </div>
    );
}
