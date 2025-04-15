import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true, // if needed for cookies, optional
});

// Attach token to all requests
api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken"); // ✅ fallback support

    if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Refresh token on 401 responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken =
                    localStorage.getItem("refreshToken") ||
                    sessionStorage.getItem("refreshToken");

                const res = await axios.post(
                    "http://localhost:5000/api/auth/refresh",
                    {
                        refreshToken,
                    }
                );

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
