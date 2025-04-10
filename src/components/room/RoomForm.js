import { useState, useEffect } from "react";

export default function RoomForm({ initialData = {}, onSubmit, submitLabel }) {
    const [formData, setFormData] = useState({
        roomName: "",
        roomType: "",
        roomPricePerNight: "",
        roomDescription: "",
        maxCapacity: "",
        needsCleaning: false,
        ...initialData,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", margin: "auto" }}
        >
            <label>
                Room Name:
                <input
                    type="text"
                    name="roomName"
                    value={formData.roomName}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Room Type:
                {/* <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="conference">Conference Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="dining">Dining Hall</option>
                </select> */}
                <p>
                    <strong>Room Type:</strong> {formData.roomType}
                </p>
            </label>

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
                Description:
                <textarea
                    name="roomDescription"
                    value={formData.roomDescription}
                    onChange={handleChange}
                ></textarea>
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
                Needs Cleaning:
                <input
                    type="checkbox"
                    name="needsCleaning"
                    checked={formData.needsCleaning}
                    onChange={handleChange}
                />
            </label>

            <button type="submit" style={{ marginTop: "1rem" }}>
                {submitLabel}
            </button>
        </form>
    );
}
