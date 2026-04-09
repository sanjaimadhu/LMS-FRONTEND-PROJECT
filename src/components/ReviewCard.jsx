import React from "react";
import { FiUser, FiCalendar, FiStar } from "react-icons/fi";

const ReviewCard = ({ review }) => {
  
  // Function to render star rating design
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        size={14}
        className={`${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
        }`}
      />
    ));
  };

  return (
    <div className="group relative bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 mb-6 overflow-hidden">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-50 transition-colors duration-500"></div>

      <div className="relative flex flex-col gap-4">
        
        {/* Top Section: User & Date */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <FiUser size={18} />
            </div>
            <div className="flex flex-col">
              <h4 className="font-black text-slate-950 text-sm uppercase tracking-tight italic">
                {review?.userName || "Anonymous User"}
              </h4>
              <div className="flex items-center gap-1.5 text-slate-400">
                <FiCalendar size={10} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                   {new Date(review?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-0.5">
              {renderStars(review?.rating)}
            </div>
            <span className="text-[10px] font-black text-slate-950 italic bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {review?.rating}.0 / 5.0
            </span>
          </div>
        </div>

        {/* Comment Section */}
        <div className="relative mt-2">
          <span className="absolute -top-4 -left-2 text-5xl text-slate-50 font-serif pointer-events-none select-none">“</span>
          
          <p className="relative text-slate-600 text-sm leading-relaxed font-medium italic pl-4 border-l-2 border-slate-100 group-hover:border-blue-500 transition-colors duration-500">
            {review?.comment || "No comment provided."}
          </p>
        </div>

        {/* Bottom Section: Status Tracking */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Feedback</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewCard;