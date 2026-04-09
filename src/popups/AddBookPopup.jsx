import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { X, BookOpen, User, IndianRupee, Hash, Calendar, Layers, AlignLeft, Image as ImageIcon } from "lucide-react";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  // State Management
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [ISBN, setISBN] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle Image Change & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("ISBN", ISBN);
    formData.append("publicationYear", publicationYear);

    if (bookImage) {
      formData.append("bookImage", bookImage);
    }

    dispatch(addBook(formData));
    dispatch(toggleAddBookPopup());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => dispatch(toggleAddBookPopup())}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center bg-slate-900 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 p-2.5 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300/80">Inventory</p>
              <h2 className="text-lg font-black uppercase tracking-widest leading-none mt-1">Catalog New Asset</h2>
            </div>
          </div>
          <button
            className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            onClick={() => dispatch(toggleAddBookPopup())}
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleAddBook} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white">
          
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Book Cover Image
            </label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              <div className={`h-40 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${preview ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30'}`}>
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Click to upload cover</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Book Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* ISBN & Year */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <Hash className="w-3 h-3" /> ISBN
              </label>
              <input
                type="text"
                value={ISBN}
                onChange={(e) => setISBN(e.target.value)}
                placeholder="ISBN-13"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Release Year
              </label>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <IndianRupee className="w-3 h-3" /> Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Cost"
                className="w-full p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <Layers className="w-3 h-3" /> Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Units"
                className="w-full p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl font-black text-indigo-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
              <AlignLeft className="w-3 h-3" /> Overview
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the asset..."
              rows={3}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-50 flex gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopup())}
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 active:scale-[0.98]"
            >
              Finalize Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;