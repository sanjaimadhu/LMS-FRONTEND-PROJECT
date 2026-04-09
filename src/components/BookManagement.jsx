import React, { useState, useEffect } from "react";
import { BookA, NotebookPen, PencilLine, Plus, Search, Trash2, Hash, BookmarkPlus, BookOpen, Banknote } from "lucide-react"; 
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { 
  toggleAddBookPopup, 
  toggleReadBookPopup, 
  toggleRecordBookPopup, 
  toggleUpdateBookPopup 
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";

// Components & Popups
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import UpdateBookPopup from "../popups/UpdateBookPopup";

const API_URL = import.meta.env.VITE_API_URL;
const BookManagement = () => {
  const dispatch = useDispatch();

  // Redux States
  const { books, message, error } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup, updateBookPopup } = useSelector((state) => state.popup);
  const { message: borrowSliceMessage, error: borrowSliceError } = useSelector((state) => state.borrow);

  // Local States
  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [selectedBookForUpdate, setSelectedBookForUpdate] = useState(null);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  // --- Image & Title kaga pudhu State ---
  const [selectedBookForPopup, setSelectedBookForPopup] = useState(null);

  const openReadPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book); 
    dispatch(toggleReadBookPopup());
  };

  // --- Idhai mattum update panniruken (Passing whole book object) ---
  const openRecordBookPopup = (book) => {
    setBorrowBookId(book._id);
    setSelectedBookForPopup(book); 
    dispatch(toggleRecordBookPopup());
  };

  const openUpdatePopup = (book) => {
    setSelectedBookForUpdate(book);
    dispatch(toggleUpdateBookPopup());
  };

  const handleReserveBook = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/book/reserve/${id}`, 
        {}, 
        { withCredentials: true }
      );
      toast.success(data.message);
      dispatch(fetchAllBooks());
    } catch (error) {
      toast.error(error.response?.data?.message || "Reservation failed");
    }
  };

  useEffect(() => {
    dispatch(fetchAllBooks()); 
  }, [dispatch]);

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, borrowSliceMessage, borrowSliceError]);

  const searchedBooks = books?.filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword) || 
    book.author.toLowerCase().includes(searchedKeyword) ||
    book.ISBN?.toLowerCase().includes(searchedKeyword)
  ) || [];

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 min-h-screen overflow-x-hidden">
        
        {/* Background Image Layer */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')`, 
          }}
        >
          <div className="absolute inset-0 bg-[#f8fafc]/90 backdrop-blur-[3px]"></div>
        </div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full -mr-64 -mt-64 blur-[100px] -z-10"></div>
        
        <Header />
        
        <div className="relative z-10">
          <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-16">
            <div>
             <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-tight">
                {user?.role === "Admin" ? "Vault Management" : "Curated Collection"}
              </h2>
              <div className="h-1.5 w-20 bg-indigo-600 mt-4 rounded-full"></div>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-4 opacity-70">
                Premium Digital Library Access
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-80 group">
                <div className="absolute inset-0 bg-indigo-300 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl flex items-center shadow-xl shadow-gray-200/50">
                  <Search className="absolute left-4 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Find your next read..."
                    className="w-full pl-11 pr-4 py-4 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    onChange={(e) => setSearchedKeyword(e.target.value.toLowerCase())}
                  />
                </div>
              </div>

              {isAuthenticated && user?.role === "Admin" && (
                <button
                  onClick={() => dispatch(toggleAddBookPopup())}
                  className="flex items-center gap-2 bg-black hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-2xl shadow-indigo-100 active:scale-95"
                >
                  <Plus className="w-4 h-4" /> 
                  <span>Catalog New Asset</span>
                </button>
              )}
            </div>
          </header>

          {searchedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
              {searchedBooks.map((book) => (
                <div key={book._id} className="group relative bg-white/80 backdrop-blur-md rounded-[3rem] border border-white shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 overflow-hidden flex flex-col h-full">
                  
                  <div className="relative h-72 overflow-hidden bg-slate-50">
                     {(() => {
                        const imageSource = book.bookImage?.url || book.image?.url || (typeof book.bookImage === 'string' ? book.bookImage : null);
                        
                        return imageSource ? (
                          <img 
                            src={imageSource} 
                            alt={book.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50">
                            <BookOpen className="w-16 h-16 text-indigo-100" />
                          </div>
                        );
                     })()}
                     
                     <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-xl border border-white">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[12px] font-black text-slate-800">₹{book.price || "0"}</span>
                     </div>

                     <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                        book.quantity > 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                     }`}>
                        {book.quantity > 0 ? "In Stock" :"Out Of Stock"}
                     </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                     <div className="flex items-center gap-2 mb-4">
                        <Hash className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{book.ISBN || "No ISBN"}</span>
                     </div>
                     
                     <h3 className="text-xl font-black text-slate-800 tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase italic">
                        {book.title}
                     </h3>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-2 mb-6 opacity-60">by {book.author}</p>

                     <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stock</span>
                          <span className="text-xl font-black text-slate-800">{book.quantity}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {user?.role === "Admin" ? (
                            <>
                              <button onClick={() => openReadPopup(book._id)} className="p-3 bg-gray-50 text-slate-400 rounded-2xl hover:bg-black hover:text-white transition-all duration-300">
                                <BookOpen className="w-4 h-4" />
                              </button>
                              <button onClick={() => openUpdatePopup(book)} className="p-3 bg-gray-50 text-slate-400 rounded-2xl hover:bg-amber-500 hover:text-white transition-all duration-300">
                                <PencilLine className="w-4 h-4" />
                              </button>
                              <button onClick={() => dispatch(deleteBook(book._id))} className="p-3 bg-gray-50 text-slate-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {/* --- Inga openRecordBookPopup-kku 'book' object-ah anuppura maadhiri mathi iruken --- */}
                              <button onClick={() => openRecordBookPopup(book)} className="ml-2 p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-90">
                                <NotebookPen className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex gap-2">
                               <button onClick={() => openReadPopup(book._id)} className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-lg">
                                 View Details
                               </button>
                               {book.quantity === 0 && (
                                 <button onClick={() => handleReserveBook(book._id)} className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                   <BookmarkPlus className="w-4 h-4" />
                                 </button>
                               )}
                            </div>
                          )}
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-20 py-32 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md border-2 border-dashed border-white/50 rounded-[4rem] relative z-10">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse mb-8 border border-indigo-100">
                   <BookA className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] text-center italic">
                   {searchedKeyword ? "No matches found in the vault" : "The Curated Catalog is empty"}
                </h3>
            </div>
          )}
        </div>
      </main>

      {/* Popups */}
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      
      {/* --- Inga 'bookImage' matrum 'bookTitle' pass panniruken --- */}
      {recordBookPopup && (
        <RecordBookPopup 
          bookId={borrowBookId} 
          bookImage={selectedBookForPopup?.bookImage?.url || selectedBookForPopup?.image?.url || selectedBookForPopup?.bookImage} 
          bookTitle={selectedBookForPopup?.title} 
        />
      )}
      
      {updateBookPopup && <UpdateBookPopup book={selectedBookForUpdate} />}
    </>
  );
};

export default BookManagement;
