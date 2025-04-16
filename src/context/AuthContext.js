import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            if (decoded.exp && decoded.exp < now) {
                refreshAccessToken();
                return;
            }
            setUser({ userId: decoded.userId, role: decoded.role });
            setAccessToken(token);
        } catch (err) {
            console.error("Invalid token:", err);
            logout();
        }
    };

    const login = async (token, refreshToken, rememberMe = false) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", token);
        storage.setItem("refreshToken", refreshToken);
        decodeToken(token);
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
    };

    const refreshAccessToken = async () => {
        try {
            const storedRefreshToken =
                localStorage.getItem("refreshToken") ||
                sessionStorage.getItem("refreshToken");

            const res = await api.post("/auth/refresh", {
                refreshToken: storedRefreshToken,
            });
            const newToken = res.data.accessToken;
            decodeToken(newToken);
            return newToken;
        } catch (err) {
            console.error("Failed to refresh access token:", err);
            logout();
            throw err;
        }
    };

    // Run once on initial app load
    useEffect(() => {
        const token =
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken");
        if (token) decodeToken(token);
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                refreshAccessToken,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
