import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/RoomsList.css";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function RoomsList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get("/api/rooms");
                setRooms(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch rooms.");
                toast.error("Failed to fetch rooms.");
            }
        };

        if (user) fetchRooms();
    }, [user]);

    const handleDeleteClick = (roomId) => {
        setSelectedRoomId(roomId);
    };

    const handleDelete = async (roomId) => {
        try {
            await api.delete(`/api/rooms/${roomId}`);
            setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
            toast.success("Room deleted!");
        } catch (err) {
            console.error(err);
            setError("Failed to delete room.");
            toast.error("Failed to delete room.");
        } finally {
            setSelectedRoomId(null);
        }
    };

    const confirmDelete = () => {
        if (selectedRoomId) {
            handleDelete(selectedRoomId);
        }
    };

    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="rooms-container">
            <h2>Room Management</h2>
            <button
                className="new-room-button"
                onClick={() => navigate("/rooms/new")}
            >
                ➕ Add New Room
            </button>
            <table className="rooms-table">
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
                            <td className="rooms-actions">
                                <Link to={`/rooms/${room.roomId}`}>View</Link>
                                <Link to={`/rooms/${room.roomId}/edit`}>
                                    Edit
                                </Link>
                                <button
                                    onClick={() =>
                                        handleDeleteClick(room.roomId)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {rooms.length === 0 && (
                        <tr>
                            <td colSpan="6" className="no-rooms">
                                No rooms found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ConfirmModal
                isOpen={!!selectedRoomId}
                onClose={() => setSelectedRoomId(null)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this room?"
            />
        </div>
    );
}
