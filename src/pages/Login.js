import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false); // ✅ Add this
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { login, user } = useAuth(); // ✅ Combine destructuring

	if (user) return <Navigate to="/dashboard" replace />;

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(null); // clear previous errors

		try {
			const res = await axios.post("http://localhost:5000/auth/login", {
				email,
				password,
			});

			const { accessToken, refreshToken } = res.data;
			await login(accessToken, refreshToken, rememberMe); // ✅ Pass rememberMe
			navigate("/dashboard");
		} catch (err) {
			console.error("Login failed", err);
			setError("Invalid email or password");
		}
	};

	return (
		<div style={{ maxWidth: "400px", margin: "2rem auto" }}>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
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

				<label style={{ display: "block", marginTop: "1rem" }}>
					<input
						type="checkbox"
						checked={rememberMe}
						onChange={() => setRememberMe(!rememberMe)}
					/>
					Remember me
				</label>

				<button type="submit" style={{ marginTop: "1rem" }}>Login</button>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</form>
		</div>
	);
}
