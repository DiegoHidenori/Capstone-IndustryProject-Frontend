import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../utils/api";
import "../../styles/BookingForm.css";
import RoomMap from "../../components/RoomMap";

export default function CreateBooking() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        checkinDate: "",
        checkoutDate: "",
        hasOvernight: false,
        firstMeal: "",
        requirements: [],
        staffNotes: "",
        participantsList: [],
        roomIds: [],
        mealIds: [],
        discountIds: [],
    });

    const [meals, setMeals] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [errors, setErrors] = useState({});
    const [conflictRoomIds, setConflictRoomIds] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, mealsRes, discountsRes] = await Promise.all([
                    api.get("/api/rooms"),
                    api.get("/api/meals"),
                    api.get("/api/discounts"),
                ]);
                setRooms(roomsRes.data);
                setMeals(mealsRes.data);
                setDiscounts(discountsRes.data);
            } catch (err) {
                console.error("Failed to fetch options", err);
            }
        };
        fetchData();
    }, []);

    const getUserIdFromToken = () => {
        const token =
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.userId;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCheckboxArrayChange = (id, key) => {
        setFormData((prev) => {
            const current = new Set(prev[key]);
            current.has(id) ? current.delete(id) : current.add(id);
            return { ...prev, [key]: Array.from(current) };
        });
    };

    const handleRoomToggle = (roomId) => {
        setFormData((prev) => {
            const exists = prev.roomIds.includes(roomId);
            return {
                ...prev,
                roomIds: exists
                    ? prev.roomIds.filter((id) => id !== roomId)
                    : [...prev.roomIds, roomId],
            };
        });
    };

    const handleArrayInput = (e, key) => {
        const values = e.target.value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        setFormData((prev) => ({ ...prev, [key]: values }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.checkinDate)
            newErrors.checkinDate = "Check-in date is required";
        if (!formData.checkoutDate)
            newErrors.checkoutDate = "Check-out date is required";
        if (!formData.firstMeal) newErrors.firstMeal = "First meal is required";
        if (formData.roomIds.length === 0)
            newErrors.roomIds = "Select at least one room";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setError("");
        setConflictRoomIds([]);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) return alert("User not authenticated");

        try {
            const payload = {
                ...formData,
                userId,
            };

            const res = await api.post("/api/bookings", {
                ...formData,
                userId,
            });

            alert(`Booking created! Final Price: $${res.data.finalPrice}`);
            navigate("/bookings");
        } catch (err) {
            if (err.response?.status === 409) {
                setError(err.response.data.message);
                setConflictRoomIds(err.response.data.conflictRoomIds || []);
            } else {
                console.error("Failed to create booking", err);
                setError("Failed to create booking.");
            }
        }
    };

    return (
        <div className="booking-form-container">
            <h2>Create Booking</h2>

            {error && (
                <div className="booking-error-box">
                    <strong>{error}</strong>
                    {conflictRoomIds.length > 0 && (
                        <p>
                            Unavailable room IDs: {conflictRoomIds.join(", ")}
                        </p>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form">
                <label>
                    Check-in Date:
                    <input
                        type="date"
                        name="checkinDate"
                        value={formData.checkinDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                    />
                    {errors.checkinDate && (
                        <p className="error">{errors.checkinDate}</p>
                    )}
                </label>

                <label>
                    Check-out Date:
                    <input
                        type="date"
                        name="checkoutDate"
                        value={formData.checkoutDate}
                        min={formData.checkinDate}
                        onChange={handleChange}
                    />
                    {errors.checkoutDate && (
                        <p className="error">{errors.checkoutDate}</p>
                    )}
                </label>

                <label>
                    First Meal:
                    <select
                        name="firstMeal"
                        value={formData.firstMeal}
                        onChange={handleChange}
                    >
                        <option value="">-- Select First Meal --</option>
                        {meals.map((meal) => (
                            <option key={meal.mealId} value={meal.name}>
                                {meal.name}
                            </option>
                        ))}
                    </select>
                    {errors.firstMeal && (
                        <p className="error">{errors.firstMeal}</p>
                    )}
                </label>

                <label>
                    Has Overnight:
                    <input
                        type="checkbox"
                        name="hasOvernight"
                        checked={formData.hasOvernight}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Select Rooms by Clicking the Map:
                    <RoomMap
                        rooms={rooms}
                        selectedRooms={formData.roomIds}
                        onRoomClick={handleRoomToggle} // ✅ now works with string room IDs
                    />
                </label>

                <fieldset>
                    <legend>Meals:</legend>
                    {meals.map((meal) => (
                        <label key={meal.mealId} style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={formData.mealIds.includes(meal.mealId)}
                                onChange={() =>
                                    handleCheckboxArrayChange(
                                        meal.mealId,
                                        "mealIds"
                                    )
                                }
                            />
                            {meal.name} — ${parseFloat(meal.price).toFixed(2)}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Discounts:</legend>
                    {discounts.map((d) => (
                        <label key={d.discountId} style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={formData.discountIds.includes(
                                    d.discountId
                                )}
                                onChange={() =>
                                    handleCheckboxArrayChange(
                                        d.discountId,
                                        "discountIds"
                                    )
                                }
                            />
                            {d.name} ({d.discountType} {d.discountValue})
                        </label>
                    ))}
                </fieldset>

                <label>
                    Requirements (comma-separated):
                    <input
                        type="text"
                        value={formData.requirements.join(", ")}
                        onChange={(e) => handleArrayInput(e, "requirements")}
                    />
                </label>

                <label>
                    Participants List (comma-separated):
                    <input
                        type="text"
                        value={formData.participantsList.join(", ")}
                        onChange={(e) =>
                            handleArrayInput(e, "participantsList")
                        }
                    />
                </label>

                <label>
                    Staff Notes:
                    <textarea
                        name="staffNotes"
                        value={formData.staffNotes}
                        onChange={handleChange}
                    ></textarea>
                </label>
                <button type="submit">Create Booking</button>
            </form>
            <button
                className="new-booking-button"
                onClick={() => navigate("/bookings")}
            >
                Cancel
            </button>
        </div>
    );
}
