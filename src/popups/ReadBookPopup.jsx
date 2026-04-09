import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";
import { Star, Calendar, Hash, BookOpen, X, Quote } from "lucide-react";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  if (!book) return null; 

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={() => dispatch(toggleReadBookPopup())}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* --- Header Section --- */}
        <div className="flex-shrink-0 flex justify-between items-center bg-black px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300/80">Book Insight</p>
              <h2 className="text-lg font-black uppercase tracking-widest leading-none mt-1">Details View</h2>
            </div>
          </div>
          <button
            className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white">
          
          {/* --- Image Section Added --- */}
          <div className="w-full h-64 md:h-80 rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50 relative group">
             {book.bookImage?.url || book.image?.url ? (
               <img 
                 src={book.bookImage?.url || book.image?.url} 
                 alt={book.title}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                  <BookOpen className="w-12 h-12 text-indigo-100 mb-2" />
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">No Cover Available</p>
               </div>
             )}
          </div>

          {/* Main Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Title</label>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 leading-tight">
                {book.title}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Author</label>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900">
                {book.author}
              </div>
            </div>
          </div>

          {/* Metadata Grid (ISBN & Year) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 ml-1">
                <Hash className="w-3 h-3 text-indigo-500" /> ISBN
              </label>
              <div className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-indigo-700 font-mono font-bold text-sm">
                {book.ISBN || "N/A"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 ml-1">
                <Calendar className="w-3 h-3 text-emerald-500" /> Release Year
              </label>
              <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm">
                {book.publicationYear || "N/A"}
              </div>
            </div>
          </div>

          {/* Description / Overview Section */}
          <div className="relative space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Overview</label>
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl group">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-slate-200 -z-0" />
              <p className="relative z-10 text-slate-600 text-sm leading-relaxed italic font-medium">
                {book.description || "No description available for this masterpiece."}
              </p>
            </div>
          </div>

          {/* --- Review System --- */}
          <div className="pt-8 border-t border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
                Reader Reviews 
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[9px]">
                  {book.reviews?.length || 0}
                </span>
              </h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-200">
                <Star className="w-3 h-3 fill-black text-black" />
                <span className="text-[11px] font-black text-black">
                  {book.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>

            {user?.role === "User" && (
              <div className="p-1 bg-gradient-to-br from-indigo-50 to-transparent rounded-3xl">
                <ReviewForm bookId={book._id} />
              </div>
            )}

            <div className="space-y-4">
              {book.reviews && book.reviews.length > 0 ? (
                book.reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} bookId={book._id} />
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Star className="w-5 h-5 text-slate-200" />
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    No reviews yet. Be the first!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Footer Section --- */}
        <div className="flex-shrink-0 px-8 py-6 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100">
          <button
            className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-indigo-600 transition-all uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-black/10 active:scale-[0.98]"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            Finished Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;