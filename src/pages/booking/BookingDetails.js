import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import "../../styles/BookingDetails.css";
import formatCurrency from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

export default function BookingDetails() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchBooking = async () => {
        try {
            const res = await api.get(`/api/bookings/${bookingId}`);
            setBooking(res.data);
        } catch (err) {
            console.error("Failed to fetch booking", err);
            setError("Could not load booking details.");
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!booking) return <p>Loading...</p>;

    const handlePayment = async (paymentType) => {
        try {
            const res = await api.post("/api/payments/checkout", {
                invoiceId: booking.Invoice.invoiceId,
                paymentType,
                amountPaid:
                    paymentType === "deposit"
                        ? booking.Invoice.depositAmount
                        : booking.Invoice.totalAmount -
                          booking.Invoice.depositAmount,
            });

            alert(
                `Payment started (${paymentType}). Transaction ID: ${res.data.transactionId}. Please wait for confirmation.`
            );

            // Optional: Poll or wait, then refresh
            setTimeout(() => {
                fetchBooking();
            }, 2500);
        } catch (err) {
            console.error("Payment failed", err);
            alert("Failed to initiate payment.");
        }
    };

    return (
        <div className="booking-details">
            <h2>Booking Details</h2>
            <button className="back-btn" onClick={() => navigate("/bookings")}>
                ← Back to Bookings
            </button>
            <p>
                <strong>Booking ID:</strong> {booking.id}
            </p>
            <p>
                <strong>Booking Date:</strong>{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
            </p>
            <p>
                <strong>Check-in:</strong>{" "}
                {new Date(booking.checkinDate).toLocaleDateString()}
            </p>
            <p>
                <strong>Check-out:</strong>{" "}
                {new Date(booking.checkoutDate).toLocaleDateString()}
            </p>
            <p>
                <strong>Has Overnight:</strong>{" "}
                {booking.hasOvernight ? "Yes" : "No"}
            </p>
            <p>
                <strong>First Meal:</strong> {booking.firstMeal || "N/A"}
            </p>
            <p>
                <strong>Requirements:</strong>{" "}
                {booking.requirements?.join(", ") || "N/A"}
            </p>
            <p>
                <strong>Staff Notes:</strong> {booking.staffNotes || "N/A"}
            </p>
            <p>
                <strong>Participants:</strong>{" "}
                {booking.participantsList?.join(", ") || "N/A"}
            </p>
            <p>
                <strong>Final Price:</strong>{" "}
                {formatCurrency(booking.finalPrice)}
            </p>

            {booking.discountBreakdown?.length > 0 && (
                <>
                    <h4>Discounts Applied</h4>
                    <ul>
                        {booking.discountBreakdown.map((d, idx) => (
                            <li key={idx}>
                                {d.discountName} ({d.type}): -{" "}
                                {formatCurrency(d.discountAmount)}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h4>Rooms</h4>
            <ul>
                {booking.Rooms?.map((room) => (
                    <li key={room.roomId}>
                        {room.roomName} — {room.roomType} —{" "}
                        <strong>
                            $
                            {parseFloat(
                                room.roomPricePerNight
                            ).toLocaleString()}
                        </strong>
                    </li>
                ))}
            </ul>

            <h4>Meals</h4>
            <ul>
                {booking.Meals?.map((meal) => (
                    <li key={meal.mealId}>
                        {meal.name} — ${parseFloat(meal.price).toFixed(2)}
                    </li>
                ))}
            </ul>

            {booking.Invoice && (
                <>
                    <h4>Invoice</h4>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            className={`invoice-status ${booking.Invoice.status}`}
                        >
                            {booking.Invoice.status}
                        </span>
                    </p>
                    <p>
                        <strong>Total:</strong>{" "}
                        {formatCurrency(booking.Invoice.totalAmount)}
                    </p>
                    <p>
                        <strong>Deposit:</strong>{" "}
                        {formatCurrency(booking.Invoice.depositAmount)}
                    </p>

                    {/* ✅ Payment Buttons */}
                    {booking.Invoice.status !== "fully_paid" && (
                        <div className="payment-actions">
                            <button
                                onClick={() => handlePayment("deposit")}
                                disabled={
                                    booking.Invoice.status === "deposit_paid"
                                }
                            >
                                Pay Deposit
                            </button>
                            <button
                                onClick={() => handlePayment("final_payment")}
                            >
                                Pay Final Amount
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
