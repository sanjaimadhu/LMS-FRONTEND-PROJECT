import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import AddFinePopup from "../popups/AddFinePopup";
import { FiSearch, FiX, FiCalendar, FiClock } from "react-icons/fi";
import { LuHistory } from "react-icons/lu"; 
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";

const FineManagement = () => {
  const dispatch = useDispatch();
  const { allBorrowedBooks } = useSelector((state) => state.borrow);

  const [loadingEmail, setLoadingEmail] = useState(null);
  const [loadingClear, setLoadingClear] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFinePopup, setShowFinePopup] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [isHistoryView, setIsHistoryView] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  const activeFines = useMemo(() => {
    if (!allBorrowedBooks) return [];

    const today = new Date();
    
    return allBorrowedBooks.map(borrow => {
      let currentFine = Number(borrow.fine) || 0;

      if (!borrow.returnDate) {
        const dueDate = new Date(borrow.dueDate);
        if (today > dueDate) {
          const diffTime = today - dueDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          currentFine = diffDays * 10; 
        }
      }

      return { ...borrow, fine: currentFine };
    }).filter((borrow) => {
      const fineValue = borrow.fine;
      const statusMatch = isHistoryView ? fineValue === 0 : fineValue > 0;

      const searchLower = searchTerm.toLowerCase();
      const bookTitle = borrow.book?.title || "BOOK NOT FOUND";
      
      const matchesSearch =
        borrow.user?.name?.toLowerCase().includes(searchLower) ||
        bookTitle.toLowerCase().includes(searchLower) ||
        borrow.user?.email?.toLowerCase().includes(searchLower);
        
      return statusMatch && matchesSearch;
    });

  }, [allBorrowedBooks, searchTerm, isHistoryView]);

  const totalFineAmount = activeFines.reduce((acc, curr) => acc + (Number(curr.fine) || 0), 0);

  const handleOpenFinePopup = (borrow) => {
    setSelectedBorrow(borrow);
    setShowFinePopup(true);
  };

  const handleMarkAsPaid = async (borrowId) => {
    if (!window.confirm("Are you sure this fine is paid?")) return;
    setLoadingClear(borrowId);
    try {
      const response = await axios.put(
        `${API_URL}/borrow/update-fine/${borrowId}`,
        { fine: 0 }, 
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Fine Cleared & Moved to History!");
        dispatch(fetchAllBorrowedBooks());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear fine.");
    } finally {
      setLoadingClear(null);
    }
  };

  const handleSendFine = async (borrowId, email, name, bookTitle, fineAmount, userId) => {
    const finalBookTitle = bookTitle || "BOOK NOT FOUND";
    if (!email) return toast.error("User email not found!");
    if (!userId) return toast.error("User ID not found! Cannot send notification.");
    
    setLoadingEmail(borrowId);
    try {
      await axios.put(
        `${API_URL}/borrow/update-fine/${borrowId}`,
        { fine: Number(fineAmount) },
        { withCredentials: true }
      );

      const response = await axios.post(
        `${API_URL}/notification/send-fine`,
        { 
          email, 
          userName: name, 
          bookTitle: finalBookTitle, 
          fineAmount: Number(fineAmount),
          userId: userId 
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Notification Sent to ${name}!`);
        dispatch(fetchAllBorrowedBooks());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sync fine.");
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    /* ADDED: Background image via style and Tailwind background utility classes */
    <main 
      className="relative flex-1 p-6 pt-28 min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(253, 252, 253, 0.92), rgba(253, 252, 253, 0.92)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      <Header />
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-tight">
              Penalty <span className="text-slate-950">{isHistoryView ? "History" : "Control"}</span>
            </h2>
          </div>

          <div className="relative w-full md:w-96 p-[2px] bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
            <div className="relative bg-white rounded-[14px] flex items-center">
              <FiSearch className="absolute left-4 text-red-500 text-xl" />
              <input
                type="text"
                placeholder="Search records..."
                className="w-full pl-12 pr-4 py-4 bg-transparent outline-none font-bold text-base text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Defaulters" count={activeFines.length} icon={usersIcon} color="bg-rose-100" textColor="text-rose-600" />
          <StatCard title="Total Fine" count={`₹${totalFineAmount}`} icon={bookIcon} color="bg-orange-100" textColor="text-orange-600" />
          
          <button 
            onClick={() => setIsHistoryView(!isHistoryView)}
            className={`group relative overflow-hidden p-8 rounded-[3rem] flex items-center justify-between border-4 transition-all duration-300 shadow-2xl hover:-translate-y-1 active:scale-95 ${
              isHistoryView 
              ? 'bg-slate-950 border-slate-800 text-white' 
              : 'bg-white border-white text-slate-950'
            }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isHistoryView ? 'bg-blue-400' : 'bg-purple-600'}`}></div>
            <div className="relative z-10 text-left">
              <h3 className="text-xl font-black italic tracking-tighter uppercase">
                {isHistoryView ? "View Active" : "View History"}
              </h3>
              <p className={`text-[11px] font-[1000] uppercase tracking-[0.2em] mt-1 ${isHistoryView ? 'text-blue-400' : 'text-slate-400'}`}>
                {isHistoryView ? "← Return to dashboard" : "See paid records →"}
              </p>
            </div>
            <div className={`relative z-10 p-4 rounded-2xl transition-transform duration-500 group-hover:rotate-12 ${isHistoryView ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <LuHistory className={`text-3xl ${isHistoryView ? 'text-blue-400' : 'text-purple-600'}`} />
            </div>
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden">
          <div className="overflow-x-auto p-6">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-950 text-[13px] font-[1000] uppercase tracking-[0.2em]">
                  <th className="py-4 px-8 border-b-2 border-slate-950">Member Name</th>
                  <th className="py-4 px-8 border-b-2 border-slate-950">Book Title</th>
                  <th className="py-4 px-8 text-center border-b-2 border-slate-950">Date & Time</th>
                  <th className="py-4 px-8 text-center border-b-2 border-slate-950">Fine Amount</th>
                  <th className="py-4 px-8 text-center border-b-2 border-slate-950">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeFines.map((borrow) => (
                  <tr key={borrow._id} className="group hover:scale-[1.01] transition-all duration-200">
                    <td className="py-7 px-8 bg-white first:rounded-l-[2rem] border-y-8 border-transparent">
                      <p className="font-[1000] text-slate-950 text-base uppercase tracking-tight">{borrow.user?.name}</p>
                    </td>
                    <td className="py-7 px-8 bg-white border-y-8 border-transparent">
                      <span className="font-bold text-slate-500 text-sm">{borrow.book?.title || "BOOK NOT FOUND"}</span>
                    </td>
                    
                    <td className="py-7 px-8 bg-white border-y-8 border-transparent text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2 font-[1000] text-slate-900 text-sm">
                          <FiCalendar className="text-blue-500" size={16}/>
                          {new Date(borrow.updatedAt || borrow.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                          <FiClock size={14}/>
                          {new Date(borrow.updatedAt || borrow.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>

                    <td className="py-7 px-8 bg-white border-y-8 border-transparent text-center">
                      <span className={`${isHistoryView ? 'bg-green-50 text-green-600 border-green-100' : 'bg-rose-50 text-rose-600 border-rose-100'} px-6 py-3 rounded-2xl font-[1000] text-base border shadow-sm`}>
                        {isHistoryView ? "PAID" : `₹${borrow.fine}`}
                      </span>
                    </td>
                    <td className="py-7 px-8 bg-white last:rounded-r-[2rem] border-y-8 border-transparent text-center">
                      <div className="flex items-center justify-center gap-4">
                        {!isHistoryView ? (
                          <>
                            <button onClick={() => handleOpenFinePopup(borrow)} className="text-[11px] font-[1000] text-orange-500 hover:text-orange-600 tracking-[0.2em] border-b-2 border-transparent hover:border-orange-500 transition-all">
                              ALTER
                            </button>
                            <button
                              onClick={() => handleMarkAsPaid(borrow._id)}
                              className="bg-green-600 text-white px-6 py-3 rounded-xl text-[11px] font-[1000] tracking-widest hover:bg-green-700 transition-all shadow-lg"
                            >
                              {loadingClear === borrow._id ? "..." : "MARK AS PAID"}
                            </button>

                            <button
                              onClick={() => handleSendFine(
                                borrow._id, 
                                borrow.user?.email, 
                                borrow.user?.name, 
                                borrow.book?.title, 
                                borrow.fine,
                                borrow.user?._id || borrow.user?.id
                              )}
                              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[11px] font-[1000] tracking-widest hover:bg-blue-700 transition-all shadow-lg"
                            >
                              {loadingEmail === borrow._id ? "..." : "SEND MESSAGE"}
                            </button>

                            <button
                              onClick={() => handleSendFine(
                                borrow._id, 
                                borrow.user?.email, 
                                borrow.user?.name, 
                                borrow.book?.title, 
                                borrow.fine,
                                borrow.user?._id || borrow.user?.id
                              )}
                              className="bg-slate-950 text-white px-6 py-3 rounded-xl text-[11px] font-[1000] tracking-widest hover:bg-red-600 transition-all shadow-lg"
                            >
                              {loadingEmail === borrow._id ? "..." : "ALERT"}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-black text-slate-400 tracking-[0.1em] uppercase italic">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activeFines.length === 0 && (
              <div className="text-center py-16 font-black text-slate-300 text-xl uppercase tracking-[0.3em]">No Records Found</div>
            )}
          </div>

          {isHistoryView && (
            <div className="p-10 flex justify-center border-t-2 border-slate-50 bg-slate-50/50">
              <button
                onClick={() => setIsHistoryView(false)}
                className="group flex items-center gap-3 bg-white text-slate-950 border-4 border-slate-950 px-12 py-4 rounded-2xl text-[12px] font-[1000] tracking-[0.2em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <FiX className="text-xl" />
                CLOSE HISTORY
              </button>
            </div>
          )}
        </div>
      </div>

      {showFinePopup && selectedBorrow && (
        <AddFinePopup
          borrowId={selectedBorrow._id}
          userName={selectedBorrow.user?.name}
          bookTitle={selectedBorrow.book?.title || "BOOK NOT FOUND"}
          onClose={() => setShowFinePopup(false)}
        />
      )}
    </main>
  );
};

const StatCard = ({ title, count, icon, color, textColor }) => (
  <div className="flex items-center gap-8 bg-white/90 backdrop-blur-sm p-10 rounded-[3rem] border-4 border-white shadow-xl">
    <div className={`w-20 h-20 ${color} rounded-3xl flex items-center justify-center shadow-inner`}>
      <img src={icon} alt="" className="w-10 h-10" />
    </div>
    <div>
      <h4 className={`font-black text-4xl tracking-tighter ${textColor}`}>{count}</h4>
      <p className="font-black text-slate-400 text-[12px] uppercase tracking-widest mt-1">{title}</p>
    </div>
  </div>
);

export default FineManagement;
