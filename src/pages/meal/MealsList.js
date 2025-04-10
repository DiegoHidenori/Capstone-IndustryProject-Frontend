import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

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
            fetchMeals(); // refresh
        } catch (err) {
            console.error("Error deleting meal:", err);
            setError("Failed to delete meal.");
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>All Meals</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Link to="/meals/create-meal">
                <button>Add Meal</button>
            </Link>

            <table style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal) => (
                        <tr key={meal.mealId}>
                            <td>{meal.mealId}</td>
                            <td>{meal.name}</td>
                            <td>${parseFloat(meal.price).toFixed(2)}</td>
                            <td>
                                <Link to={`/meals/${meal.mealId}`}>
                                    <button>View</button>
                                </Link>{" "}
                                <Link to={`/meals/${meal.mealId}/edit`}>
                                    <button>Edit</button>
                                </Link>{" "}
                                <button onClick={() => deleteMeal(meal.mealId)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {meals.length === 0 && (
                        <tr>
                            <td colSpan="4">No meals found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
