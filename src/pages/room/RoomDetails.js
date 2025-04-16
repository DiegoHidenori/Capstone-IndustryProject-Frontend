import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/RoomDetails.css";

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

    if (error) return <p className="room-error">{error}</p>;
    if (!room) return <p className="room-loading">Loading...</p>;

    return (
        <div className="room-details-container">
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

            <div className="room-details-actions">
                <Link
                    to={`/rooms/${room.roomId}/edit`}
                    className="room-button edit"
                >
                    Edit Room
                </Link>
                <button
                    className="room-button back"
                    onClick={() => navigate("/rooms")}
                >
                    ← Back to List
                </button>
            </div>
        </div>
    );
}
