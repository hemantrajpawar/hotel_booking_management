# 🏨 StayEase - Full-Stack Hotel Booking Platform

A comprehensive *MERN Stack* application designed to streamline the hotel booking process. This platform provides users with a seamless interface for searching, filtering, and booking rooms in real-time, while offering administrators a powerful dashboard for inventory management. It is built with a focus on performance, security, and offline capabilities.

![StayEase Homepage](https://github.com/user-attachments/assets/b0343c6f-fa23-4dfd-9ada-672dad730adc)

---

## 🌟 Features

### 🔒 *Authentication & Authorization*
-   *Secure JWT Authentication:* Employs JSON Web Tokens for secure user registration and login sessions.
-   *Role-Based Access Control:* Differentiates between Admin and User roles, granting specific permissions for managing rooms and accessing features.
-   *Admin-Only Routes:* Protects critical backend routes to ensure only authorized administrators can create, update, or delete room data.

### 🏨 *Room & Booking Management*
-   *Dynamic Room Catalog:* Admins can easily add, edit, and remove room listings through a dedicated dashboard.
-   *Advanced Search & Filtering:* Users can efficiently find rooms by searching for keywords or filtering by price range, guest capacity, and availability.
-   *Real-time Availability:* Utilizes WebSockets (Socket.IO) to provide instant updates on room availability, preventing double bookings.

### ⚡ *Enhanced User Experience*
-   *Offline Capabilities:* A robust Service Worker caches static assets and API data, allowing users to browse previously visited pages even without an internet connection.
-   *Background Sync:* Offline bookings are saved locally in IndexedDB and are automatically synced with the server once connectivity is restored.
-   *Interactive UI:* Features an image carousel for each room (Swiper.js) and a fully responsive design for a seamless experience on any device.
-   *User Reviews:* Registered users can submit reviews and ratings for rooms, which are then displayed publicly.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| *Frontend* | React.js, React Router, Axios, Swiper.js | User Interface, Routing & API Communication |
| *Backend* | Node.js, Express.js | API Server, Business Logic & Real-time Events |
| *Database* | MongoDB Atlas with Mongoose | Data Storage & Management |
| *Real-time*| Socket.IO | Instant Booking Notifications & Availability Updates |
| *Authentication* | JWT, bcrypt.js | Security, Session Management & Password Hashing |
| *Offline*| Service Worker, IndexedDB | Caching, Offline Access & Background Sync |

---

## 🚀 Quick Start

Follow these instructions to set up and run the project locally.

### Prerequisites
-   Node.js (v16 or higher)
-   npm (or yarn)
-   MongoDB Atlas account (or a local MongoDB instance)
-   Git

### 1. Clone Repository
bash
git clone [https://github.com/your-username/StayEase-Hotel-Booking.git](https://github.com/your-username/StayEase-Hotel-Booking.git)
cd StayEase-Hotel-Booking


### 2. Environment Setup

Create .env files in both the backend and frontend directories.

#### Backend .env
Create a file at backend/.env and add your environment-specific keys:
env
# Server Configuration
PORT=5000

# MongoDB Connection String
MONGO_URI=your_mongodb_atlas_connection_string

# JWT Secret Key for signing tokens
JWT_SECRET=your_super_secret_jwt_key


#### Frontend .env.local
Create a file at frontend/.env.local to specify the backend API URL:
env
# The URL of your backend server
VITE_API_URL=http://localhost:5000


### 3. Installation

#### Install Dependencies for both services:
bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install


### 4. Start Services

You will need two separate terminals to run the backend and frontend servers simultaneously.

bash
# Terminal 1: Start Backend Server
cd backend
npm run start
bash
# Terminal 2: Start Frontend Development Server
cd frontend
npm run dev
```

### 5. Access Application
-   *Frontend Application*: [http://localhost:5173](http://localhost:5173) (or the port specified by Vite)
-   *Backend API*: [http://localhost:5000](http://localhost:5000)

---

## 🔒 Security Features

-   *JWT Authentication*: All sensitive API routes are protected and require a valid JSON Web Token.
-   *Password Hashing*: User passwords are never stored in plain text. They are securely hashed using bcrypt.js before being saved to the database.
-   *Admin Authorization Middleware*: A custom middleware layer on the backend verifies that the user has an 'Admin' role before allowing access to protected routes.
-   *Environment Variables*: All secret keys, database strings, and sensitive configurations are kept out of the source code in .env files.
-   *CORS Protection*: The backend is configured to only allow requests from the designated frontend URL, preventing cross-origin attacks.

---

## 📊 User Roles & Permissions

The application implements a simple but effective role-based access system.

| Role | View/Filter Rooms | Book a Room | Leave a Review | Create/Edit Rooms |
|------|:-----------------:|:-----------:|:--------------:|:-----------------:|
| *User* | ✅ | ✅ | ✅ | ❌ |
| *Admin*| ✅ | ✅ | ✅ | ✅ |

---

## System Architecture

The application is designed with a decoupled client-server architecture, which is standard for modern web applications.

![System Architecture Diagram](https://i.imgur.com/example-architecture.png)
A simple diagram showing the flow: The React Frontend communicates with the Node.js/Express Backend API, which in turn queries the MongoDB database. Real-time updates are pushed back to the client via Socket.IO.

---

## 📸 Screenshots

<table>
  <tr>
    <td colspan="2"><strong>Homepage & Features</strong></td>
  </tr>
  <tr>
    <td><img src="[https://github.com/user-attachments/assets/b0343c6f-fa23-4dfd-9ada-672dad730adc](https://github.com/user-attachments/assets/b0343c6f-fa23-4dfd-9ada-672dad730adc)" alt="Homepage Hero Section" /></td>
    <td><img src="[https://github.com/user-attachments/assets/6f4f5b98-1a23-4d96-b158-e6653a9ac69a](https://github.com/user-attachments/assets/6f4f5b98-1a23-4d96-b158-e6653a9ac69a)" alt="Homepage Features Section" /></td>
  </tr>
  <tr>
    <td><strong>Rooms List & Filtering</strong></td>
    <td><strong>Admin Panel</strong></td>
  </tr>
  <tr>
    <td><img src="[https://github.com/user-attachments/assets/f3e201b1-83d9-477f-a24b-b583a80bec92](https://github.com/user-attachments/assets/f3e201b1-83d9-477f-a24b-b583a80bec92)" alt="Rooms List and Filtering" /></td>
    <td><img src="[https://github.com/user-attachments/assets/3c847cc3-2ffb-4082-97c7-623651b15b59](https://github.com/user-attachments/assets/3c847cc3-2ffb-4082-97c7-623651b15b59)" alt="Admin Panel to Manage Rooms" /></td>
  </tr>
</table>

---
