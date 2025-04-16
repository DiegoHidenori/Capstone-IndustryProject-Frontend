import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/MealDetails.css";

export default function MealDetails() {
    const { mealId } = useParams();
    const [meal, setMeal] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const res = await api.get(`/api/meals/${mealId}`);
                setMeal(res.data);
            } catch (err) {
                console.error("Error fetching meal:", err);
                setError("Failed to load meal.");
            }
        };
        fetchMeal();
    }, [mealId]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!meal) {
        return <p className="loading">Loading...</p>;
    }

    return (
        <div className="meal-details-container">
            <h2>Meal Details</h2>
            <p>
                <strong>ID:</strong> {meal.mealId}
            </p>
            <p>
                <strong>Name:</strong> {meal.name}
            </p>
            <p>
                <strong>Price:</strong> ${parseFloat(meal.price).toFixed(2)}
            </p>

            <div className="meal-actions">
                <Link to={`/meals/${meal.mealId}/edit`}>
                    <button className="edit-btn">Edit</button>
                </Link>
                <Link to="/meals">
                    <button className="back-btn">Back to Meals</button>
                </Link>
            </div>
        </div>
    );
}
