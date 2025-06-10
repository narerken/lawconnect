# 💼 LawConnect – Legal Consultation Platform

LawConnect is a full-stack web application that connects clients with lawyers for legal consultations. It offers features such as user authentication, multilingual support, real-time interactions, lawyer booking, profile management, and more — all built using modern technologies like **React**, **Node.js**, and **MongoDB**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Register/Login via email
  - Role-based access (Client / Lawyer)
  - Protected routes and access control

- 👥 **User Profiles**
  - View & update personal information
  - Upload/update avatar
  - Manage theme and language preferences

- 📄 **Legal Q&A**
  - Clients can ask questions
  - Lawyers can answer and be rated
  - Clients can mark “Best Answer”

- 📅 **Consultation Bookings**
  - Schedule 1-on-1 meetings with lawyers
  - Booking approval system
  - In-app chat between client and lawyer

- 🌐 **Multilingual Support**
  - i18n (English / Russian)

- 🎨 **Dark/Light Theme Toggle**

- 🔔 **Notifications**
  - In-app alerts for new answers/bookings

---

## 🛠️ Tech Stack

### Frontend:
- **React** with **Vite**
- **React Router** – routing
- **Context API** + **useReducer** – state management
- **i18next** – multilingual
- **Axios** – API requests
- **Ant Design** – UI components

### Backend:
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** + **bcrypt** – authentication
- **Multer** – file uploads (avatar)
- **Nodemailer** – email (SMTP) integration
- **Express Middleware** – for validation and auth

---

## 📂 Project Structure

law-connect/
├── client/ # React frontend
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── i18n/
│ └── App.jsx
├── backend/ # Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js