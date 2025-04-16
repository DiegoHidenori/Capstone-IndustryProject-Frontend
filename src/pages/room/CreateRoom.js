import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";
import "../../styles/RoomForm.css";
import { toast } from "react-toastify";

export default function CreateRoom() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roomName: "",
        roomType: "",
        roomPricePerNight: "",
        maxCapacity: "",
        roomDescription: "",
        needsCleaning: false,
        details: {},
    });
    const [error, setError] = useState("");
    const ROOM_TYPES = ["Bedroom", "Conference", "Dining", "Kitchen", "Chapel"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/api/rooms", formData);
            toast.success("Room created successfully!");
            navigate("/rooms");
        } catch (err) {
            console.error("Room creation failed", err);
            toast.error("Failed to create room.");
        }
    };

    return (
        <div className="room-form-container">
            <h2>Create Room</h2>
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
                    >
                        <option value="">-- Select Room Type --</option>
                        {ROOM_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                {formData.roomType === "Bedroom" && (
                    <>
                        <label>
                            Bedroom Number:
                            <input
                                type="text"
                                value={formData.details.bedroomNumber || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            bedroomNumber: e.target.value,
                                        },
                                    }))
                                }
                                required
                            />
                        </label>

                        <label>
                            Has Shower:
                            <input
                                type="checkbox"
                                checked={formData.details.hasShower || false}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            hasShower: e.target.checked,
                                        },
                                    }))
                                }
                            />
                        </label>
                    </>
                )}

                {formData.roomType === "Conference" && (
                    <>
                        <label>
                            Seating Plan:
                            <input
                                type="text"
                                value={formData.details.seatingPlan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            seatingPlan: e.target.value,
                                        },
                                    }))
                                }
                                required
                            />
                        </label>

                        <label>
                            Number of Chairs:
                            <input
                                type="number"
                                value={formData.details.numChairs || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            numChairs: parseInt(e.target.value),
                                        },
                                    }))
                                }
                                required
                            />
                        </label>

                        <label>
                            Number of Tables:
                            <input
                                type="number"
                                value={formData.details.numTables || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            numTables: parseInt(e.target.value),
                                        },
                                    }))
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
                <button type="submit">Create Room</button>
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
