# 📚 Library Management System (MERN Stack)

A full-featured Library Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with modern UI using TailwindCSS.

---


## 🚀 Features

### 👤 User Panel

* 🔍 Browse & search books
* 📖 View book details
* 📌 Reserve books
* 📚 Borrow & return books
* ⭐ Add reviews & ratings
* 💳 Fine payment system

### 🛠️ Admin Panel

* 📊 Dashboard analytics
* 👥 User management
* 📚 Book inventory control
* 📌 Reservation management
* ⭐ Review moderation
* 💰 Fine management

---

## 📸 Screenshots

### ✔ Register Page

<img width="1366" height="768" alt="REGISTER" src="https://github.com/user-attachments/assets/03ee4c0d-3b52-4ac7-be9c-2f964af31763" />

### 🔐 Login Page 

<img width="1366" height="768" alt="LOGIN" src="https://github.com/user-attachments/assets/52153ee1-2932-494d-b497-e1e1487d460e" />

### 👤 Admin Dashboard Page

<img width="1366" height="768" alt="ADMIN DASHBOARD" src="https://github.com/user-attachments/assets/2b99f825-f1c0-4c2b-a4a4-f91d32c9e7bd" />

### 👤 Admin Profile Page

<img width="1366" height="768" alt="ADMIN PROFILE" src="https://github.com/user-attachments/assets/02f18f18-306b-4d94-a62e-3fd7c5220dde" />

### 👤 Admin Update Profile Page

<img width="1366" height="768" alt="ADMIN UPDATE PROFILE" src="https://github.com/user-attachments/assets/5e3b56bb-1a0b-4041-9a8b-6ec13fe669c5" />

### 📙 Book Management Page   

<img width="1366" height="768" alt="BOOK MANAGEMENT" src="https://github.com/user-attachments/assets/55b47e99-7c2c-4e53-b69f-ede2316b3a7a" />

### 📙 Borrowed Book Page  

<img width="1366" height="768" alt="BORROWED BOOK" src="https://github.com/user-attachments/assets/9212d641-ccf3-4d2f-ab92-27beced94340" />

### 💰 Fine Management Page  

<img width="1366" height="768" alt="FINE MANAGEMENT" src="https://github.com/user-attachments/assets/4ea6499b-dcc8-4a76-a64c-8fdccd58cebf" />

### 🌐 Global Reservation Page  

<img width="1366" height="768" alt="GLOBAL RESERVATION" src="https://github.com/user-attachments/assets/3d2366b6-b246-49da-a3ee-a8fe098fb816" />

### 👥 User Management Page  

<img width="1366" height="768" alt="USER MANAGEMENT" src="https://github.com/user-attachments/assets/bd6d4159-ea1f-400f-ae66-05d84a108e84" />

### ⭐ Review Management Page  

<img width="1366" height="768" alt="REVIEW MANAGEMENT" src="https://github.com/user-attachments/assets/f211b084-40f1-4729-a759-dfe85bdb5a1e" />

### 🔐 Update Credentials Page  

<img width="1366" height="768" alt="UPDATE CREDENTIALS" src="https://github.com/user-attachments/assets/d1a3bf7c-663f-4662-ba66-6a26d9ff1617" />

### 📢 Broadcast Message

<img width="1365" height="645" alt="BOARDCAST" src="https://github.com/user-attachments/assets/c4545c56-8f53-4c3e-b56e-54f9eb8834ce" />

### 📊 User Dashboard

<img width="1366" height="768" alt="USER DASHBOARD" src="https://github.com/user-attachments/assets/e3ac235a-b77e-4ea6-95c5-2fe3eaf693d3" />

### 👤 User Profile

<img width="1366" height="768" alt="USER PROFILE" src="https://github.com/user-attachments/assets/0a891293-bae2-40b3-9ab1-d1f35296266e" />

### 📚 My Borrowed Books

<img width="1366" height="768" alt="MY BORROWED BOOKS" src="https://github.com/user-attachments/assets/b8700f46-b8b6-4ad4-8124-8be5e8cd798b" />

### ⭐ My Reviews

<img width="1366" height="768" alt="MY REVIEWS" src="https://github.com/user-attachments/assets/97b98118-deac-421b-a261-9d1f42992a2b" />

### 💳 Payment Management

<img width="1366" height="768" alt="PAYMENT MANAGEMENT" src="https://github.com/user-attachments/assets/8bb9c151-80e2-4fc8-8c66-e5b9f7b0bc72" />

### 🔔 Payment Notification

<img width="1366" height="768" alt="PAYMENT NOTIFICATION" src="https://github.com/user-attachments/assets/e0a21449-f0ee-4a7c-a51f-bfbe11badc30" />

### 🔐 Update Credentials Page  

<img width="1366" height="768" alt="UPDATE CREDENTIALS" src="https://github.com/user-attachments/assets/2a471b72-1cdf-46a8-b4bb-83a876ab4eb0" />

### 🔔 Notifications

![Uploading USER NOTIFICATIONS]()

---

📌 Future Improvements

 * Mobile Responsiveness 📱

## 🛠️ Tech Stack

* **Frontend:** React.js, TailwindCSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **State Management:** Redux Toolkit
* **Authentication:** JWT
* **Other:** Email Service, Payment Integration

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/sanjaimadhu

```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Setup environment variables

Create `.env` file in backend:

```env
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

### 4. Run the project

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

## 🌐 Deployment

* Frontend: Netlify 
* Backend: Render

---

## 🤝 Contributing

Feel free to fork this repo and contribute!

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Author

** MADHUSUDHANAN S**

---
