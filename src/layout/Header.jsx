import React, { useState, useEffect } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { Bell, Megaphone } from "lucide-react"; 
import NotificationDropdown from "../layout/NotificationDropdown"; 

import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup, toggleBroadcastPopup } from "../store/slices/popUpSlice";
// New actions imported from AuthSlice
import { markAllNotificationsAsRead, markNotificationAsRead } from "../store/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showNotifications, setShowNotifications] = useState(false); 

  // Logic to show a red alert/style if there are unread notifications
  const hasUnread = user?.notifications?.some(n => n.status === "unread");

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const amPm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${amPm}`);
      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };
    updateTimeAndDate();
    const intervalId = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const handleIconClick = () => {
    if (isAdmin) {
      dispatch(toggleBroadcastPopup());
    } else {
      setShowNotifications(!showNotifications);
    }
  };

  // 1. Mark all notifications as read (moves them to 'Old' tab logic)
  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // 2. Mark a specific single notification as read
  const handleMarkSingleRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return (
    <>
      <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center z-[100]">
        
        {/* LEFT SIDE: User Profile and Status */}
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-2 pr-6 rounded-full border border-white shadow-sm group">
          <div className="relative">
            <img
              src={user?.avatar?.url || userIcon}
              alt="userIcon"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
            />
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-600 border-[3px] border-white rounded-full" />
          </div>

          <div className="flex flex-col select-none">
            <h2 className="text-base font-black text-slate-900 tracking-tight leading-none">
              {user?.name || "User Name"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {user?.role || "USER"}
              </span>
              <span className="text-slate-200 text-[8px]">•</span>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Interactions, Clock, and Settings */}
        <div className="hidden md:flex items-center gap-6 bg-slate-50/50 p-2 pl-8 rounded-[2rem] border border-white/40 shadow-inner relative">
          
          <button 
            onClick={handleIconClick}
            className={`relative p-3 rounded-full shadow-sm transition-all duration-300 group ${
              !isAdmin && hasUnread 
                ? "bg-rose-500 text-white animate-bounce" // Red/Bounce when messages are unread
                : "bg-white text-slate-600 hover:text-indigo-600" // Default white/grey after reading
            }`}
          >
            {isAdmin ? (
              <Megaphone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-indigo-600" />
            ) : (
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {!isAdmin && showNotifications && (
            <NotificationDropdown 
              notifications={user?.notifications} 
              onClose={() => setShowNotifications(false)} 
              onMarkAllRead={handleMarkAllRead}
              onMarkAsRead={handleMarkSingleRead}
              onDismiss={() => {}} 
            />
          )}

          <div className="flex flex-col items-end border-l border-slate-200 pl-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">
                {currentTime}
              </span>
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
              {currentDate}
            </span>
          </div>

          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-indigo-600 hover:scale-105 transition-all duration-300 group"
          >
            <img
              src={settingIcon}
              alt="Settings"
              className="w-6 h-6 invert brightness-200 group-hover:rotate-90 transition-transform duration-700 ease-out"
            />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;