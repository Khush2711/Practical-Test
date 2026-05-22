# MERN Stack User Authentication & Profile Management System

This is a full-stack MERN (MongoDB, Express, React, Node.js) application built for a practical assessment. It features a complete user authentication system with JWT access and refresh tokens, profile management, and profile picture uploads.

---

## 🏗️ Project Structure

The repository is divided into two main directories:

- `Backend/`: Node.js & Express API with MongoDB.
- `Frontend/`: React application built with Vite and Tailwind CSS.

---

## ⚙️ Backend Setup Guide

The backend handles all business logic, database interactions, authentication, and secure routing.

### Technologies Used
- Node.js & Express v5
- MongoDB (Mongoose)
- JWT (Access & Refresh Tokens) + bcryptjs
- express-rate-limit (API Throttling)
- multer (Profile Picture Uploads)
- cors

### Backend Structure
```text
Backend/
├── index.js                          # App entry point & configuration
├── DB/
│   └── db_utilise.js                 # Database connection logic
├── Controllers/
│   ├── auth.controller.js            # Register, login, logout, refresh logic
│   └── user.controller.js            # Profile fetching, updates, and uploads
├── Middleware/
│   ├── auth.js                       # JWT protection middleware
│   ├── jwt.js                        # Token generation & verification logic
│   └── upload.js                     # Multer configuration for image uploads
├── Models/
│   └── user.model.js                 # Mongoose user schema
└── Routes/
    ├── auth.routes.js                # Logout & token refresh routes
    ├── login-register.routes.js      # Register & login routes (Rate limited)
    └── user.routes.js                # Protected user and profile routes
```

### Installation & Execution

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file inside the `Backend` folder with the following structure:
   ```env
   PORT=4000
   DB_URL=mongodb://localhost:27017/mern-assessment
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=15m
   REFRESH_SECRET=your_refresh_secret_here
   REFRESH_EXPIRES_SECRET=7d
   ```

4. Start the server:
   ```bash
   node index.js
   ```
   The backend will start at `http://localhost:4000`.

---

## 💻 Frontend Setup Guide

The frontend provides a responsive, modern interface for users to authenticate and manage their profiles.

### Technologies Used
- React (Vite)
- React Router DOM
- React Hook Form (Form Validation)
- Tailwind CSS v3 (UI Styling)
- Axios (API requests)
- React Hot Toast (Notifications)
- Lucide React (Icons)

### Frontend Structure
```text
Frontend/
├── index.html                        # HTML template
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind configuration
└── src/
    ├── main.jsx                      # React entry point & Provider wrapping
    ├── App.jsx                       # Application router
    ├── index.css                     # Global styles & Tailwind directives
    ├── api/
    │   └── axios.js                  # Axios instance with auth interceptors
    ├── context/
    │   └── AuthContext.jsx           # Global state for user authentication
    ├── components/
    │   ├── Header.jsx                # Navigation bar
    │   ├── Footer.jsx                # Footer
    │   └── ProtectedRoute.jsx        # Route guard for authenticated pages
    └── pages/
        ├── Home.jsx                  # Landing page
        ├── Login.jsx                 # User login page
        ├── Register.jsx              # User registration page
        ├── Dashboard.jsx             # User dashboard
        ├── EditProfile.jsx           # Update profile details & picture
        └── ChangePassword.jsx        # Update password form
```

### Installation & Execution

1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.
