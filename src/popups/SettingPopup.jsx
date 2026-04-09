import React, { useState } from 'react';
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png";
import { toggleSettingPopup, toggleUpdateProfilePopup } from '../store/slices/popUpSlice';

const SettingPopup = () => {
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);
    data.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(data));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full bg-white rounded-2xl shadow-2xl sm:w-auto lg:w-1/2 2xl:w-1/3 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          
          {/* Header Section: Branding and Navigation */}
          <header className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4"> 
              {/* Setting icon positioned to the side of the title */}
              <img 
                src={settingIcon} 
                alt="setting-icon" 
                className="bg-gray-100 p-3 rounded-xl w-14 h-14 object-contain"
              />
              
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  Security Settings
                </h3>
                {/* Profile Update Navigation Link */}
                <p 
                  className="text-[11px] text-blue-600 cursor-pointer hover:text-blue-800 font-black uppercase tracking-widest mt-1 transition-colors"
                  onClick={() => {
                    dispatch(toggleSettingPopup());
                    dispatch(toggleUpdateProfilePopup());
                  }}
                >
                  Update Name or Photo?
                </p>
              </div>
            </div>

            {/* Close Modal Button */}
            <button 
              onClick={() => dispatch(toggleSettingPopup())}
              className="hover:rotate-90 transition-transform duration-300"
            >
              <img 
                src={closeIcon} 
                alt="close-icon" 
                className="w-6 h-6 opacity-40 hover:opacity-100 transition-opacity"
              />
            </button>
          </header>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {/* Current Password Field */}
            <div className="sm:flex gap-4 items-center">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest w-full sm:w-1/3"> 
                Current Password 
              </label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setcurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-black transition-all font-semibold" 
              />
            </div>

            {/* New Password Field */}
            <div className="sm:flex gap-4 items-center">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest w-full sm:w-1/3"> 
                New Password 
              </label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-black transition-all font-semibold" 
              />
            </div>

            {/* Confirm Password Field */}
            <div className="sm:flex gap-4 items-center">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest w-full sm:w-1/3">
                Confirm Password 
              </label>
              <input 
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-black transition-all font-semibold" 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-10 justify-end">
              <button 
                type="button"
                onClick={() => dispatch(toggleSettingPopup())}
                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/10 transition-all active:scale-95 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Update Security"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;