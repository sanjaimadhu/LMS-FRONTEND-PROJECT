import React, { useState, useMemo } from "react";
import { BookA, Star } from "lucide-react"; 
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("returned");

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    if (book) {
      setReadBook(book);
      dispatch(toggleReadBookPopup());
    }
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const booksToDisplay = useMemo(() => {
    if (!userBorrowedBooks) return [];
    return userBorrowedBooks.filter((book) =>
      filter === "returned" ? book.returned === true : book.returned === false
    );
  }, [userBorrowedBooks, filter]);

  return (
    <>
      {/* Updated: Main tag now includes background image styling */}
      <main 
        className="relative flex-1 p-6 pt-28 min-h-screen bg-gray-50 font-sans tracking-tight bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(249, 250, 251, 0.9)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')` 
        }}
      >
        <Header />

        <header className="flex flex-col gap-3 mb-6 md:flex-row md:justify-between md:items-center">
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">
            My Borrowed <span className="text-indigo-600">Books</span>
          </h2>
        </header>

        {/* Filter Tabs */}
        <div className="flex mb-8 bg-gray-200/50 backdrop-blur-md p-1 rounded-2xl w-fit">
          <button
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "returned" ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setFilter("returned")}
          >
            Returned
          </button>
          <button
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "nonReturned" ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setFilter("nonReturned")}
          >
            Pending
          </button>
        </div>

        {booksToDisplay.length > 0 ? (
          <div className="overflow-hidden bg-white/80 backdrop-blur-md rounded-[2rem] shadow-xl border-8 border-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 px-4">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-6 py-6 text-left">#</th>
                    <th className="px-6 py-6 text-left">Book Title</th>
                    <th className="px-6 py-6 text-left">Borrowed</th>
                    <th className="px-6 py-6 text-left">Due Date</th>
                    <th className="px-6 py-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {booksToDisplay.map((book, index) => (
                    <tr key={book._id || index} className="group hover:bg-white transition-all duration-300">
                      <td className="px-6 py-4 text-sm font-black text-slate-300">#{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-800 uppercase tracking-tight">{book.bookTitle}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 italic">{formatDate(book.borrowedDate)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 italic">{formatDate(book.dueDate)}</td>
                      <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                        <button 
                          onClick={() => openReadPopup(book.bookId)}
                          className="p-2 bg-slate-100 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                          title="View Details"
                        >
                          <BookA className="w-4 h-4" />
                        </button>

                        {/* Review Button Logic */}
                        {book.returned && (
                          <button 
                            onClick={() => openReadPopup(book.bookId)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-200"
                          >
                            <Star className="w-3 h-3 fill-black" />
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-white/50 backdrop-blur-sm rounded-[2rem] border-4 border-dashed border-slate-200">
            <h3 className="text-slate-400 font-black uppercase tracking-[0.3em]">No Records Found</h3>
          </div>
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;