import React, { useState } from "react";
import { MessageSquare, Clock, X, BellOff, Bell, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = ({ 
  notifications = [], 
  onClose, 
  onMarkAsRead, 
  onMarkAllRead, 
  onDismiss 
}) => {
  const [filter, setFilter] = useState('unread'); 

  // Separating notifications into New (unread) and Old (read) categories
  const unreadNotifications = notifications.filter(n => n.status === 'unread');
  const readNotifications = notifications.filter(n => n.status !== 'unread');

  const displayList = filter === 'unread' ? unreadNotifications : readNotifications;

  // Handles marking a single notification as read
  const handleSingleMark = (id) => {
    onMarkAsRead(id);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* MODIFIED: Added a Background Image to the backdrop 
          The linear-gradient acts as an overlay to keep the UI clean.
      */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-in fade-in" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')` 
        }}
        onClick={onClose}
      ></div>

      {/* MODIFIED: Added 'bg-white/95' and 'backdrop-blur-md' 
          to the container to give it a modern glass-morphism feel over the new background.
      */}
      <div className="relative bg-white/95 backdrop-blur-md w-full max-w-2xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header Section */}
        <div className="p-6 bg-transparent border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="font-black text-slate-900 text-xl">Library Alerts</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-6 h-6"/>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('unread')}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                filter === 'unread' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white/50 text-slate-500 border border-slate-200'
              }`}
            >
              New Messages 
              <span className={`px-2 py-0.5 rounded-full text-[9px] ${filter === 'unread' ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                {unreadNotifications.length}
              </span>
            </button>

            <button
              onClick={() => setFilter('read')}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                filter === 'read' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white/50 text-slate-500 border border-slate-200'
              }`}
            >
              Old Messages
              <span className={`px-2 py-0.5 rounded-full text-[9px] ${filter === 'read' ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                {readNotifications.length}
              </span>
            </button>
          </div>
        </div>

        {/* Body Section: Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/20 custom-scrollbar">
          {displayList.length > 0 ? (
            <div className="grid gap-3">
              {[...displayList].reverse().map((n, index) => (
                <div 
                  key={n._id || index} 
                  className={`p-5 rounded-3xl border transition-all duration-500 flex gap-4 bg-white/80 shadow-sm
                    ${n.status === 'unread' ? 'border-indigo-100 ring-1 ring-indigo-50' : 'border-transparent opacity-75 bg-slate-50/50'}`}
                >
                  <div className={`p-3 rounded-2xl shrink-0 self-start ${n.status === 'unread' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${n.status === 'unread' ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold">
                      <Clock className="w-3 h-3" />
                      {n.createdAt ? formatDistanceToNow(new Date(n.createdAt)) : "Just now"} ago
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {n.status === 'unread' && (
                      <button 
                        onClick={() => handleSingleMark(n._id)} 
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                        title="Mark as Read"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => onDismiss(n._id || index)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
              <BellOff className="w-12 h-12 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No {filter === 'unread' ? 'New' : 'Old'} Messages</p>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="p-6 bg-transparent border-t border-slate-100 flex flex-row gap-3">
          {unreadNotifications.length > 0 && filter === 'unread' && (
            <button 
              onClick={() => {
                onMarkAllRead();
                setTimeout(() => setFilter('read'), 300); 
              }}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              Mark all as read 
            </button>
          )}
          
          <button 
            onClick={onClose}
            className={`py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 ${unreadNotifications.length > 0 && filter === 'unread' ? 'px-8' : 'flex-1'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;