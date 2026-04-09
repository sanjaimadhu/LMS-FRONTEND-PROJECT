/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { getUser } from "../store/slices/authSlice"; 
import { FiBell, FiAlertCircle, FiX, FiClock, FiCheckCircle } from "react-icons/fi";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const [loadingClear, setLoadingClear] = useState(null); 
  const [showHistory, setShowHistory] = useState(false); // History toggle state
  
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
    dispatch(getUser()); 
  }, [dispatch]);

  const handleClearNotification = async (notificationId) => {
    setLoadingClear(notificationId);
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/notification/mark-read/${notificationId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Notification cleared");
        dispatch(getUser()); 
      }
    } catch (error) {
      toast.error("Failed to clear notification");
    } finally {
      setLoadingClear(null);
    }
  };

  // Filter read notifications to show as history
  const paymentHistory = user?.notifications?.filter(n => n.status === "read" && n.type === "fine") || [];

  return (
    /* ADDED: Background Image via inline style + Tailwind utility classes */
    <div 
      className="p-4 md:p-8 w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(253, 252, 253, 0.9), rgba(253, 252, 253, 0.9)), url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 w-full relative z-10">
        <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight text-slate-800">
          <FiBell className={`${!showHistory ? "text-red-500 animate-bounce" : "text-slate-400"}`} /> 
          {showHistory ? "Payment History" : "Penalty Alerts"}
        </h3>
        
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
        >
          {showHistory ? (
            <><FiBell className="text-red-500" /> Show Alerts</>
          ) : (
            <><FiClock className="text-blue-500" /> View History</>
          )}
        </button>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar w-full relative z-10">
        {!showHistory ? (
          /* --- ALERTS VIEW --- */
          user?.notifications?.filter(n => n.status === "unread" && n.type === "fine").length > 0 ? (
            [...user.notifications]
              .reverse()
              .filter(note => note.status === "unread" && note.type === "fine")
              .map((note, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm border-l-8 border-red-500 p-6 rounded-2xl shadow-md flex items-start gap-4 transform transition-all hover:scale-[1.005] group relative w-full">
                <div className="bg-red-50 p-3 rounded-xl">
                  <FiAlertCircle className="text-red-500 text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-700 text-base leading-snug">{note.message}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    Sent on: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => handleClearNotification(note._id)}
                  disabled={loadingClear === note._id}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500"
                >
                  {loadingClear === note._id ? "..." : <FiX size={20} />}
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 p-12 rounded-[2.5rem] text-center text-slate-400 font-bold uppercase tracking-widest text-sm w-full">
              No pending fine alerts.
            </div>
          )
        ) : (
          /* --- HISTORY VIEW --- */
          paymentHistory.length > 0 ? (
            [...paymentHistory].reverse().map((past, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm border-l-8 border-green-500 p-6 rounded-2xl shadow-sm flex items-start gap-4 opacity-90 w-full">
                <div className="bg-green-50 p-3 rounded-xl">
                  <FiCheckCircle className="text-green-500 text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-600 text-base leading-snug line-through opacity-60">{past.message}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Paid / Cleared</span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Cleared on: {new Date(past.updatedAt || past.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 p-12 rounded-[2.5rem] text-center text-slate-400 font-bold uppercase tracking-widest text-sm w-full">
              No payment history found.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentPage;