import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleUpdateProfilePopup } from "../store/slices/popUpSlice";
import { MdEmail, MdPhone, MdCake, MdMale, MdFingerprint, MdBadge } from "react-icons/md";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')`, // Oru neat Library abstract image
        }}
      >
        {/* Soft white/blue overlay to keep the modern look */}
        <div className="absolute inset-0 bg-[#f8fafc]/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content (z-10 to stay above background) */}
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="mx-auto w-full max-w-[1600px]">
          
          {/* Header Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-tight">
              My Profile <span className="text-red-600">.</span>
            </h2>
            <div className="h-2 w-24 bg-indigo-600 mt-6 rounded-full shadow-lg shadow-indigo-200"></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Avatar Card (Glassmorphism effect) */}
            <div className="xl:col-span-4 h-fit">
              <div className="bg-white/80 backdrop-blur-md rounded-[3.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-white/50 flex flex-col items-center text-center transition-all hover:translate-y-[-5px]">
                <div className="relative mb-10 w-full flex justify-center">
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-[3.5rem] overflow-hidden ring-[15px] ring-white/50 shadow-2xl border border-gray-100">
                    <img 
                      src={user?.avatar?.url} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-4 right-[12%] bg-black text-white p-4 rounded-2xl shadow-2xl border-4 border-white">
                    <MdBadge size={24} />
                  </div>
                </div>
                
                <div className="mb-10 w-full">
                  <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-tight px-4">
                    {user?.name}
                  </h2>
                  <span className="inline-block text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mt-6 bg-white/50 backdrop-blur-sm px-10 py-3 rounded-2xl border border-indigo-100 shadow-sm">
                    {user?.role}
                  </span>
                </div>

                <button 
                  onClick={() => dispatch(toggleUpdateProfilePopup())}
                  className="w-full py-5 bg-black hover:bg-indigo-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-indigo-200 hover:shadow-indigo-400"
                >
                  Update Profile Details
                </button>
              </div>
            </div>

            {/* Right Column: Details Grid */}
            <div className="xl:col-span-8 flex flex-col gap-8">
              <div className="bg-white/80 backdrop-blur-md rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-gray-200/50 border border-white/50">
                <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em] mb-14 border-b border-gray-100 pb-8 flex items-center gap-4 opacity-70">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                  Member Identity & Info
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-20">
                  <InfoItem icon={<MdEmail className="text-indigo-500" />} label="Email Address" value={user?.email} />
                  <InfoItem icon={<MdPhone className="text-emerald-500" />} label="Phone Number" value={user?.phone || "---"} />
                  <InfoItem icon={<MdMale className="text-blue-500" />} label="Gender" value={user?.gender || "---"} />
                  <InfoItem icon={<MdCake className="text-rose-500" />} label="Date of Birth" value={formatDate(user?.dob)} />
                  
                  {user?.role === "Admin" && (
                    <>
                      <InfoItem icon={<MdFingerprint className="text-orange-500" />} label="NIC Number" value={user?.nic || "---"} />
                      <InfoItem icon={<MdBadge className="text-purple-500" />} label="Department" value={user?.dept || "General"} />
                    </>
                  )}
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-black rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-indigo-900/20 gap-8">
                 <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className={`w-5 h-5 rounded-full ${user?.accountVerified ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                      <div className={`absolute inset-0 w-5 h-5 rounded-full animate-ping ${user?.accountVerified ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-40'}`}></div>
                    </div>
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.3em]">System Status</p>
                      <p className={`text-sm font-bold mt-1 ${user?.accountVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {user?.accountVerified ? "Verified Premium Account" : "Verification in Progress"}
                      </p>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] italic">
                      Enterprise Edition — 2026
                    </span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-8 group">
    <div className="w-16 h-16 rounded-[2rem] bg-white shadow-sm flex items-center justify-center text-4xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-200 group-hover:-translate-y-1 transition-all duration-500 border border-gray-50">
      <div className="transition-colors duration-500 group-hover:text-white">
        {icon}
      </div>
    </div>
    <div className="min-w-0 flex-1 pt-1">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{label}</p>
      <p className="font-bold text-gray-900 text-lg truncate md:whitespace-normal tracking-tight leading-tight">{value}</p>
    </div>
  </div>
);

export default Profile;