import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";

const RecordBookPopup = ({ bookId, bookImage, bookTitle }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleRecordBook = (e) => {
    e.preventDefault();
    dispatch(recordBorrowBook(email, bookId));
  };

  return (
    <div className="fixed inset-0 bg-black/60 p-5 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="w-full bg-white rounded-[2rem] shadow-2xl md:w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        
        {/* --- Image Section Fixed: Title contrast update --- */}
        <div className="relative w-full h-80 bg-slate-50 flex items-center justify-center p-4">
          <img 
            src={bookImage || "/placeholder-book.png"} 
            alt="Book Preview" 
            className="h-full w-auto object-contain drop-shadow-2xl" 
          />
          
          {/* Title Overlay: Gradient-ah black-ah maathi text-ah white-ah kuduthuruken */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] truncate text-center drop-shadow-md">
              {bookTitle || "Loading Title..."}
            </p>
          </div>
        </div>

        <div className="p-8 pt-6"> 
          <header className="mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Record Borrowing</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Assign book to user</p>
          </header>

          <form onSubmit={handleRecordBook}>
            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 ml-1">
                User Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. borrower@example.com"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black focus:ring-0 transition-all font-semibold outline-none placeholder:text-gray-300"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full px-4 py-4 bg-black text-white rounded-xl hover:bg-gray-800 font-bold text-sm uppercase tracking-widest shadow-lg shadow-black/10 transition-all active:scale-95"
              >
                Record Entry
              </button>
              <button
                type="button"
                className="w-full px-4 py-3 text-gray-400 hover:text-black font-bold text-[10px] uppercase tracking-widest transition-colors"
                onClick={() => dispatch(toggleRecordBookPopup())}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordBookPopup;