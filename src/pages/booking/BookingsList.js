import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import "../../styles/BookingsList.css";

const BookingsList = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get("/api/bookings");
                const allBookings = res.data;

                // Guests see only their own bookings
                const filtered =
                    user.role === "guest"
                        ? allBookings.filter((b) => b.userId === user.userId)
                        : allBookings;

                setBookings(filtered);
            } catch (err) {
                console.error(err);
                setError("Failed to load bookings.");
            }
        };

        if (user) fetchBookings();
    }, [user]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const handleDelete = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?"))
            return;

        try {
            await api.delete(`/api/bookings/${bookingId}`);
            setBookings((prev) =>
                prev.filter((b) => b.bookingId !== bookingId)
            );
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete booking.");
        }
    };

    return (
        <div className="bookings-container">
            <h2>Bookings</h2>
            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Booking Date</th>
                        <th>User</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>
                                {new Date(
                                    booking.bookingDate
                                ).toLocaleDateString()}
                            </td>
                            <td>{booking.userId}</td>
                            <td>
                                {new Date(
                                    booking.checkinDate
                                ).toLocaleDateString()}
                            </td>
                            <td>
                                {new Date(
                                    booking.checkoutDate
                                ).toLocaleDateString()}
                            </td>
                            <td>
                                ${parseFloat(booking.bookingPrice).toFixed(2)}
                            </td>
                            <td className="bookings-actions">
                                <Link to={`/bookings/${booking.bookingId}`}>
                                    View
                                </Link>
                                <Link
                                    to={`/bookings/${booking.bookingId}/edit`}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() =>
                                        handleDelete(booking.bookingId)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr>
                            <td
                                colSpan="7"
                                style={{ textAlign: "center", padding: "1rem" }}
                            >
                                No bookings found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingsList;
