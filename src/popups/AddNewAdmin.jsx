import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Admin");
  const [gender, setGender] = useState("Male");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [dept, setDept] = useState("General");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append("nic", nic);
    formData.append("dob", dob);
    formData.append("dept", dept);
    formData.append("avatar", avatar);
    dispatch(addNewAdmin(formData));
  };

  return (
    /* Fix 1: Added z-[9999] to stay above everything and backdrop-blur-2xl for maximum isolation */
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-[9999] p-4 overflow-hidden">
      
      {/* Fix 2: Container width and styling */}
      <div className="relative w-full max-w-[600px] bg-[#F3F4F6] rounded-[3.5rem] shadow-[0_0_150px_rgba(0,0,0,0.6)] overflow-hidden border-[10px] border-white animate-in fade-in zoom-in duration-300">
        
        <div className="p-10 pb-8 max-h-[85vh] overflow-y-auto no-scrollbar">
          
          {/* Fix 3: Minimalist Header - No Highlight, No Background Overlay */}
          <header className="flex justify-between items-start mb-10 px-2">
            <div className="flex items-center gap-5">
              <img src={keyIcon} alt="key" className="w-9 h-9 opacity-80" />
              <div>
                <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">
                  New <span className="text-red-600">Admin</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-2">Registration Protocol</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="p-3 hover:bg-slate-200/50 rounded-2xl transition-all group"
            >
              <img 
                src={closeIcon} 
                alt="close" 
                className="w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" 
              />
            </button>
          </header>

          <form onSubmit={handleAddNewAdmin} className="space-y-6">
            
            {/* Portrait Upload */}
            <div className="flex items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-white shadow-sm">
              <label htmlFor="avatarInput" className="relative shrink-0 cursor-pointer group">
                <img
                  src={avatarPreview ? avatarPreview : placeHolder}
                  alt="avatar"
                  className="w-24 h-24 rounded-[2rem] object-cover border-4 border-[#F3F4F6] shadow-xl group-active:scale-95 transition-transform"
                />
                <input type="file" id="avatarInput" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <div>
                <p className="font-black text-slate-950 text-sm tracking-wider italic">IDENTITY PHOTO</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">HQ Portrait Required</p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="FULL NAME"
                className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-900 placeholder:text-slate-300 transition-all uppercase italic text-base rounded-[1.8rem] shadow-sm"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL"
                  className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-900 placeholder:text-slate-300 transition-all uppercase italic text-base rounded-[1.8rem] shadow-sm"
                  required
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="PHONE"
                  className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-900 placeholder:text-slate-300 transition-all uppercase italic text-base rounded-[1.8rem] shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="NIC / ID NO"
                  className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-900 placeholder:text-slate-300 transition-all uppercase italic text-base rounded-[1.8rem] shadow-sm"
                  required
                />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-950 transition-all uppercase text-base rounded-[1.8rem] shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-[1.5rem] px-4 py-2 border border-transparent focus-within:border-red-600">
                   <label className="text-[8px] font-bold text-slate-400 block px-2">ROLE</label>
                   <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-transparent font-black text-slate-950 uppercase text-xs outline-none">
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Mod</option>
                    <option value="Editor">Edit</option>
                   </select>
                </div>
                <div className="bg-white rounded-[1.5rem] px-4 py-2 border border-transparent focus-within:border-red-600">
                   <label className="text-[8px] font-bold text-slate-400 block px-2">GENDER</label>
                   <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-transparent font-black text-slate-950 uppercase text-xs outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                   </select>
                </div>
                <div className="bg-white rounded-[1.5rem] px-4 py-2 border border-transparent focus-within:border-red-600">
                   <label className="text-[8px] font-bold text-slate-400 block px-2">DEPT</label>
                   <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-transparent font-black text-slate-950 uppercase text-xs outline-none">
                    <option value="General">Gen</option>
                    <option value="Tech">Tech</option>
                    <option value="HR">HR</option>
                   </select>
                </div>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full px-8 py-5 bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-900 placeholder:text-slate-300 transition-all uppercase italic text-base rounded-[1.8rem] shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-slate-950 py-7 rounded-[2.2rem] transition-all active:scale-[0.98] mt-6 shadow-2xl"
            >
              <div className="absolute inset-0 bg-red-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 text-white font-black text-xs uppercase tracking-[0.5em]">
                {loading ? "AUTHORIZING..." : "CONFIRM ADMIN ACCESS"}
              </span>
            </button>
          </form>
        </div>
        <div className="h-3 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AddNewAdmin;