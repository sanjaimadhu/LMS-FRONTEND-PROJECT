import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, clearErrors, updateProfileReset } from "../store/slices/userSlice";
import { toggleUpdateProfilePopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

// Asset Imports
import closeIcon from "../assets/close-square.png";
import userIcon from "../assets/people-black.png";

const UpdateProfilePopup = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { loading, error, isUpdated } = useSelector((state) => state.user);

  // States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [nic, setNic] = useState(user?.nic || "");
  const [dob, setDob] = useState(user?.dob ? user.dob.substring(0, 10) : "");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [dept, setDept] = useState(user?.dept || "General");
  const [role, setRole] = useState(user?.role || "User");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("role", role);

    // Admin-ku mattum extra fields data-vai anuppum logic
    if (user?.role === "Admin") {
      formData.append("nic", nic);
      formData.append("dept", dept);
    }

    if (avatar) {
      formData.append("avatar", avatar);
    }
    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated Successfully!");
      dispatch(updateProfileReset());
      dispatch(toggleUpdateProfilePopup());
    }
  }, [dispatch, error, isUpdated]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="relative w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 bg-[#F8FAFC] border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              <img src={userIcon} alt="user" className="w-5 h-5 brightness-0 invert" />
            </div>
            <h3 className="text-xl font-black text-slate-950 uppercase italic">
              Update <span className="text-indigo-600">Identity</span>
            </h3>
          </div>
          <button onClick={() => dispatch(toggleUpdateProfilePopup())} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <img src={closeIcon} alt="close" className="w-6 h-6 opacity-60" />
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleUpdateSubmit} className="p-10 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          
          <div className="flex flex-col items-center mb-2">
            <label className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ring-2 ring-slate-100">
                <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-all">
                <span className="text-[8px] text-white font-bold uppercase">Change</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="space-y-4">
            {/* Name & Email (Common) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-black" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-black" required />
              </div>
            </div>

            {/* Phone (Common) & NIC (Admin Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-black" required />
              </div>
              
              {user?.role === "Admin" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">NIC</label>
                  <input type="text" value={nic} onChange={(e) => setNic(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-black" required />
                </div>
              )}
            </div>

            {/* Gender, Dept (Admin Only), Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-4 bg-slate-50 rounded-2xl font-black text-xs outline-none border-2 border-transparent focus:border-indigo-600">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {user?.role === "Admin" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Dept</label>
                  <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full px-3 py-4 bg-slate-50 rounded-2xl font-black text-xs outline-none border-2 border-transparent focus:border-indigo-600">
                    <option value="General">General</option>
                    <option value="Tech">Tech</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-4 bg-slate-50 rounded-2xl font-black text-xs outline-none border-2 border-transparent focus:border-indigo-600">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Mod</option>
                </select>
              </div>
            </div>

            {/* DOB (Common) */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">DOB</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-black" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-slate-950 hover:bg-indigo-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95 shadow-xl">
            {loading ? "Processing..." : "Confirm Update"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default UpdateProfilePopup;