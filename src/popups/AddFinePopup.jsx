import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import moneyIcon from "../assets/setting-white.png";
import { toast } from "react-toastify";
import axios from "axios";

// Destructuring props, including userEmail for backend notification logic
const AddFinePopup = ({ borrowId, userName, userEmail, bookTitle, onClose }) => {
  const [fineAmount, setFineAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddFine = async (e) => {
    e.preventDefault();
    if (!fineAmount || fineAmount <= 0) {
      return toast.error("Please enter a valid amount");
    }

    setLoading(true);
    try {
      // Sending all required fields to the backend for fine processing and user alerts
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/borrow/update-fine/${borrowId}`,
        { 
          fine: Number(fineAmount), // Convert to Number to ensure mathematical consistency
          name: userName, 
          email: userEmail, 
          bookTitle: bookTitle 
        },
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success(`Fine updated for ${userName}`);
        onClose();
      }
    } catch (error) {
      // Log full error details for development debugging
      console.error("Update Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full bg-white rounded-2xl shadow-2xl md:w-[400px] transition-all overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-xl">
                <img src={moneyIcon} alt="icon" className="w-5 h-5 invert" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add / Update Fine</h3>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Book: {bookTitle}</p>
              </div>
            </div>
            <img
              src={closeIcon}
              alt="close"
              className="cursor-pointer w-6 h-6 hover:opacity-70 transition-opacity"
              onClick={onClose}
            />
          </header>

          <form onSubmit={handleAddFine}>
            <div className="mb-6">
              <p className="mb-4 text-sm text-gray-500 leading-relaxed">
                Adding fine for <strong className="text-gray-900">{userName}</strong> due to late return or damage.
              </p>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Fine Amount (₹)</label>
              <input
                type="number"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
                placeholder="Enter Amount in INR"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all font-semibold"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold text-sm disabled:bg-gray-400 transition-all shadow-lg shadow-black/10"
              >
                {loading ? "SAVING..." : "UPDATE FINE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFinePopup;