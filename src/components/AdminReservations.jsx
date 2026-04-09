import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Book, Hash, Bell, Clock, ShieldCheck, Trash2 } from "lucide-react";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllReservations = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/book/admin/reservations", 
        { withCredentials: true }
      );
      setReservations(data.reservations);
    } catch (error) {
      toast.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (window.confirm("Are you sure you want to clear this reservation record?")) {
      try {
        await axios.delete(`http://localhost:4000/api/v1/book/admin/reservation/${id}`, {
          withCredentials: true,
        });
        toast.success("Reservation cleared");
        fetchAllReservations(); 
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to clear reservation");
      }
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const notifiedCount = reservations.reduce((acc, resUser) => {
    const readyBooks = resUser.reservedBooks.filter(book => book.quantity > 0).length;
    return acc + readyBooks;
  }, 0);

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-black text-slate-400 animate-pulse uppercase tracking-widest bg-slate-50">
      Fetching System Records...
    </div>
  );

  return (
    /* ADDED: Background Image with Fixed position and Linear Gradient Overlay */
    <div className="relative p-6 md:p-12 min-h-screen w-full flex-1 flex flex-col bg-cover bg-fixed bg-center"
         style={{ backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.96), rgba(248, 250, 252, 0.96)), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop')` }}>
      
      <header className="mb-10 flex items-center justify-between w-full relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-indigo-600 w-8 h-8" /> 
            Global Reservations
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase mt-1 tracking-widest">
            Notification Tracking & Waitlist Management
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-3xl shadow-sm border border-slate-200 text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Users Waiting</p>
               <p className="text-2xl font-black text-indigo-600 leading-none">{reservations.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-3xl shadow-sm border border-slate-200 text-center border-l-4 border-l-emerald-500">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Ready Notifications</p>
               <p className="text-2xl font-black text-emerald-600 leading-none">{notifiedCount}</p>
            </div>
        </div>
      </header>

      {reservations.length > 0 ? (
        /* Card container-la minor bg-white/90 glass effect add panniruken image theriyanumrathukaaga */
        <div className="w-full overflow-hidden bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-[0.2em]">
                <th className="p-6 font-black">User Profile</th>
                <th className="p-6 font-black">Reserved Book Details</th>
                <th className="p-6 font-black">System Notification Status</th>
                <th className="p-6 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((resUser) => (
                <tr key={resUser._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-4 rounded-2xl text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{resUser.name}</p>
                        <p className="text-slate-400 font-bold text-[10px] lowercase">{resUser.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 align-top">
                    <div className="space-y-3">
                      {resUser.reservedBooks.map((book) => (
                        <div key={book._id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <Book className="w-4 h-4 text-indigo-500" />
                             <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                               {book.title}
                             </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 ml-6 uppercase">
                            ISBN: {book.ISBN} | Stock: {book.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-6 align-top">
                    <div className="space-y-3">
                      {resUser.reservedBooks.map((book) => (
                        <div key={book._id} className="flex items-center">
                          {book.quantity > 0 ? (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 animate-pulse">
                              <Bell className="w-4 h-4 fill-emerald-600" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase">Notified</span>
                                <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">User can pickup now</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl border border-slate-100">
                              <Clock className="w-4 h-4" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase">Queued</span>
                                <span className="text-[9px] font-bold uppercase tracking-tighter">Waiting for Return</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-6 align-top text-center">
                    <button 
                      onClick={() => deleteReservation(resUser._id)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 group/btn"
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white/80 backdrop-blur-md rounded-[3.5rem] border-2 border-dashed border-slate-200 w-full relative z-10">
          <div className="p-10 bg-slate-50 rounded-full mb-6">
             <Hash className="w-16 h-16 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Clear Registry</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">No users are currently on the waitlist.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;