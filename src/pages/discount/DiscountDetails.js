import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/DiscountDetails.css";

export default function DiscountDetails() {
    const { discountId } = useParams();
    const [discount, setDiscount] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                const res = await api.get(`/api/discounts/${discountId}`);
                setDiscount(res.data);
            } catch (err) {
                console.error("Error fetching discount:", err);
                setError("Failed to load discount.");
            }
        };

        fetchDiscount();
    }, [discountId]);

    if (error) return <p className="error">{error}</p>;
    if (!discount) return <p>Loading...</p>;

    return (
        <div className="discount-details-container">
            <h2>Discount Details</h2>

            <p>
                <strong>ID:</strong> {discount.discountId}
            </p>
            <p>
                <strong>Name:</strong> {discount.name}
            </p>
            <p>
                <strong>Description:</strong> {discount.description || "N/A"}
            </p>
            <p>
                <strong>Type:</strong> {discount.discountType}
            </p>
            <p>
                <strong>Value:</strong>{" "}
                {discount.discountType === "percentage"
                    ? `${discount.discountValue}%`
                    : `$${parseFloat(discount.discountValue).toFixed(2)}`}
            </p>

            <Link to="/discounts">
                <button className="back-button">Back to Discounts</button>
            </Link>
        </div>
    );
}
