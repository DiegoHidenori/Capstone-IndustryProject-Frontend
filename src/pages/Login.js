import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../styles/AuthForm.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();

    if (user) return <Navigate to="/dashboard" replace />;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await api.post("/api/auth/login", {
                email,
                password,
            });

            const { accessToken, refreshToken } = res.data;
            await login(accessToken, refreshToken, rememberMe);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Login failed", err);
            toast.error("Invalid email or password");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="auth-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    Remember me
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
