import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiTrash2, FiMessageSquare, FiStar, FiBarChart2, FiX, FiMail, FiCalendar, FiUser, FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const ReviewManagement = () => {
  const [bookId, setBookId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  
  // User Profile Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/book/all`, { withCredentials: true });
        setAllBooks(data.books || data);
      } catch (error) {
        toast.error("Failed to fetch books list!");
      }
    };
    fetchAllBooks();
  }, []);

  const fetchReviews = async (selectedId) => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/book/reviews?id=${selectedId}`, { withCredentials: true });
      setReviews(data.reviews || []);
    } catch (error) {
      toast.error("Error loading reviews!");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (id) => {
    setBookId(id);
    fetchReviews(id);
  };

  const deleteReviewHandler = async (reviewId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/book/reviews/delete?bookId=${bookId}&reviewId=${reviewId}`, { withCredentials: true });
      toast.success("Review deleted!");
      fetchReviews(bookId);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const getPhoto = (rev) => {
    if (!rev) return null;
    if (rev.user && rev.user.avatar) return rev.user.avatar.url;
    if (rev.userAvatar) return rev.userAvatar;
    return null;
  };

  const getEmail = (rev) => {
    if (!rev) return "No Email";
    if (rev.user && typeof rev.user === 'object' && rev.user.email) {
      return rev.user.email;
    }
    if (rev.userEmail) {
      return rev.userEmail;
    }
    return "Email not found";
  };

  const openUserProfile = (review) => {
    setSelectedUser(review);
    setIsModalOpen(true);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-10 pt-28 font-sans w-full text-left relative"
      style={{ 
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.9)), url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      
      {/* HEADER */}
      <div className="w-full mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 relative z-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Review <span className="text-red-600">Audit</span></h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm">
              <FiMessageSquare className="text-blue-500" /> <span className="text-[11px] font-black uppercase">{reviews.length} Feedbacks</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm">
              <FiStar className="text-yellow-500" /> <span className="text-[11px] font-black uppercase">{avgRating} Avg</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[500px] flex gap-2">
          <select 
            className="flex-1 bg-white/90 backdrop-blur-sm border-2 border-slate-100 p-4 rounded-2xl shadow-lg outline-none font-bold text-sm" 
            value={bookId} 
            onChange={(e) => handleBookSelect(e.target.value)}
          >
            <option value="">Choose a Book...</option>
            {allBooks.map((book) => <option key={book._id} value={book._id}>{book.title}</option>)}
          </select>
          <button onClick={() => fetchReviews(bookId)} className="bg-slate-950 text-white px-6 rounded-2xl hover:bg-red-600 transition-all shadow-lg"><FiSearch size={20} /></button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Reviewer</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">User Opinion</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reviews.length > 0 ? reviews.map((rev) => {
                const userPhoto = getPhoto(rev);

                return (
                  <tr key={rev._id} className="hover:bg-blue-50/80 transition-colors group cursor-pointer" onClick={() => openUserProfile(rev)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white group-hover:border-blue-500 transition-all shadow-sm">
                          <img 
                            src={userPhoto || `https://ui-avatars.com/api/?name=${rev.userName}&background=random&color=fff`} 
                            className="w-full h-full object-cover" 
                            alt="user"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${rev.userName}&background=random&color=fff`; }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600">{rev.userName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <span className="text-yellow-500 font-bold">★ {rev.rating}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-600 italic font-medium leading-relaxed">"{rev.comment}"</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={(e) => { e.stopPropagation(); deleteReviewHandler(rev._id); }} className="p-3 bg-rose-50/80 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" className="py-40 text-center text-slate-400 font-black uppercase tracking-widest"><FiBarChart2 size={40} className="mx-auto mb-4 opacity-50" /> No reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (User Profile) */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-red-500 hover:text-white rounded-full transition-all z-20 text-slate-800 shadow-md">
              <FiX size={20} />
            </button>
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full"></div>
            <div className="px-8 pb-10 -mt-16 relative">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-[2rem] border-4 border-white bg-white overflow-hidden shadow-xl mb-4">
                  <img 
                    src={getPhoto(selectedUser) || `https://ui-avatars.com/api/?name=${selectedUser.userName}&size=200&background=random`} 
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedUser.userName}</h3>
                {/* ROLE ADDED HERE */}
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">{selectedUser.user?.role || "Subscriber"}</p>
              </div>

              <div className="space-y-3">
                {/* EMAIL */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><FiMail size={18}/></div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{getEmail(selectedUser)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {/* GENDER */}
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm border border-slate-100"><FiUser size={14}/></div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                        <p className="text-xs font-bold text-slate-700 capitalize">{selectedUser.user?.gender || "Not Set"}</p>
                      </div>
                   </div>
                   {/* PHONE */}
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm border border-slate-100"><FiPhone size={14}/></div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                        <p className="text-xs font-bold text-slate-700">{selectedUser.user?.phone || "N/A"}</p>
                      </div>
                   </div>
                </div>

                {/* BIRTHDAY */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100"><FiCalendar size={18}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                    <p className="text-sm font-bold text-slate-700">
                       {selectedUser.user?.dob ? new Date(selectedUser.user.dob).toLocaleDateString('en-GB') : "Not Disclosed"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
