import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { BookOpen, Hash, X, Info, CheckCircle, Clock, BookmarkX } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const MyReservedBooks = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  const fetchReserved = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/book/my-reserved-books`, { withCredentials: true });
      setReservedBooks(data.reservedBooks);

      const autoOpenId = location.state?.openBookId;
      if (autoOpenId && data.reservedBooks) {
        const bookToOpen = data.reservedBooks.find(b => b._id === autoOpenId);
        if (bookToOpen) {
          setSelectedBook(bookToOpen);
        }
      }
    } catch (error) {
      toast.error("Error fetching reserved books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReserved();
  }, [location.state]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await axios.put(`${API_URL}/book/cancel-reservation/${id}`, {}, { withCredentials: true });
      toast.success("Reservation cancelled");
      fetchReserved();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-slate-400 font-bold animate-pulse uppercase tracking-widest bg-slate-50">Updating Records...</div>;

  return (
    /* ADDED: Background image via inline style + Tailwind utility classes */
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-10 pt-28 font-sans tracking-tight w-full"
      style={{ 
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.93), rgba(248, 250, 252, 0.95)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')` 
      }}
    >
      <div className="w-full relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-tighter">
            My Reservations
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Real-time availability of your waitlisted books.</p>
        </header>

        {reservedBooks?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {reservedBooks.map((book) => (
              /* CARD: Added backdrop-blur for glass effect over background */
              <div 
                key={book._id} 
                className={`group relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border-2 transition-all duration-500 hover:-translate-y-2 ${
                  book.quantity > 0 ? "border-emerald-200 shadow-emerald-50" : "border-white/50 hover:border-indigo-300"
                }`}
              >
                {/* Status Badges */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${book.quantity > 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100/50 text-slate-400"}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  {book.quantity > 0 ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> READY TO PICKUP
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-black px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> IN QUEUE
                    </span>
                  )}
                </div>

                {/* Book Info */}
                <div onClick={() => setSelectedBook(book)} className="cursor-pointer">
                  <h3 className="text-lg font-black text-slate-800 uppercase truncate group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-slate-400 font-bold text-xs mt-1 mb-4 uppercase tracking-wide">BY {book.author}</p>
                </div>

                {book.quantity > 0 && (
                  <div className="mt-4 p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200 animate-pulse">
                    <p className="text-[10px] font-black uppercase tracking-widest text-center">
                      🌟 Take this to the counter!
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                   <button 
                    onClick={() => setSelectedBook(book)}
                    className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest"
                   >
                     <Info className="w-4 h-4" /> View Info
                   </button>
                   
                   <button 
                    onClick={() => handleCancel(book._id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    title="Cancel Reservation"
                   >
                     <BookmarkX className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white/50 backdrop-blur-sm rounded-[3rem] shadow-sm border-2 border-dashed border-slate-200">
             <div className="p-8 bg-white/80 rounded-full mb-6 shadow-sm">
                <Hash className="w-16 h-16 text-slate-200" />
             </div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Shelf is empty</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Reservations Found.</p>
          </div>
        )}
      </div>

      {/* POPUP / MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className={`h-24 p-8 flex items-end ${selectedBook.quantity > 0 ? "bg-emerald-500" : "bg-indigo-600"}`}>
                <button onClick={() => setSelectedBook(null)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white uppercase">Reservation Detail</h2>
            </div>

            <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Current Status</label>
                  <p className={`text-lg font-black ${selectedBook.quantity > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                    {selectedBook.quantity > 0 ? "✓ READY FOR BORROWING" : "⏳ WAITING FOR STOCK"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Book ISBN</label>
                    <p className="font-bold text-slate-700">{selectedBook.ISBN || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Count</label>
                    <p className="font-bold text-slate-700">{selectedBook.quantity} Available</p>
                  </div>
                </div>

                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                   <h4 className="text-indigo-900 font-black uppercase text-[10px] mb-2 tracking-tighter">Book Description</h4>
                   <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-3">
                     {selectedBook.description || "No description available for this book."}
                   </p>
                </div>

                <button 
                  onClick={() => setSelectedBook(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                >
                  Done
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservedBooks;
