import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchProfile = async () => {
	const token = localStorage.getItem("accessToken");
	const { data } = await axios.get("http://localhost:5000/auth/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return data;
};

export default function Dashboard() {
	const {
		data: profile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["me"],
		queryFn: fetchProfile,
		staleTime: 1000 * 60 * 5, // cache valid for 5 minutes
		refetchOnWindowFocus: false,
	});

	if (isLoading) return <p>Loading dashboard...</p>;
	if (error)
		return (
			<p style={{ color: "red" }}>
				Oops! We couldn't load your profile. Please try again later.
			</p>
		);

	return (
		<div style={{ padding: "2rem" }}>
			<h2>Hello, {profile.firstName}! Welcome to your Dashboard</h2>
			<p>
				<strong>User ID:</strong> {profile.userId}
			</p>
			<p>
				<strong>Role:</strong> {profile.role}
			</p>
			<p>
				<strong>Email:</strong> {profile.email}
			</p>

			{profile.role === "admin" && (
				<div style={{ marginTop: "1rem" }}>
					<h4>Admin Controls</h4>
					<ul>
						<li>Manage users</li>
						<li>View reports</li>
						<li>Configure retreat center settings</li>
					</ul>
				</div>
			)}

			{profile.role === "guest" && (
				<div style={{ marginTop: "1rem" }}>
					<h4>Your Booking Tools</h4>
					<ul>
						<li><Link to="/create-booking">Make a new reservation</Link></li>
						<li>View your bookings</li>
						<li>Manage your profile</li>
					</ul>
				</div>
			)}

			{/* Staff role example */}
			{profile.role === "staff" && (
				<div style={{ marginTop: "1rem" }}>
					<h4>Staff Portal</h4>
					<ul>
						<li>View assigned tasks</li>
						<li>Check schedules</li>
						<li>Log room cleaning updates</li>
					</ul>
				</div>
			)}
		</div>
	);
}
