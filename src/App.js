import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import CreateBooking from "./pages/booking/CreateBooking";
import BookingsList from "./pages/booking/BookingsList";
import BookingDetails from "./pages/booking/BookingDetails";
import EditBooking from "./pages/booking/EditBooking";
import RoomsList from "./pages/room/RoomsList";
import CreateRoom from "./pages/room/CreateRoom";
import EditRoom from "./pages/room/EditRoom";
import RoomDetails from "./pages/room/RoomDetails";
import MealsList from "./pages/meal/MealsList";
import CreateMeal from "./pages/meal/CreateMeal";
import EditMeal from "./pages/meal/EditMeal";
import MealDetails from "./pages/meal/MealDetails";
import DiscountsList from "./pages/discount/DiscountsList";
import CreateDiscount from "./pages/discount/CreateDiscount";
import EditDiscount from "./pages/discount/EditDiscount";
import DiscountDetails from "./pages/discount/DiscountDetails";
import UsersList from "./pages/user/UsersList";
import UserDetails from "./pages/user/UserDetails";
import EditUser from "./pages/user/EditUser";

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
                    <Route path="/rooms" element={<RoomsList />} />
                    <Route path="/rooms/:roomId" element={<RoomDetails />} />
                    <Route path="/rooms/new" element={<CreateRoom />} />
                    <Route path="/rooms/:roomId/edit" element={<EditRoom />} />
                    <Route path="/meals" element={<MealsList />} />
                    <Route path="/meals/:mealId" element={<MealDetails />} />
                    <Route path="/meals/create-meal" element={<CreateMeal />} />
                    <Route path="/meals/:mealId/edit" element={<EditMeal />} />
                    <Route path="/discounts" element={<DiscountsList />} />
                    <Route
                        path="/discounts/create-discount"
                        element={<CreateDiscount />}
                    />
                    <Route
                        path="/discounts/:discountId/edit"
                        element={<EditDiscount />}
                    />
                    <Route
                        path="/discounts/:discountId"
                        element={<DiscountDetails />}
                    />
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/users/:userId" element={<UserDetails />} />
                    <Route path="/users/:userId/edit" element={<EditUser />} />
                </Route>
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
            />
        </Router>
    );
}

export default App;
