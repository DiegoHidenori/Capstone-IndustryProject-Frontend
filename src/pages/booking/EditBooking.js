import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/BookingForm.css";

export default function EditBooking() {
    const { bookingId } = useParams();
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
    const [error, setError] = useState("");
    const [conflictingRooms, setConflictingRooms] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBookingAndData = async () => {
            try {
                const [bookingRes, mealsRes, roomsRes, discountsRes] =
                    await Promise.all([
                        api.get(`/api/bookings/${bookingId}`),
                        api.get("/api/meals"),
                        api.get("/api/rooms"),
                        api.get("/api/discounts"),
                    ]);

                const b = bookingRes.data;
                setMeals(mealsRes.data);
                setRooms(roomsRes.data);
                setDiscounts(discountsRes.data);

                setFormData({
                    checkinDate: b.checkinDate?.slice(0, 10) || "",
                    checkoutDate: b.checkoutDate?.slice(0, 10) || "",
                    hasOvernight: b.hasOvernight || false,
                    firstMeal: b.firstMeal || "",
                    requirements: b.requirements || [],
                    staffNotes: b.staffNotes || "",
                    participantsList: b.participantsList || [],
                    roomIds: b.Rooms?.map((r) => r.roomId) || [],
                    mealIds: b.Meals?.map((m) => m.mealId) || [],
                    discountIds: b.Discounts?.map((d) => d.discountId) || [],
                });
            } catch (err) {
                console.error("Error loading booking", err);
                setError("Failed to load booking.");
            }
        };

        fetchBookingAndData();
    }, [bookingId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleMultiSelectChange = (e, key) => {
        const selected = Array.from(e.target.selectedOptions).map((o) =>
            parseInt(o.value)
        );
        setFormData((prev) => ({ ...prev, [key]: selected }));
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
            newErrors.checkinDate = "Check-in is required";
        if (!formData.checkoutDate)
            newErrors.checkoutDate = "Check-out is required";
        if (!formData.firstMeal) newErrors.firstMeal = "First meal is required";
        if (!formData.roomIds?.length)
            newErrors.roomIds = "Select at least one room";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setErrors({});
        setConflictingRooms([]);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const payload = {
                ...formData,
                requirements: formData.requirements || [],
                participantsList: formData.participantsList || [],
            };

            await api.put(`/api/bookings/${bookingId}`, payload);
            alert("Booking updated!");
            navigate("/bookings");
        } catch (err) {
            if (err.response?.status === 409) {
                setError(err.response.data.message);
                setConflictingRooms(err.response.data.conflictRoomIds || []);
            } else {
                console.error("Update failed:", err);
                setError("Failed to update booking.");
            }
        }
    };

    return (
        <div className="booking-form-container">
            <h2>Edit Booking #{bookingId}</h2>

            {error && (
                <div className="booking-error-box">
                    <strong>{error}</strong>
                    {conflictingRooms.length > 0 && (
                        <p>
                            Unavailable room IDs: {conflictingRooms.join(", ")}
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
                        {meals.map((m) => (
                            <option key={m.mealId} value={m.name}>
                                {m.name}
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
                    Rooms:
                    <select
                        multiple
                        value={formData.roomIds}
                        onChange={(e) => handleMultiSelectChange(e, "roomIds")}
                    >
                        {rooms.map((room) => (
                            <option key={room.roomId} value={room.roomId}>
                                {room.roomName} ({room.roomType})
                            </option>
                        ))}
                    </select>
                    {errors.roomIds && (
                        <p className="error">{errors.roomIds}</p>
                    )}
                </label>

                <label>
                    Meals:
                    <select
                        multiple
                        value={formData.mealIds}
                        onChange={(e) => handleMultiSelectChange(e, "mealIds")}
                    >
                        {meals.map((meal) => (
                            <option key={meal.mealId} value={meal.mealId}>
                                {meal.name} — ${meal.price}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Discounts:
                    <select
                        multiple
                        value={formData.discountIds}
                        onChange={(e) =>
                            handleMultiSelectChange(e, "discountIds")
                        }
                    >
                        {discounts.map((d) => (
                            <option key={d.discountId} value={d.discountId}>
                                {d.name} ({d.discountType} {d.discountValue})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Requirements (comma-separated):
                    <input
                        type="text"
                        value={formData.requirements.join(", ")}
                        onChange={(e) => handleArrayInput(e, "requirements")}
                    />
                </label>

                <label>
                    Participants (comma-separated):
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

                <button type="submit">Update Booking</button>
            </form>
        </div>
    );
}
