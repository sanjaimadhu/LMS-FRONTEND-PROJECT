import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import FineManagement from "../components/FineManagement"; 
import PaymentPage from "../components/PaymentPage";
import ReviewManagement from "../pages/ReviewManagement"; // Admin review management
import MyReviews from "../components/MyReviews"; // User's own reviews
import MyReservedBooks from "../components/MyReservedBooks"; 
// --- ADMIN RESERVATIONS IMPORT ---
import AdminReservations from "../components/AdminReservations"; 
// --- PROFILE IMPORT ---
import Profile from "../components/Profile"; 

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
          < GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>

        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={setSelectedComponent}
        />

        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );

            case "Books":
              return <BookManagement />;

            // --- PROFILE CASE ADDED ---
            case "Profile":
              return <Profile />;

            case "Catalog":
              if (user.role === "Admin") return <Catalog />;
              break;

            case "Users":
              if (user.role === "Admin") return <Users />;
              break;

            case "My Borrowed Books":
              return <MyBorrowedBooks />;

            // --- RESERVED BOOKS LOGIC (USER) ---
            case "My Reserved Books":
              if (user.role === "User") {
                return <MyReservedBooks />;
              }
              break;

            // --- GLOBAL RESERVATIONS LOGIC (ADMIN) ---
            case "Global Reservations":
              if (user.role === "Admin") {
                return <AdminReservations />;
              }
              break;

            // --- REVIEWS LOGIC ---
            case "Review Management":
              if (user.role === "Admin") {
                return <ReviewManagement />;
              }
              break;

            case "My Reviews":
              if (user.role === "User") {
                return <MyReviews />;
              }
              break;

            case "Fine Management":
              if (user.role === "Admin") return <FineManagement />;
              break;

            case "Fine Payment":
              if (user.role === "User") return <PaymentPage />;
              break;

            default:
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
          }
        })()}
      </div>
    </>
  );
};

export default Home;