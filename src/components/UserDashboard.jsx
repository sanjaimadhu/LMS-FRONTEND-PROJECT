import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth); 
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    if (userBorrowedBooks) {
      let numberofTotalBorrowedBooks = userBorrowedBooks.filter(
        (book) => book.returned === false
      );
      let numberofTotalReturnedBooks = userBorrowedBooks.filter(
        (book) => book.returned === true
      );
      setTotalBorrowedBooks(numberofTotalBorrowedBooks.length);
      setTotalReturnedBooks(numberofTotalReturnedBooks.length);
    }
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#6366f1", "#10b981"], // Indigo and Emerald for better contrast
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main 
        className="relative flex-1 p-6 pt-28 bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
        style={{ 
          backgroundImage: `linear-gradient(rgba(253, 252, 253, 0.92), rgba(253, 252, 253, 0.95)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')` 
        }}
      >
        <Header />

        {/* Welcome Section */}
        <div className="flex items-center gap-5 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-indigo-50 shadow-lg">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
              Welcome Back, <span className="text-indigo-600">{user?.name?.split(" ")[0]}!</span>
            </h2>
            <p className="text-slate-500 font-bold text-sm tracking-wide">
              Here is what's happening with your library account today.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse xl:flex-row gap-7">
          <div className="flex flex-[4] flex-col gap-7 lg:gap-7 justify-between xl:min-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* Borrowed Books - SOFT INDIGO BG */}
              <div className="flex items-center gap-3 bg-indigo-50/80 backdrop-blur-sm p-5 min-h-[120px] rounded-xl transition hover:shadow-xl hover:-translate-y-1 duration-300 border border-indigo-100">
                <span className="w-[4px] bg-indigo-600 h-12 rounded-full"></span>
                <span className="bg-white h-16 min-w-16 flex justify-center items-center rounded-xl shadow-sm">
                  <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
                </span>
                <div>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Borrowed</p>
                  <p className="text-xl font-black text-slate-800">Your Borrowed List</p>
                </div>
              </div>

              {/* Returned Books - SOFT EMERALD BG */}
              <div className="flex items-center gap-3 bg-emerald-50/80 backdrop-blur-sm p-5 min-h-[120px] rounded-xl transition hover:shadow-xl hover:-translate-y-1 duration-300 border border-emerald-100">
                <span className="w-[4px] bg-emerald-600 h-12 rounded-full"></span>
                <span className="bg-white h-16 min-w-16 flex justify-center items-center rounded-xl shadow-sm">
                  <img src={returnIcon} alt="return-icon" className="w-8 h-8" />
                </span>
                <div>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Returned</p>
                  <p className="text-xl font-black text-slate-800">Your Returned List</p>
                </div>
              </div>
            </div>

            {/* Browse Inventory - SOFT AMBER/ORANGE BG */}
            <div className="flex flex-col lg:flex-row gap-7 items-center">
              <div className="flex-1 w-full flex items-center gap-3 bg-amber-50/80 backdrop-blur-sm p-5 min-h-[120px] rounded-xl transition hover:shadow-xl hover:-translate-y-1 duration-300 border border-amber-100">
                <span className="w-[4px] bg-amber-500 h-12 rounded-full"></span>
                <span className="bg-white h-16 min-w-16 flex justify-center items-center rounded-xl">
                  <img src={browseIcon} alt="browse-icon" className="w-8 h-8" />
                </span>
                <p className="text-xl font-black text-slate-800">Browse Inventory</p>
              </div>
              <img src={logo_with_title} alt="logo" className="hidden lg:block h-16 opacity-80" />
            </div>

            {/* Quote Box - GRADIENT PURPLE */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-10 text-white min-h-[250px] relative flex flex-col justify-center rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h4 className="text-xl md:text-2xl 2xl:text-3xl font-medium leading-relaxed italic relative z-10">
                "Embarking on the journey of reading fosters personal growth, nurturing a path towards excellence and the refinement of character."
              </h4>
              <p className="text-indigo-400 text-sm font-black uppercase mt-6 tracking-[0.3em]">
                — Bookworm Team
              </p>
            </div>
          </div>

          {/* Right Side Stats */}
          <div className="flex-[2] flex flex-col gap-7">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Reading Statistics</h3>
                <div className="w-full max-w-[280px]">
                  <Pie data={data} options={{ cutout: "70%", plugins: { legend: { display: false } } }} />
                </div>
                
                <div className="mt-10 w-full space-y-4">
                   <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                     <div className="flex items-center gap-3">
                       <span className="w-3 h-3 rounded-full bg-[#6366f1]"></span>
                       <span className="text-sm font-bold text-slate-600">Borrowed</span>
                     </div>
                     <span className="text-lg font-black text-indigo-700">{totalBorrowedBooks}</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                     <div className="flex items-center gap-3">
                       <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                       <span className="text-sm font-bold text-slate-600">Returned</span>
                     </div>
                     <span className="text-lg font-black text-emerald-700">{totalReturnedBooks}</span>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;