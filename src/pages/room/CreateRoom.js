import { useNavigate } from "react-router-dom";
import RoomForm from "../../components/room/RoomForm";
import api from "../../utils/api";

export default function CreateRoom() {
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        try {
            await api.post("/api/rooms", formData);
            alert("Room created successfully!");
            navigate("/rooms");
        } catch (err) {
            console.error("Room creation failed", err);
            alert("Failed to create room.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Create Room</h2>
            <RoomForm onSubmit={handleCreate} submitLabel="Create Room" />
        </div>
    );
}
