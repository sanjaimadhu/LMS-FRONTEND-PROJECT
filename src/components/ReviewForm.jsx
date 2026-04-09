import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBookReview } from "../store/slices/bookSlice";
import { Send, Star } from "lucide-react"; // Icons for the form

const ReviewForm = ({ bookId }) => { // Receives bookId via Props
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0); // For star hover effect

  const dispatch = useDispatch();
  
  // Extracting loading state from Redux
  const { loading } = useSelector((state) => state.book);

  const submitHandler = (e) => {
    e.preventDefault();
    
    const reviewData = {
      rating: Number(rating),
      comment: comment,
      bookId: bookId // Required bookId for backend processing
    };

    // Dispatching Redux Action - ensure Slice handles (id, data) accordingly
    dispatch(createBookReview(bookId, reviewData));
    
    setComment(""); 
    setRating(5);
  };

  return (
    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner group animate-in fade-in slide-in-from-top-2 duration-500">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">
          Share Your Experience
        </h3>
        
        {/* Star Selection UI */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-125 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  star <= (hover || rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
        </div>
      </header>

      <form onSubmit={submitHandler} className="space-y-4">
        <div className="relative">
          <textarea
            rows="3"
            className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think about the plot, characters, or writing style?"
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${
              loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-black text-white hover:bg-indigo-600 shadow-indigo-100"
            }`}
          >
            {loading ? "Processing..." : (
              <>
                Post Review <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;