import React from "react";
import { useSelector } from "react-redux";
import { FiMessageSquare, FiStar, FiBook, FiCalendar } from "react-icons/fi";

const MyReviews = () => {
  const { books } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  // Logic to filter and extract reviews posted by the logged-in user from all books
  const myReviews = [];
  books?.forEach((book) => {
    book.reviews?.forEach((rev) => {
      // Add to list only if the User ID matches
      if (rev.user === user?._id || rev.user?._id === user?._id) {
        myReviews.push({
          ...rev,
          bookTitle: book.title,
          bookAuthor: book.author,
        });
      }
    });
  });

  return (
    /* ADDED: Background image via inline style + Tailwind utility classes */
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-10 pt-28 font-sans tracking-tight w-full"
      style={{ 
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.9)), url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      
      {/* HEADER SECTION */}
      <div className="w-full mb-10 text-left px-2 relative z-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          My <span className="text-indigo-600">Reviews</span>
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
          You have shared {myReviews.length} experiences with the community
        </p>
      </div>

      {/* REVIEWS GRID */}
      <div className="w-full px-2 relative z-10">
        {myReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {myReviews.map((rev, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 shadow-xl shadow-slate-200/50 group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
                
                <div>
                  {/* Book Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <FiBook size={20} />
                    </div>
                    <div className="overflow-hidden text-left">
                      <h4 className="font-black text-slate-800 uppercase text-[11px] truncate">{rev.bookTitle}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{rev.bookAuthor}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        size={14} 
                        className={`${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} 
                      />
                    ))}
                  </div>

                  {/* User Comment */}
                  <div className="bg-white/50 p-5 rounded-[1.8rem] border border-slate-100 relative mb-4 min-h-[100px] text-left">
                    <FiMessageSquare className="absolute top-4 right-4 text-slate-200" size={20} />
                    <p className="text-sm text-slate-600 font-medium italic leading-relaxed relative z-10">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-400 ml-2">
                  <FiCalendar size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Posted on {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm border-4 border-dashed border-slate-200 rounded-[3rem] py-40 text-center w-full">
            <FiMessageSquare size={50} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No reviews posted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;