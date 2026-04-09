import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBook } from "../store/slices/bookSlice";
import { toggleUpdateBookPopup } from "../store/slices/popUpSlice";
import { BookOpen, X, ImagePlus } from "lucide-react";

const UpdateBookPopup = ({ book }) => { 
  const dispatch = useDispatch();

  // Initializing state with existing book data
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [description, setDescription] = useState(book?.description || "");
  const [price, setPrice] = useState(book?.price || "");
  const [quantity, setQuantity] = useState(book?.quantity || "");
  const [publicationYear, setPublicationYear] = useState(book?.publicationYear || "");
  const [isbn, setIsbn] = useState(book?.ISBN || "");

  // Image states
  const [bookImage, setBookImage] = useState("");
  const [imagePreview, setImagePreview] = useState(book?.bookImage?.url || book?.image?.url || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setBookImage(file);
    };
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Using FormData for image support
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("price", Number(price));
    formData.append("quantity", Number(quantity));
    formData.append("publicationYear", publicationYear);
    formData.append("ISBN", isbn);
    
    if (bookImage) {
      formData.append("bookImage", bookImage);
    }

    // Dispatch update with formData
    dispatch(updateBook(book._id, formData));
    dispatch(toggleUpdateBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-5 flex items-center justify-center z-[100] overflow-y-auto"> 
      <div className="w-full bg-white rounded-[2.5rem] shadow-2xl md:w-[650px] my-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="bg-black p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 p-2.5 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest leading-none">Edit Records</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Book ID: {book?._id?.slice(-6)}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => dispatch(toggleUpdateBookPopup())}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Image Upload Section - Size Reduced to h-28 */}
            <div className="md:col-span-2 flex flex-col items-center mb-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 self-start ml-1">Update Cover Image</label>
              <div className="relative group w-full h-28 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImagePlus className="w-6 h-6 mb-1" />
                    <span className="text-[9px] font-bold uppercase">No Image Selected</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <span className="text-white text-[9px] font-black uppercase tracking-widest bg-indigo-600 px-3 py-1.5 rounded-lg">Change Photo</span>
                </label>
              </div>
            </div>

            {/* Title - Full Width */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Book Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold" 
                required 
              />
            </div>

            {/* Author - Full Width */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Author</label>
              <input 
                type="text" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold" 
                required 
              />
            </div>

            {/* Price & Quantity */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Price (₹)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Stock Quantity</label>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold" 
                required 
              />
            </div>

            {/* Year & ISBN */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Release Year</label>
              <input 
                type="number" 
                value={publicationYear} 
                onChange={(e) => setPublicationYear(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">ISBN Number</label>
              <input 
                type="text" 
                value={isbn} 
                onChange={(e) => setIsbn(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold" 
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Overview / Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black transition-all outline-none font-semibold resize-none" 
              />
            </div>

            {/* Footer Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => dispatch(toggleUpdateBookPopup())} 
                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Discard
              </button>
              <button 
                type="submit" 
                className="px-10 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 shadow-lg shadow-black/10 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBookPopup;