import React, {useState, useEffect} from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {useDispatch, useSelector} from "react-redux";
import Header from "../layout/Header";
import BroadcastPopup from "../popups/BroadcastPopup"; 
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

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { settingPopup, broadcastPopup } = useSelector((state) => state.popup); 

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let numberOfUsers = users.filter((user) => user.role === "User");
    let numberOfAdmins = users.filter((user) => user.role === "Admin");
    setTotalUsers(numberOfUsers.length);
    setTotalAdmin(numberOfAdmins.length);

    let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate === null
    );
    let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate != null
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
    
  }, [users, allBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
       {
      data:  [totalBorrowedBooks, totalReturnedBooks],
    backgroundColor: ["#4F46E5", "#0F172A"], 
    hoverOffset: 15,
    borderWidth: 0,
    },
  ],
   };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 min-h-screen bg-cover bg-fixed bg-center" 
            style={{backgroundImage: `linear-gradient(rgba(243, 244, 246, 0.95), rgba(243, 244, 246, 0.95)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000')`}}>
        <Header />
        <BroadcastPopup />

        <div className="flex flex-col-reverse xl:flex-row gap-8">
          <div className="flex-[2] flex flex-col gap-6 py-5">
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-white/50 flex flex-col items-center">
              <div className="w-full max-w-[300px]">
                <Pie
                  data={data}
                  options={{ cutout: "70%", plugins: { legend: { display: false } } }}
                />
              </div>
              
              <div className="mt-8 w-full space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#4F46E5]"></span>
                    <span className="font-bold text-gray-600">Borrowed</span>
                  </div>
                  <span className="font-black">{totalBorrowedBooks}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#0F172A]"></span>
                    <span className="font-bold text-gray-600">Returned</span>
                  </div>
                  <span className="font-black">{totalReturnedBooks}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-lg border border-white/50 flex items-center gap-6">
                <img src={logo} alt="logo" className="w-20 opacity-70" />
                <div className="h-10 w-[1px] bg-gray-300"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Enterprise <br/> Edition 2026</p>
            </div>
          </div>

          <div className="flex flex-[4] flex-col gap-8 lg:px-7 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Added individual background colors for visibility */}
              <StatCard icon={usersIcon} count={totalUsers} label="Total Users" colorClass="bg-blue-50 border-blue-100" />
              <StatCard icon={bookIcon} count={totalBooks} label="Total Books" colorClass="bg-indigo-50 border-indigo-100" />
              <StatCard icon={adminIcon} count={totalAdmin} label="Total Admins" colorClass="bg-purple-50 border-purple-100" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
              <div className="flex-1 bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-xl border border-white/50 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <img
                    src={user && user.avatar?.url}
                    alt="avatar"
                    className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{user && user.name}</h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Welcome to your command center. Manage inventory and monitor system logs seamlessly.
                </p>
              </div>

              <div className="flex-[1.5] bg-gray-900 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                <h4 className="text-2xl 2xl:text-3xl font-medium text-white italic leading-snug relative z-10">
                  "Embarking on the journey of reading fosters personal growth, nurturing a path towards excellence."
                </h4>
                <div className="mt-8 flex items-center gap-4 relative z-10">
                   <div className="h-[2px] w-8 bg-indigo-500"></div>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Bookworm Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Sub-component modified with colorClass for background colors
const StatCard = ({ icon, count, label, colorClass }) => (
  <div className={`flex items-center gap-5 ${colorClass} backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border transition-all duration-300 hover:scale-[1.02]`}>
    <div className="bg-white/80 p-4 rounded-2xl shadow-sm">
      <img src={icon} alt="" className="w-8 h-8 opacity-80" />
    </div>
    <div>
      <h4 className="font-black text-3xl text-gray-800 tracking-tighter">{count}</h4>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{label}</p>
    </div>
  </div>
);

export default AdminDashboard;