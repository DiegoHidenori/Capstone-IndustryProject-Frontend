import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import "../../styles/BookingsList.css";

const BookingsList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await api.get("/api/bookings");
            const all = res.data;
            const filtered =
                user.role === "guest"
                    ? all.filter((b) => b.userId === user.userId)
                    : all;
            setBookings(filtered);
        } catch (err) {
            console.error(err);
            setError("Failed to load bookings.");
            toast.error("Failed to load bookings.");
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleDeleteClick = (bookingId) => {
        setSelectedBookingId(bookingId);
    };

    const handleDelete = async (bookingId) => {
        try {
            await api.delete(`/api/bookings/${bookingId}`);
            setBookings((prev) =>
                prev.filter((b) => b.bookingId !== bookingId)
            );
            toast.success("Booking deleted.");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete booking.");
        } finally {
            setSelectedBookingId(null);
        }
    };

    if (error) return <p className="error">{error}</p>;

    return (
        <div className="bookings-container">
            <h2>Bookings</h2>
            <button
                className="new-booking-button"
                onClick={() => navigate("/create-booking")}
            >
                + New Booking
            </button>
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
                                $
                                {parseFloat(
                                    booking.bookingPrice
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
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
                                        handleDeleteClick(booking.bookingId)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No bookings found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ConfirmModal
                isOpen={!!selectedBookingId}
                onClose={() => setSelectedBookingId(null)}
                onConfirm={() => handleDelete(selectedBookingId)}
                message="Are you sure you want to delete this booking?"
            />
        </div>
    );
};

export default BookingsList;
