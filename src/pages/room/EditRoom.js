import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomForm from "../../components/room/RoomForm";
import api from "../../utils/api";

export default function EditRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/api/rooms/${roomId}`);
                setInitialData(res.data);
            } catch (err) {
                console.error("Error loading room", err);
                alert("Failed to load room data.");
            }
        };
        fetchRoom();
    }, [roomId]);

    const handleUpdate = async (updatedData) => {
        try {
            await api.put(`/api/rooms/${roomId}`, updatedData);
            alert("Room updated!");
            navigate("/rooms");
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update room.");
        }
    };

    if (!initialData) return <p>Loading room data...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Edit Room</h2>
            <RoomForm
                initialData={initialData}
                onSubmit={handleUpdate}
                submitLabel="Update Room"
            />
        </div>
    );
}
