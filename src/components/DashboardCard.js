import { Link } from "react-router-dom";
import "../styles/DashboardCard.css";

export default function DashboardCard({ to, icon: Icon, label }) {
    return (
        <Link to={to} className="dashboard-card">
            {Icon && <Icon className="dashboard-card-icon" />}
            <span>{label}</span>
        </Link>
    );
}
