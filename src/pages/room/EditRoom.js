import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/RoomForm.css";

export default function EditRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState("");
    const ROOM_TYPES = ["Bedroom", "Conference", "Dining", "Kitchen", "Chapel"];

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/api/rooms/${roomId}`);
                setFormData(res.data);
            } catch (err) {
                console.error("Error loading room", err);
                setError("Failed to load room data.");
            }
        };
        fetchRoom();
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleDetailChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                [key]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.put(`/api/rooms/${roomId}`, formData);
            alert("Room updated!");
            navigate("/rooms");
        } catch (err) {
            console.error("Update failed", err);
            setError("Failed to update room.");
        }
    };

    if (!formData) return <p>Loading room data...</p>;

    return (
        <div className="room-form-container">
            <h2>Edit Room</h2>
            {error && <p className="error">{error}</p>}

            <form className="room-form" onSubmit={handleSubmit}>
                <label>
                    Room Name:
                    <input
                        type="text"
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Room Type:
                    <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        required
                        disabled // ✅ prevent changing roomType during editing
                    >
                        {ROOM_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Dynamic Fields for Bedroom */}
                {formData.roomType === "Bedroom" && (
                    <>
                        <label>
                            Bedroom Number:
                            <input
                                type="text"
                                value={formData.details?.bedroomNumber || ""}
                                onChange={(e) =>
                                    handleDetailChange(
                                        "bedroomNumber",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </label>

                        <label>
                            Has Shower:
                            <input
                                type="checkbox"
                                checked={formData.details?.hasShower || false}
                                onChange={(e) =>
                                    handleDetailChange(
                                        "hasShower",
                                        e.target.checked
                                    )
                                }
                            />
                        </label>
                    </>
                )}

                {/* Dynamic Fields for Conference */}
                {formData.roomType === "Conference" && (
                    <>
                        <label>
                            Seating Plan:
                            <input
                                type="text"
                                value={formData.details?.seatingPlan || ""}
                                onChange={(e) =>
                                    handleDetailChange(
                                        "seatingPlan",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </label>

                        <label>
                            Number of Chairs:
                            <input
                                type="number"
                                value={formData.details?.numChairs || ""}
                                onChange={(e) =>
                                    handleDetailChange(
                                        "numChairs",
                                        parseInt(e.target.value)
                                    )
                                }
                                required
                            />
                        </label>

                        <label>
                            Number of Tables:
                            <input
                                type="number"
                                value={formData.details?.numTables || ""}
                                onChange={(e) =>
                                    handleDetailChange(
                                        "numTables",
                                        parseInt(e.target.value)
                                    )
                                }
                                required
                            />
                        </label>
                    </>
                )}

                <label>
                    Price Per Night:
                    <input
                        type="number"
                        name="roomPricePerNight"
                        value={formData.roomPricePerNight}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Max Capacity:
                    <input
                        type="number"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        name="roomDescription"
                        value={formData.roomDescription}
                        onChange={handleChange}
                    ></textarea>
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="needsCleaning"
                        checked={formData.needsCleaning}
                        onChange={handleChange}
                    />
                    Needs Cleaning
                </label>

                <button type="submit">Update Room</button>
                <button
                    type="button"
                    className="cancel-button"
                    onClick={() => navigate("/rooms")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
