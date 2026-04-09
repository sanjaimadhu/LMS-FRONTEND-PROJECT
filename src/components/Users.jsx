import React from "react";
import { useSelector } from "react-redux";
import { FiUsers } from "react-icons/fi"; 
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      {/* ADDED: Background image via style and background properties via className */}
      <main 
        className="relative flex-1 p-6 pt-28 bg-[#F8FAFC] bg-cover bg-center bg-no-repeat bg-fixed min-h-screen font-sans tracking-tight"
        style={{ 
          backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.85), rgba(248, 250, 252, 0.85)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')` 
        }}
      >
        <Header />
        
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-3xl font-black text-black uppercase tracking-tight">           
            Registered <span className="text-indigo-600">Users</span>
          </h2>
        </header>

        {users && users.filter((u) => u.role === "User").length > 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] border-8 border-white overflow-hidden mt-6 animate-in zoom-in-95 duration-700">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 px-6">
                <thead>
                  <tr className="text-slate-950">
                    <th className="px-6 py-8 text-left text-[13px] font-black uppercase tracking-[0.2em] opacity-60"># No.</th>
                    <th className="px-6 py-8 text-left text-[13px] font-black uppercase tracking-[0.2em] opacity-60">User Profile</th>
                    <th className="px-6 py-8 text-left text-[13px] font-black uppercase tracking-[0.2em] opacity-60">Email Address</th>
                    <th className="px-6 py-8 text-left text-[13px] font-black uppercase tracking-[0.2em] opacity-60">Role</th>
                    <th className="px-6 py-8 text-center text-[13px] font-black uppercase tracking-[0.2em] opacity-60">Total Borrowed</th>
                    {/* New Column: Items currently in possession */}
                    <th className="px-6 py-8 text-center text-[13px] font-black uppercase tracking-[0.2em] opacity-60 text-indigo-600">Currently Holding</th>
                    <th className="px-6 py-8 text-left text-[13px] font-black uppercase tracking-[0.2em] opacity-60">Registered On</th>
                  </tr>
                </thead>

                <tbody className="animate-in fade-in duration-1000 delay-300">
                  {users
                    .filter((u) => u.role === "User")
                    .map((user, index) => {
                      // Filtering books that have not been returned yet
                      const currentHolding = user?.borrowedBooks?.filter(b => b.returned === false).length || 0;

                      return (
                        <tr 
                          key={user._id} 
                          className="group hover:bg-slate-50 transition-all duration-500 cursor-default"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <td className="px-6 py-8 bg-white first:rounded-l-3xl group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] transition-all">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[14px] font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                               {String(index + 1).padStart(2, '0')}
                            </div>
                          </td>

                          <td className="px-6 py-8 bg-white group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] transition-all">
                            <div className="flex items-center gap-5">
                              <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:border-indigo-100 transition-all transform group-hover:scale-105 duration-300">
                                {user.avatar?.url ? (
                                  <img 
                                    src={user.avatar.url} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl uppercase">
                                    {user.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="text-[17px] font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                                 {user.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-8 bg-white group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] transition-all">
                            <span className="text-[15px] font-bold text-slate-500 group-hover:text-slate-950 transition-colors italic lowercase">
                              {user.email}
                            </span>
                          </td>

                          <td className="px-6 py-8 bg-white group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] transition-all">
                            <span className="px-5 py-2 bg-slate-100 text-[11px] font-black text-slate-600 rounded-xl uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {user.role}
                            </span>
                          </td>

                          <td className="px-6 py-8 bg-white group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] text-center transition-all">
                            <span className="relative inline-block text-[14px] font-black text-slate-950 bg-slate-100 px-5 py-1.5 rounded-2xl shadow-sm italic group-hover:bg-slate-200 transition-transform">
                              {user?.borrowedBooks?.length || 0} Books
                            </span>
                          </td>

                          {/* Data Column: Current active count */}
                          <td className="px-6 py-8 bg-white group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] text-center transition-all">
                            <span className={`relative inline-block text-[14px] font-black px-5 py-1.5 rounded-2xl shadow-lg italic group-hover:scale-110 transition-transform ${currentHolding >= 3 ? 'bg-red-500 text-white shadow-red-100' : 'bg-yellow-400 text-slate-950 shadow-yellow-100'}`}>
                              {currentHolding} / 3 Active
                            </span>
                          </td>

                          <td className="px-6 py-8 bg-white last:rounded-r-3xl group-hover:bg-slate-50 border-y-8 border-[#F8FAFC] transition-all">
                            <span className="text-[13px] font-black text-slate-500 group-hover:text-slate-950 uppercase tracking-tight transition-colors">
                              {formatDate(user.createdAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-20 py-24 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
             <div className="w-24 h-24 bg-white shadow-2xl shadow-slate-200 rounded-[2.5rem] flex items-center justify-center animate-bounce border-4 border-slate-50">
                <FiUsers className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-lg font-black text-slate-300 uppercase tracking-[0.3em] mt-8">Database Empty</h3>
             <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest">No Authorized Users Detected</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Users;