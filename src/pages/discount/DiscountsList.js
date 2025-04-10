import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function DiscountsList() {
    const [discounts, setDiscounts] = useState([]);
    const [error, setError] = useState("");

    const fetchDiscounts = async () => {
        try {
            const res = await api.get("/api/discounts");
            setDiscounts(res.data);
        } catch (err) {
            console.error("Error fetching discounts:", err);
            setError("Failed to load discounts.");
        }
    };

    const deleteDiscount = async (discountId) => {
        if (!window.confirm("Are you sure you want to delete this discount?"))
            return;
        try {
            await api.delete(`/api/discounts/${discountId}`);
            fetchDiscounts(); // refresh list
        } catch (err) {
            console.error("Error deleting discount:", err);
            setError("Failed to delete discount.");
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>All Discounts</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Link to="/discounts/create-discount">
                <button>Add Discount</button>
            </Link>

            <table style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map((d) => (
                        <tr key={d.discountId}>
                            <td>{d.discountId}</td>
                            <td>{d.name}</td>
                            <td>{d.discountType}</td>
                            <td>
                                {d.discountType === "percentage"
                                    ? `${d.discountValue}%`
                                    : `$${parseFloat(d.discountValue).toFixed(
                                          2
                                      )}`}
                            </td>
                            <td>
                                <Link to={`/discounts/${d.discountId}`}>
                                    <button>View</button>
                                </Link>{" "}
                                <Link to={`/discounts/${d.discountId}/edit`}>
                                    <button>Edit</button>
                                </Link>{" "}
                                <button
                                    onClick={() => deleteDiscount(d.discountId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {discounts.length === 0 && (
                        <tr>
                            <td colSpan="5">No discounts found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
