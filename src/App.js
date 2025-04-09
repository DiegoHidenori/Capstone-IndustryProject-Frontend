import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import CreateBooking from "./pages/booking/CreateBooking";
import BookingsList from "./pages/booking/BookingsList";
import BookingDetails from "./pages/booking/BookingDetails";
import EditBooking from "./pages/booking/EditBooking";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-booking" element={<CreateBooking />} />
                    <Route path="/bookings" element={<BookingsList />} />
                    <Route
                        path="/bookings/:bookingId"
                        element={<BookingDetails />}
                    />
                    <Route
                        path="/bookings/:bookingId/edit"
                        element={<EditBooking />}
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
