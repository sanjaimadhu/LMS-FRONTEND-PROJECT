import React, { useEffect, useState } from "react";
import axios from "axios"; 
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { 
  MdOutlineNotificationsActive, 
  MdOutlinePayments, 
  MdOutlineRateReview, 
  MdOutlineReviews,
  MdOutlineBookmarkAdded,
  MdOutlineAssignmentTurnedIn,
  MdPerson // New Icon for Profile View
} from "react-icons/md"; 
import { FaUserCircle } from "react-icons/fa"; 
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { 
  toggleAddNewAdminPopup, 
  toggleSettingPopup, 
  toggleUpdateProfilePopup,
  toggleFineNotificationPopup 
} from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import UpdateProfilePopup from "../popups/UpdateProfilePopup";
import NotificationPopup from "../popups/NotificationPopup";

const API_URL = import.meta.env.VITE_API_URL;

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  
  const { 
    addNewAdminPopup, 
    settingPopup, 
    updateProfilePopup,
    fineNotificationPopup 
  } = useSelector(state => state.popup);
  
  const { loading, error, message, user, isAuthenticated } = useSelector(state => state.auth);
  
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const totalFine = userBorrowedBooks?.reduce((acc, curr) => acc + (Number(curr.fine) || 0), 0);

  const unreadNotificationsCount = user?.notifications?.filter(
    (notif) => notif.status === "unread" && notif.type === "fine"
  ).length || 0;

  const [reservedNotificationCount, setReservedNotificationCount] = useState(0);

  useEffect(() => {
    const checkReservations = async () => {
      if (isAuthenticated && user?.role === "User") {
        try {
          const { data } = await axios.get(`${API_URL}/book/my-reserved-books`, {
            withCredentials: true,
          });
          const availableCount = data.reservedBooks?.filter(book => book.quantity > 0).length;
          setReservedNotificationCount(availableCount);
        } catch (err) {
          console.log("Error fetching reservation count");
        }
      }
    };

    checkReservations();
    const interval = setInterval(checkReservations, 300000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      <aside className={`${
        isSideBarOpen ? "left-0" : "-left-full"}
        z-10 transition-all duration-700 md:relative md:left-0 flex w-64 
        bg-black text-white flex-col
        h-full`}
        style={{ position: "fixed" }}>

        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          
          {/* Dashboard */}
          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
            onClick={() => setSelectedComponent("Dashboard")}>
            <div className="w-6 h-6 flex items-center justify-center">
                <img src={dashboardIcon} alt="icon" className="w-5 h-5 object-contain" />
            </div>
            <span> Dashboard</span>
          </button>

          {/* Profile View (Added for both Admin and User) */}
          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white hover:bg-white/10"
            onClick={() => setSelectedComponent("Profile")}>
            <div className="w-6 h-6 flex items-center justify-center">
                <MdPerson className="w-6 h-6 text-white" />
            </div>
            <span> My Profile</span>
          </button>

          {/* Books */}
          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
            onClick={() => setSelectedComponent("Books")}>
            <div className="w-6 h-6 flex items-center justify-center">
                <img src={bookIcon} alt="icon" className="w-5 h-5 object-contain" />
            </div>
            <span> Books</span>
          </button>

          {/* Admin Specific Links */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => setSelectedComponent("Catalog")}>
                <div className="w-6 h-6 flex items-center justify-center">
                    <img src={catalogIcon} alt="icon" className="w-5 h-5 object-contain" />
                </div>
                <span> Catalog</span>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => setSelectedComponent("Users")}>
                <div className="w-6 h-6 flex items-center justify-center">
                    <img src={usersIcon} alt="icon" className="w-5 h-5 object-contain" />
                </div>
                <span> Users</span>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white transition-all hover:bg-white/10"
                onClick={() => setSelectedComponent("Global Reservations")}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <MdOutlineAssignmentTurnedIn className="w-6 h-6 text-indigo-400" />
                </div>
                <span> Global Reservations</span>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => setSelectedComponent("Review Management")}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <MdOutlineReviews className="w-6 h-6 text-white" />
                </div>
                <span> Review Management</span>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white transition duration-300"
                onClick={() => setSelectedComponent("Fine Management")}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <MdOutlineNotificationsActive className="w-6 h-6 text-white" />
                </div>
                <span> Fine Management</span>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => dispatch(toggleUpdateProfilePopup())}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <FaUserCircle className="w-6 h-6 text-white" /> 
                </div>
                <span> Update Profile</span>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => dispatch(toggleAddNewAdminPopup())}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <RiAdminFill className="w-6 h-6" />
                </div>
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {/* User Specific Links */}
          {isAuthenticated && user?.role === "User" && (
            <>
              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => setSelectedComponent("My Borrowed Books")}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <img src={catalogIcon} alt="icon" className="w-5 h-5 object-contain" />
                </div>
                <span> My Borrowed Books </span>
              </button>

              <button className={`w-full py-2 px-1 font-medium rounded-md hover:cursor-pointer flex items-center justify-between transition-all duration-300 ${
                  reservedNotificationCount > 0 ? "bg-emerald-900/20" : "bg-transparent"
                }`}
                onClick={() => setSelectedComponent("My Reserved Books")}>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <MdOutlineBookmarkAdded className={`w-6 h-6 ${reservedNotificationCount > 0 ? "text-emerald-400" : "text-white"}`} />
                  </div>
                  <span className="text-sm"> My Reserved Books </span>
                </div>
                {reservedNotificationCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce mr-1">
                    {reservedNotificationCount}
                  </span>
                )}
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => setSelectedComponent("My Reviews")}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <MdOutlineRateReview className="w-6 h-6 text-white" />
                </div>
                <span> My Reviews </span>
              </button>

              <button 
                className={`w-full py-2 px-1 font-medium rounded-md hover:cursor-pointer flex items-center justify-between transition-all duration-300 ${
                  (totalFine > 0 || unreadNotificationsCount > 0)
                  ? "bg-rose-900/30 text-white" 
                  : "bg-transparent text-white"
                }`}
                onClick={() => {
                  setSelectedComponent("Fine Payment");
                  if (unreadNotificationsCount > 0) {
                    dispatch(toggleFineNotificationPopup());
                  }
                }}
              >
                <div className="flex items-center space-x-2 relative">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <MdOutlinePayments className={`w-6 h-6 ${(totalFine > 0 || unreadNotificationsCount > 0) ? "text-rose-500" : "text-white"}`} />
                  </div>
                  
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-black"></span>
                    </span>
                  )}
                  
                  <span className="text-sm tracking-tight"> Fine Payment </span>
                </div>

                <div className="flex items-center gap-1">
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.5 rounded-md font-bold animate-pulse">
                      {unreadNotificationsCount} MSG
                    </span>
                  )}
                  {totalFine > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-lg shadow-rose-900/50">
                      ₹{totalFine}
                    </span>
                  )}
                </div>
              </button>

              <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
                onClick={() => dispatch(toggleUpdateProfilePopup())}>
                <div className="w-6 h-6 flex items-center justify-center">
                   <FaUserCircle className="w-6 h-6 text-white" /> 
                </div>
                <span> Update Profile</span>
              </button>
            </>
          )}

          <hr className="border-gray-800 my-4" />

          <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 text-white"
            onClick={() => dispatch(toggleSettingPopup())}>
            <div className="w-6 h-6 flex items-center justify-center">
                <img src={settingIcon} alt="icon" className="w-5 h-5 object-contain" />
            </div>
            <span> Update Credentials</span>
          </button>
        </nav>

        <div className="px-6 py-4 border-t border-gray-900">
          <button className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-4 mx-auto w-fit text-white transition hover:text-rose-400" 
            onClick={handleLogout}>
            <img src={logoutIcon} alt="icon" className="w-5 h-5 object-contain" />
            <span> Log Out</span>
          </button>
        </div>

        <img src={closeIcon} alt="icon" onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden cursor-pointer" />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
      {updateProfilePopup && <UpdateProfilePopup />}
      {fineNotificationPopup && <NotificationPopup />} 
    </>
  );
};

export default SideBar;
