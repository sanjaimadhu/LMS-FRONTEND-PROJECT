import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleBroadcastPopup } from "../store/slices/popUpSlice";
import { Send, X, Megaphone } from "lucide-react"; 
import axios from "axios";

const BroadcastPopup = () => {
  const { broadcastPopup } = useSelector((state) => state.popup);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Early return if the popup state is false
  if (!broadcastPopup) return null;

  const handleSend = async () => {
    if (!message.trim()) return alert("Please type a message!");

    setLoading(true);
    try {
      // Backend API call - withCredentials included for session/cookie support
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/notification/broadcast", 
        { message }, 
        { withCredentials: true } 
      );
      
      alert(data.message || "Message sent successfully!");
      setMessage(""); 
      dispatch(toggleBroadcastPopup()); 
    } catch (err) {
      // Log full error for development debugging
      console.error("Broadcast Error:", err.response?.data);
      
      // Extract specific error message from backend if available
      const errorMsg = err.response?.data?.message || "Failed to send the message. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Background Overlay with Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')` 
        }}
        onClick={() => dispatch(toggleBroadcastPopup())}
      >
        {/* Subtle blur layer on the background image itself */}
        <div className="absolute inset-0 backdrop-blur-[3px]"></div>
      </div>

      {/* Popup Card Container */}
      <div className="relative bg-white/95 backdrop-blur-md w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Broadcast Message</h3>
              <p className="text-xs text-indigo-100 font-medium uppercase tracking-widest">Send to all users</p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(toggleBroadcastPopup())}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Section: Textarea Input */}
        <div className="p-8">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Your Announcement
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl p-5 h-44 text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-400 font-medium"
            placeholder="Type the message you want to broadcast to all users..."
          />
        </div>

        {/* Footer Section: Action Buttons */}
        <div className="px-8 pb-8 flex gap-4">
          <button
            onClick={() => dispatch(toggleBroadcastPopup())}
            className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSend}
            disabled={loading}
            className={`flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-slate-900/20 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Sending..." : (
              <>
                <Send className="w-4 h-4" />
                Send to All
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastPopup;