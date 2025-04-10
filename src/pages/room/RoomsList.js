import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function RoomsList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get("/api/rooms");
                setRooms(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch rooms.");
            }
        };

        if (user) fetchRooms();
    }, [user]);

    const handleDelete = async (roomId) => {
        const confirm = window.confirm(
            "Are you sure you want to delete this room?"
        );
        if (!confirm) return;

        try {
            await api.delete(`/api/rooms/${roomId}`);
            setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
        } catch (err) {
            console.error(err);
            setError("Failed to delete room.");
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Room Management</h2>
            <button
                onClick={() => navigate("/rooms/create")}
                style={{ marginBottom: "1rem" }}
            >
                ➕ Add New Room
            </button>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Price/Night</th>
                        <th>Capacity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.roomId}>
                            <td>{room.roomId}</td>
                            <td>{room.roomName}</td>
                            <td>{room.roomType}</td>
                            <td>${room.roomPricePerNight}</td>
                            <td>{room.maxCapacity}</td>
                            <td>
                                <Link to={`/rooms/${room.roomId}`}>View</Link> |{" "}
                                <Link to={`/rooms/${room.roomId}/edit`}>
                                    Edit
                                </Link>{" "}
                                |{" "}
                                <button
                                    onClick={() => handleDelete(room.roomId)}
                                    style={{
                                        color: "red",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {rooms.length === 0 && (
                        <tr>
                            <td
                                colSpan="6"
                                style={{ textAlign: "center", padding: "1rem" }}
                            >
                                No rooms found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
