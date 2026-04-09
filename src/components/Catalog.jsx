import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FiX, FiShield, FiMail, FiInbox, FiClock, FiCalendar, FiCheckCircle, FiBookOpen } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  
  // Redux States
  const { user } = useSelector((state) => state.user); 
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { allBorrowedBooks, message, error } = useSelector((state) => state.borrow);

  // Local States
  const [filter, setFilter] = useState("borrowed");
  const [showRegistry, setShowRegistry] = useState(false);
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  // Helper Functions
  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  const formatTime = (timeStamp) => {
    if (!timeStamp) return "N/A";
    return new Date(timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // --- Filtering Logic ---
  const currentDate = new Date();
  
  const borrowedBooks = allBorrowedBooks?.filter((book) => !book.returnDate && new Date(book.dueDate) > currentDate) || [];
  const overdueBooks = allBorrowedBooks?.filter((book) => !book.returnDate && new Date(book.dueDate) <= currentDate) || [];
  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  const successRegistryBooks = allBorrowedBooks?.filter((book) => book.returnDate) || [];

  const openReturnBookPopup = (bookId, userEmail) => {
    const finalId = bookId?._id ? bookId._id : bookId;
    setBorrowedBookId(finalId);
    setEmail(userEmail);
    dispatch(toggleReturnBookPopup());
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBorrowedBooks());
      setTimeout(() => { dispatch(resetBorrowSlice()); }, 500);
    }
    if (error) {
      toast.error(error);
      setTimeout(() => { dispatch(resetBorrowSlice()); }, 500);
    }
  }, [dispatch, error, message]);

  return (
    <>
      {/* ADDED: Background Image via style and overlay via bg-white/90 */}
      <main 
        className="relative flex-1 p-8 pt-32 bg-white/90 bg-cover bg-center bg-no-repeat bg-fixed min-h-screen font-sans tracking-tight text-slate-900"
        style={{ 
            backgroundImage: `linear-gradient(rgba(241, 245, 249, 0.9), rgba(241, 245, 249, 0.9)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')` 
        }}
      >
        <Header />
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-tight">
              Catalog <span className="text-red-600">.</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Inventory Management System v2.0</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl shadow-slate-200 border border-white w-full sm:w-auto">
              <button
                className={`flex-1 sm:flex-none text-[10px] uppercase tracking-[0.2em] font-black py-4 px-10 rounded-[1.8rem] transition-all duration-500 ${
                  filter === "borrowed" ? "bg-slate-950 text-white shadow-2xl scale-105" : "text-slate-400 hover:text-slate-950"
                }`}
                onClick={() => setFilter("borrowed")}
              >
                Borrowed
              </button>
              <button
                className={`flex-1 sm:flex-none text-[10px] uppercase tracking-[0.2em] font-black py-4 px-10 rounded-[1.8rem] transition-all duration-500 ${
                  filter === "overdue" ? "bg-red-600 text-white shadow-2xl scale-105" : "text-slate-400 hover:text-red-600"
                }`}
                onClick={() => setFilter("overdue")}
              >
                Overdue
              </button>
            </div>

            <button 
              onClick={() => setShowRegistry(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-950 border-2 border-slate-950 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white transition-all duration-300 shadow-lg active:scale-95"
            >
              <FiShield className="text-lg" />
              View Success Registry
            </button>
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
        {booksToDisplay.length > 0 ? (
          <div className="overflow-x-auto rounded-[2.5rem] bg-white/70 backdrop-blur-sm shadow-2xl border-8 border-white p-6">
            <table className="min-w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[12px] font-black text-slate-950 uppercase tracking-[0.3em]">
                  <th className="px-8 py-6 text-left border-b-2 border-slate-950">ID</th>
                  <th className="px-8 py-6 text-left border-b-2 border-slate-950">Email Address</th>
                  <th className="px-8 py-6 text-left border-b-2 border-slate-950">Book Title</th>
                  <th className="px-8 py-6 text-center border-b-2 border-slate-950">Price</th>
                  <th className="px-8 py-6 text-center border-b-2 border-slate-950">Timeline</th>
                  <th className="px-8 py-6 text-center border-b-2 border-slate-950">Operation</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr key={index} className="group hover:scale-[1.01] transition-all duration-200">
                    <td className="px-8 py-7 bg-white first:rounded-l-[2rem] border-y-8 border-[#F1F5F9] text-base font-black text-slate-950">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-8 py-7 bg-white border-y-8 border-[#F1F5F9] text-sm font-bold text-slate-600 lowercase">
                      {book?.user?.email}
                    </td>
                    <td className="px-8 py-7 bg-white border-y-8 border-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FiBookOpen className="text-blue-600 text-base" />
                        </div>
                        <span className="text-sm font-[1000] text-slate-950 uppercase tracking-tight">
                          {book?.book?.title || "Book Not Found"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7 bg-white border-y-8 border-[#F1F5F9] text-center">
                      <span className="text-base font-black text-slate-950">₹{book?.price}</span>
                    </td>
                    <td className="px-8 py-7 bg-white border-y-8 border-[#F1F5F9] text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-tight ${filter === 'overdue' ? 'text-red-600' : 'text-slate-950'}`}>
                             <FiCalendar size={14}/> {formatDate(book.dueDate)}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                             <FiClock size={12}/> {formatTime(book.dueDate)}
                          </div>
                        </div>
                    </td>
                    <td className="px-8 py-7 bg-white last:rounded-r-[2rem] border-y-8 border-[#F1F5F9] text-center">
                        <button
                          onClick={() => openReturnBookPopup(book.book, book?.user?.email)}
                          className="inline-flex items-center justify-center gap-3 bg-slate-950 text-white px-8 py-3.5 rounded-xl hover:bg-blue-600 transition-all active:scale-95 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                        >
                            <PiKeyReturnBold size={18} /> Process Return
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-20 py-32 flex flex-col items-center bg-white/80 backdrop-blur-md rounded-[4rem] border-4 border-white shadow-2xl">
            <FiInbox size={60} className="text-slate-100 mb-6" />
            <h3 className="text-3xl font-black text-slate-950 uppercase tracking-[0.3em]">No Active Assets</h3>
          </div>
        )}

        {/* --- SUCCESS REGISTRY POPUP (MODAL) --- */}
        {showRegistry && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] p-10 shadow-2xl relative border-4 border-white">
              <button 
                onClick={() => setShowRegistry(false)}
                className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-red-600 hover:text-white rounded-full transition-all"
              >
                <FiX size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-950 flex items-center gap-4">
                  <FiCheckCircle className="text-green-600" /> Success Registry <span className="text-green-600">.</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Returned Books History</p>
              </div>

              <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {successRegistryBooks.length > 0 ? (
                  <div className="space-y-4">
                    {successRegistryBooks.map((item, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                            <FiBookOpen className="text-blue-600 text-2xl" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</p>
                            <h4 className="text-base font-[1000] text-slate-950 uppercase tracking-tight truncate max-w-[250px]">{item?.book?.title || "Unknown Book"}</h4>
                            <p className="text-xs font-bold text-slate-500 lowercase">{item?.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-8 md:gap-1 text-left md:text-right">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Returned Date</p>
                            <p className="text-sm font-black text-slate-950 uppercase">{formatDate(item.returnDate)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Timestamp</p>
                            <p className="text-xs font-bold text-slate-600">{formatTime(item.returnDate)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] italic text-slate-400 font-bold uppercase text-xs tracking-widest">
                    No return history found.
                  </div>
                )}
              </div>
              <div className="mt-8">
                 <button onClick={() => setShowRegistry(false)} className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-colors">Close Registry</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {returnBookPopup && <ReturnBookPopup bookId={borrowedBookId} email={email} />}
    </>
  );
};

export default Catalog;