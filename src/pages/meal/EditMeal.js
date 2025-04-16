import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/MealForm.css";

export default function EditMeal() {
    const { mealId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", price: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const res = await api.get(`/api/meals/${mealId}`);
                setFormData({
                    name: res.data.name || "",
                    price: res.data.price || "",
                });
            } catch (err) {
                console.error("Error fetching meal:", err);
                setError("Failed to load meal.");
            }
        };
        fetchMeal();
    }, [mealId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.put(`/api/meals/${mealId}`, formData);
            alert("Meal updated successfully!");
            navigate("/meals");
        } catch (err) {
            console.error("Error updating meal:", err);
            setError("Failed to update meal.");
        }
    };

    return (
        <div className="meal-form-container">
            <h2>Edit Meal</h2>
            {error && <p className="error">{error}</p>}

            <form className="meal-form" onSubmit={handleSubmit}>
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

                <button type="submit">Update Meal</button>
            </form>
        </div>
    );
}
