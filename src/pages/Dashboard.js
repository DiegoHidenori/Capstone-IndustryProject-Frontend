import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";
import api from "../utils/api";

import { FaBed, FaUserCog, FaTags } from "react-icons/fa";
import { MdMeetingRoom, MdFastfood } from "react-icons/md";
import { toast } from "react-toastify";

const fetchProfile = async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
};

export default function Dashboard() {
    const {
        data: profile,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["me"],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        document.title = "Dashboard";

        if (!isLoading && !error && profile) {
            toast.success(`Welcome back, ${profile.firstName}!`, {
                toastId: "welcome-toast",
            });
        }

        if (error) {
            toast.error("Failed to load user profile.");
        }
    }, [isLoading, error, profile]);

    if (isLoading) return <p className="loading">Loading dashboard...</p>;
    if (error) return <p className="error">Failed to load profile.</p>;

    return (
        <div className="dashboard-container">
            <h2>Hello, {profile.firstName}! Welcome to your Dashboard</h2>
            <p>
                <strong>Role:</strong> {profile.role}
            </p>

            <div className="dashboard-grid">
                {/* Admin + Staff */}
                {["admin", "staff"].includes(profile.role) && (
                    <>
                        <DashboardCard
                            to="/bookings"
                            icon={FaBed}
                            label="Manage Bookings"
                        />
                        <DashboardCard
                            to="/rooms"
                            icon={MdMeetingRoom}
                            label="Manage Rooms"
                        />
                        <DashboardCard
                            to="/meals"
                            icon={MdFastfood}
                            label="Manage Meals"
                        />
                        <DashboardCard
                            to="/discounts"
                            icon={FaTags}
                            label="Manage Discounts"
                        />
                        <DashboardCard
                            to="/users"
                            icon={FaUserCog}
                            label="Manage Users"
                        />
                    </>
                )}

                {/* Guest */}
                {profile.role === "guest" && (
                    <>
                        <DashboardCard
                            to="/bookings"
                            icon={FaBed}
                            label="My Bookings"
                        />
                        <DashboardCard
                            to="/create-booking"
                            icon={MdMeetingRoom}
                            label="New Booking"
                        />
                    </>
                )}

                {/* Shared */}
                <DashboardCard
                    to="/profile"
                    icon={FaUserCog}
                    label="Manage Profile"
                />
            </div>
        </div>
    );
}
