import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/DiscountsList.css";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function DiscountsList() {
    const [discounts, setDiscounts] = useState([]);
    const [error, setError] = useState("");
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);

    const fetchDiscounts = async () => {
        try {
            const res = await api.get("/api/discounts");
            setDiscounts(res.data);
        } catch (err) {
            console.error("Error fetching discounts:", err);
            setError("Failed to load discounts.");
            toast.error("Failed to load discounts.");
        }
    };

    const handleDeleteClick = (discountId) => {
        setSelectedDiscountId(discountId);
    };

    const handleDelete = async (discountId) => {
        try {
            await api.delete(`/api/discounts/${discountId}`);
            toast.success("Discount deleted!");
            fetchDiscounts();
        } catch (err) {
            console.error("Error deleting discount:", err);
            toast.error("Failed to delete discount.");
        } finally {
            setSelectedDiscountId(null);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    return (
        <div className="discounts-list-container">
            <h2>All Discounts</h2>
            {error && <p className="error">{error}</p>}

            <Link to="/discounts/create-discount">
                <button className="add-discount-btn">Add Discount</button>
            </Link>

            <table className="discounts-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map((d) => (
                        <tr key={d.discountId}>
                            <td>{d.name}</td>
                            <td>{d.discountType}</td>
                            <td>
                                {d.discountType === "percentage"
                                    ? `${d.discountValue}%`
                                    : `$${parseFloat(d.discountValue).toFixed(
                                          2
                                      )}`}
                            </td>
                            <td className="actions-cell">
                                <Link to={`/discounts/${d.discountId}`}>
                                    <button className="view-btn">View</button>
                                </Link>
                                <Link to={`/discounts/${d.discountId}/edit`}>
                                    <button className="edit-btn">Edit</button>
                                </Link>
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDeleteClick(d.discountId)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {discounts.length === 0 && (
                        <tr>
                            <td colSpan="5" className="no-data">
                                No discounts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ConfirmModal
                isOpen={!!selectedDiscountId}
                onClose={() => setSelectedDiscountId(null)}
                onConfirm={() => handleDelete(selectedDiscountId)}
                message="Are you sure you want to delete this discount?"
            />
        </div>
    );
}
