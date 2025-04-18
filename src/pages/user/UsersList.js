import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/UsersList.css";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users.");
            toast.error("Failed to load users.");
        }
    };

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
    };

    const handleDelete = async (userId) => {
        try {
            await api.delete(`/api/users/${userId}`);
            toast.success("User deleted.");
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Failed to delete user.");
        } finally {
            setSelectedUserId(null);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="users-list-container">
            <h2>All Users</h2>
            {error && <p className="error">{error}</p>}

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className="actions-cell">
                                <Link to={`/users/${user.userId}`}>
                                    <button className="view-btn">View</button>
                                </Link>
                                <Link to={`/users/${user.userId}/edit`}>
                                    <button className="edit-btn">Edit</button>
                                </Link>
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDeleteClick(user.userId)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5" className="no-users">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ConfirmModal
                isOpen={!!selectedUserId}
                onClose={() => setSelectedUserId(null)}
                onConfirm={() => handleDelete(selectedUserId)}
                message="Are you sure you want to delete this user?"
            />
        </div>
    );
}
