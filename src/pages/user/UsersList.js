import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users.");
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;
        try {
            await api.delete(`/api/users/${userId}`);
            fetchUsers(); // Refresh after deletion
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>All Users</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <table style={{ width: "100%", marginTop: "1rem" }}>
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
                            <td>
                                <Link to={`/users/${user.userId}`}>
                                    <button>View</button>
                                </Link>{" "}
                                <Link to={`/users/${user.userId}/edit`}>
                                    <button>Edit</button>
                                </Link>{" "}
                                <button onClick={() => deleteUser(user.userId)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
