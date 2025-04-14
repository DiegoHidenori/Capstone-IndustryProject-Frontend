import React, { useState } from "react";
import api from "../../utils/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const CreateBooking = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [conflictingRooms, setConflictingRooms] = useState([]);
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
            .filter(Boolean);

        setFormData((prev) => ({
            ...prev,
            [key]:
                key === "requirements" || key === "participantsList"
                    ? values
                    : values.map(Number),
        }));
    };

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.userId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setConflictingRooms([]);

        try {
            const userId = getUserIdFromToken();
            if (!userId) throw new Error("User not authenticated");

            const payload = {
                ...formData,
                userId,
                requirements: formData.requirements || [],
                participantsList: formData.participantsList || [],
            };

            const res = await api.post("/api/bookings", payload);

            const price = parseFloat(res.data.bookingPrice || 0).toFixed(2);
            alert(`Booking created! Final Price: $${price}`);

            navigate("/dashboard");
        } catch (err) {
            if (err.response?.status === 409) {
                const data = err.response.data;
                setErrorMessage(data.message);
                setConflictingRooms(data.conflictRoomIds || []);
            } else {
                console.error("Booking failed:", err);
                setErrorMessage("Booking failed. Please try again.");
            }
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <h2>Create a Booking</h2>

            {errorMessage && (
                <div
                    style={{
                        backgroundColor: "#ffe0e0",
                        padding: "1rem",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                    }}
                >
                    <strong>{errorMessage}</strong>
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
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Check-out Date:
                    <input
                        type="date"
                        name="checkoutDate"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Has Overnight:
                    <input
                        type="checkbox"
                        name="hasOvernight"
                        onChange={handleChange}
                    />
                </label>

                <label>
                    First Meal:
                    <input
                        type="text"
                        name="firstMeal"
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Requirements (comma-separated):
                    <input
                        type="text"
                        onChange={(e) => handleArrayChange(e, "requirements")}
                    />
                </label>

                <label>
                    Staff Notes:
                    <textarea
                        name="staffNotes"
                        onChange={handleChange}
                    ></textarea>
                </label>

                <label>
                    Participants List (comma-separated):
                    <input
                        type="text"
                        onChange={(e) =>
                            handleArrayChange(e, "participantsList")
                        }
                    />
                </label>

                <label>
                    Room IDs (comma-separated):
                    <input
                        type="text"
                        onChange={(e) => handleArrayChange(e, "roomIds")}
                    />
                </label>

                <label>
                    Meal IDs (comma-separated):
                    <input
                        type="text"
                        onChange={(e) => handleArrayChange(e, "mealIds")}
                    />
                </label>

                <label>
                    Discount IDs (comma-separated):
                    <input
                        type="text"
                        onChange={(e) => handleArrayChange(e, "discountIds")}
                    />
                </label>

                <button type="submit" style={{ marginTop: "1rem" }}>
                    Create Booking
                </button>
            </form>
        </div>
    );
};

export default CreateBooking;
