import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/MealsList.css";

export default function MealsList() {
    const [meals, setMeals] = useState([]);
    const [error, setError] = useState("");

    const fetchMeals = async () => {
        try {
            const res = await api.get("/api/meals");
            setMeals(res.data);
        } catch (err) {
            console.error("Error fetching meals:", err);
            setError("Failed to load meals.");
        }
    };

    const deleteMeal = async (mealId) => {
        if (!window.confirm("Are you sure you want to delete this meal?"))
            return;
        try {
            await api.delete(`/api/meals/${mealId}`);
            fetchMeals();
        } catch (err) {
            console.error("Error deleting meal:", err);
            setError("Failed to delete meal.");
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    return (
        <div className="meals-list-container">
            <h2>Meal Management</h2>
            {error && <p className="error">{error}</p>}

            <div className="meals-actions">
                <Link to="/meals/create-meal">
                    <button className="primary-btn">➕ Add Meal</button>
                </Link>
            </div>

            <table className="meals-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal) => (
                        <tr key={meal.mealId}>
                            <td>{meal.name}</td>
                            <td>${parseFloat(meal.price).toFixed(2)}</td>
                            <td>
                                <Link to={`/meals/${meal.mealId}`}>
                                    <button className="view-btn">View</button>
                                </Link>
                                <Link to={`/meals/${meal.mealId}/edit`}>
                                    <button className="edit-btn">Edit</button>
                                </Link>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteMeal(meal.mealId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {meals.length === 0 && (
                        <tr>
                            <td colSpan="4" className="no-data">
                                No meals found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
