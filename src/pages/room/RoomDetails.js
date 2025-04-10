import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

export default function RoomDetails() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/api/rooms/${roomId}`);
                setRoom(res.data);
            } catch (err) {
                console.error("Failed to fetch room:", err);
                setError("Could not load room data.");
            }
        };

        fetchRoom();
    }, [roomId]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!room) return <p>Loading...</p>;

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h2>Room Details</h2>
            <p>
                <strong>Name:</strong> {room.roomName}
            </p>
            <p>
                <strong>Type:</strong> {room.roomType}
            </p>
            <p>
                <strong>Price/Night:</strong> $
                {parseFloat(room.roomPricePerNight).toFixed(2)}
            </p>
            <p>
                <strong>Description:</strong> {room.roomDescription}
            </p>
            <p>
                <strong>Max Capacity:</strong> {room.maxCapacity}
            </p>
            <p>
                <strong>Needs Cleaning:</strong>{" "}
                {room.needsCleaning ? "Yes" : "No"}
            </p>

            <div style={{ marginTop: "1rem" }}>
                <Link
                    to={`/rooms/${room.roomId}/edit`}
                    style={{ marginRight: "1rem" }}
                >
                    Edit Room
                </Link>
                <button onClick={() => navigate("/rooms")}>Back to List</button>
            </div>
        </div>
    );
}
