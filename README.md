# 📚 Library Management System (MERN Stack)

A full-featured **Library Management System** built using the MERN stack (MongoDB, Express, React, Node.js). This system allows users to browse books, borrow/return them, leave reviews, and enables admins to manage the entire library efficiently.

---

## 🚀 Features

### 👤 User Features

* Register & Login (JWT Authentication)
* Browse & Search Books
* View Book Details
* Borrow & Return Books
* Reserve Books
* Add Reviews & Ratings
* View Profile & Borrow History

### 🛠️ Admin Features

* Add / Update / Delete Books
* Manage Users
* Track Borrowed Books
* Handle Overdue & Fines
* Dashboard Analytics

### 🔔 Additional Features

* Email Notifications 📧
* Payment Integration 💳 (for fines)
* Role-based Access Control

---

## 🛠️ Tech Stack

### Frontend (`client/`)

* React.js (Vite)
* Tailwind CSS
* Redux Toolkit

### Backend (`server/`)

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📂 Project Structure

```
client/
│── src/
│   ├── assets/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   ├── popups/
│   ├── store/
│   │   ├── slices/
│   │   └── store.js
│   ├── App.jsx
│   ├── main.jsx

server/
│── config/
│── controllers/
│── database/
│── middlewares/
│── models/
│── routes/
│── services/
│── utils/
│── app.js
│── server.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/lms-project.git
cd lms-project
```

### 2️⃣ Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 3️⃣ Run the project

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd client
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file inside `server/`:

```
PORT=4000

FRONTEND_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=465
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=3d
COOKIE_EXPIRE=3

CLOUDINARY_CLIENT_NAME=your_cloudinary_name
CLOUDINARY_CLIENT_API=your_cloudinary_api_key
CLOUDINARY_CLIENT_SECRET=your_cloudinary_secret

RAZORPAY_API_KEY=your_razorpay_key
RAZORPAY_API_SECRET=your_razorpay_secret
```

---

## 📸 Screenshots

> 📁 Create a folder named **screenshots** in your root directory

```
/screenshots
```

---

### 🔐 Login Page

![Uploading Screenshot 2026-04-10 205630.png…]()


### 📚 Book List Page

![Books](./screenshots/books.png)

### 📖 Book Details

![Details](./screenshots/details.png)

### 👤 User Dashboard

![User](./screenshots/user.png)

### 🛠️ Admin Dashboard

![Admin](./screenshots/admin.png)

---

## 🎥 Demo (Optional)

Add a GIF demo:

```
![Demo](./screenshots/demo.gif)
```

---

## 📌 Future Improvements

* Mobile Responsiveness 📱
* Advanced Search Filters
* AI Book Recommendations 🤖

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Author

Developed by **Madhu**
