

import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { toggleFineNotificationPopup } from "../store/slices/popUpSlice";
import { FiX, FiAlertCircle, FiBell, FiCheckCircle, FiCreditCard } from "react-icons/fi"; 
import { getUser } from "../store/slices/authSlice"; 
import axios from "axios";
import { toast } from "react-toastify";

const NotificationPopup = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const unreadNotes = user?.notifications?.filter(n => n.status === "unread" && n.type === "fine") || [];

  const handleClose = () => {
    dispatch(toggleFineNotificationPopup());
  };

  // --- RAZORPAY PAYMENT LOGIC ---
  const handlePayment = async (amountStr, noteId) => {
    try {
      // Message-la irundhu number-ah mattum edukka (e.g., "Fine: 4.9" -> 4.9)
      const amount = parseFloat(amountStr.match(/(\d+(\.\d+)?)/)?.[0] || 0);

      if (amount <= 0) {
        return toast.error("Invalid fine amount.");
      }

      // 1. Backend-la irundhu Order ID vaanguroam
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/payment/checkout", 
       { amount: Number(amount) }, 
        { withCredentials: true }
      );

      const options = {
        key: "rzp_test_SafK0P9r7EPsdU", // Unga Dashboard Key-ah inga poodunga
        amount: data.order.amount,
        currency: "INR",
        name: "BookWorm Library",
        description: "Library Fine Payment",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            // 2. Payment verification backend call
            const verifyRes = await axios.post(
              "http://localhost:4000/api/v1/payment/payment-verification", 
              { ...response, noteId }, 
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful! Notification cleared.");
              dispatch(getUser()); // Profile-ah refresh panni notification-ah clear pannum
            }
          } catch (err) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#F43F5E" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast.error("Error initiating payment. Try again.");
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/notification/mark-read/${id}`, 
        {}, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        dispatch(getUser());
      }
    } catch (err) {
      toast.error("Error clearing notification");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-[8px] transition-opacity" 
        onClick={handleClose}
      />
      
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500">
        
        <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-8 text-white relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-lg shadow-inner">
                <FiBell className="text-2xl animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest leading-none">Notifications</h2>
                <p className="text-xs opacity-80 font-bold uppercase tracking-[0.2em] mt-2">Library Due & Fine Alerts</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all active:scale-90"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[550px] overflow-y-auto bg-[#fafafa] custom-scrollbar">
          {unreadNotes.length > 0 ? (
            <div className="space-y-5">
              {[...unreadNotes].reverse().map((note) => (
                <div 
                  key={note._id} 
                  className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative group transition-all duration-300 hover:border-rose-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex gap-5">
                    <div className="bg-rose-50 p-4 h-fit rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                      <FiAlertCircle size={26} />
                    </div>
                    <div className="flex-1 pr-6">
                      <p className="text-base font-bold text-slate-800 leading-relaxed">
                        {note.message}
                      </p>
                      
                      {/* --- PAY NOW BUTTON UPDATED --- */}
                      <button 
                        onClick={() => handlePayment(note.message, note._id)} 
                        className="mt-4 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-100"
                      >
                        <FiCreditCard /> Pay Now
                      </button>

                      <div className="flex items-center gap-3 mt-4">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                          System Alert
                        </span>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(note.createdAt).toLocaleDateString(undefined, { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => markAsRead(note._id)}
                    className="absolute top-6 right-6 text-slate-200 hover:text-rose-500 transition-all p-1"
                  >
                    <FiCheckCircle size={24} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <FiX size={22} className="group-hover:hidden" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="bg-emerald-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-12">
                 <FiBell className="text-emerald-400 text-4xl -rotate-12" />
              </div>
              <h3 className="text-slate-900 font-black text-xl uppercase tracking-tight mb-2">Zero Notifications</h3>
              <p className="text-slate-400 font-medium text-sm">
                Your library account is all caught up.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-8 bg-white border-t border-slate-50">
          <button 
            onClick={handleClose}
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] hover:bg-rose-600 shadow-2xl shadow-slate-300 hover:shadow-rose-300 transition-all duration-500 active:scale-95"
          >
            Close Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;