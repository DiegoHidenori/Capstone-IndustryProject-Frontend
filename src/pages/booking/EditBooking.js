import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

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
        bookingPrice: "",
    });

    const [error, setError] = useState("");
    const [conflictingRooms, setConflictingRooms] = useState([]);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/api/bookings/${bookingId}`);
                const b = res.data;

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
                    bookingPrice: b.finalPrice || "",
                });
            } catch (err) {
                console.error("Error loading booking", err);
                setError("Failed to load booking.");
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleArrayChange = (e, key) => {
        const values = e.target.value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v !== "");

        setFormData((prev) => ({
            ...prev,
            [key]:
                key === "requirements" || key === "participantsList"
                    ? values
                    : values.map(Number),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setConflictingRooms([]);

        try {
            await api.put(`/api/bookings/${bookingId}`, formData);
            alert("Booking updated!");
            navigate("/bookings");
        } catch (err) {
            if (err.response?.status === 409) {
                setError(err.response.data.message);
                setConflictingRooms(err.response.data.conflictingRoomIds || []);
            } else {
                console.error("Update failed:", err);
                setError("Failed to update booking.");
            }
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Edit Booking #{bookingId}</h2>

            {error && (
                <div
                    style={{
                        backgroundColor: "#ffe0e0",
                        padding: "1rem",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                    }}
                >
                    <strong>{error}</strong>
                    {conflictingRooms.length > 0 && (
                        <p>
                            Unavailable room IDs: {conflictingRooms.join(", ")}
                        </p>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Check-in Date:
                    <input
                        type="date"
                        name="checkinDate"
                        value={formData.checkinDate}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Check-out Date:
                    <input
                        type="date"
                        name="checkoutDate"
                        value={formData.checkoutDate}
                        onChange={handleChange}
                    />
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
                    First Meal:
                    <input
                        type="text"
                        name="firstMeal"
                        value={formData.firstMeal}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Requirements (comma-separated):
                    <input
                        type="text"
                        value={formData.requirements.join(", ")}
                        onChange={(e) => handleArrayChange(e, "requirements")}
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

                <label>
                    Participants List (comma-separated):
                    <input
                        type="text"
                        value={formData.participantsList.join(", ")}
                        onChange={(e) =>
                            handleArrayChange(e, "participantsList")
                        }
                    />
                </label>

                <label>
                    Booking Price:
                    <input
                        type="number"
                        name="bookingPrice"
                        value={formData.bookingPrice}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Room IDs (comma-separated):
                    <input
                        type="text"
                        value={formData.roomIds.join(", ")}
                        onChange={(e) => handleArrayChange(e, "roomIds")}
                    />
                </label>

                <label>
                    Meal IDs (comma-separated):
                    <input
                        type="text"
                        value={formData.mealIds.join(", ")}
                        onChange={(e) => handleArrayChange(e, "mealIds")}
                    />
                </label>

                <label>
                    Discount IDs (comma-separated):
                    <input
                        type="text"
                        value={formData.discountIds.join(", ")}
                        onChange={(e) => handleArrayChange(e, "discountIds")}
                    />
                </label>

                <button type="submit" style={{ marginTop: "1rem" }}>
                    Update Booking
                </button>
            </form>
        </div>
    );
}
