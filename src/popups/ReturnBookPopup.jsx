import React from 'react';
import { useDispatch } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from '../store/slices/popUpSlice';

const ReturnBookPopup = ({ bookId, email }) => {
  const dispatch = useDispatch();

  const handleReturnBook = (e) => {
    e.preventDefault();
    // Dispatching return logic and immediately closing the modal
    dispatch(returnBook(email, bookId));
    dispatch(toggleReturnBookPopup());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50 backdrop-blur-sm"> 
        <div className="w-full bg-white rounded-2xl shadow-2xl md:w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-8">
            <header className="mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Return Process</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Verify borrower details</p>
            </header>

            <form onSubmit={handleReturnBook}>
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 ml-1">
                  Verified Borrower Email
                </label>
                <input
                  type="email" 
                  defaultValue={email}
                  placeholder="Borrower's Email" 
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl font-semibold text-gray-500 cursor-not-allowed outline-none"
                  required
                  disabled 
                />
                <p className="mt-2 text-[10px] text-indigo-500 font-bold italic">
                  * Email is locked to the original record
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold text-sm transition-colors" 
                  type="button" 
                  onClick={() => {
                    dispatch(toggleReturnBookPopup());
                  }}
                > 
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold text-sm uppercase tracking-widest shadow-lg shadow-black/10 transition-all active:scale-95"
                >
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnBookPopup;