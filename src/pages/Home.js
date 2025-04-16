import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Queen of Apostles Retreat Center</h1>
                <p>
                    Discover a serene and spiritual space to reflect, rest, and
                    reconnect.
                </p>

                <div className="home-buttons">
                    <Link to="/login">
                        <button className="home-btn">Login</button>
                    </Link>
                    <Link to="/register">
                        <button className="home-btn secondary">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
