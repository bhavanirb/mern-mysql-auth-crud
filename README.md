# MERN Stack Authentication System with MySQL Database & Dashboard CRUD

A full-stack web application built with **React.js**, **Node.js**, **Express.js** and **MySQL** featuring complete user authentication and a dashboard with full CRUD operations.

---

## 🚀 Tech Stack

### Frontend
- React.js — Component-based UI
- React Router — Client-side routing
- Axios — HTTP client for API calls
- Tailwind CSS — Utility-first CSS framework
- React Context API — Global state management

### Backend
- Node.js — JavaScript runtime
- Express.js — Web application framework
- MySQL — Relational database
- mysql2 — MySQL client for Node.js
- bcryptjs — Password hashing
- jsonwebtoken (JWT) — Token-based authentication
- Nodemailer — Email sending for password reset

---

## 📁 Project Structure
mern-mysql-auth-crud/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   └── itemApi.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
├── database.sql
├── screenshots/
└── README.md

---

## 🗄️ MySQL Database Setup

### Step 1 — Install MySQL
Download and install XAMPP from https://apachefriends.org

### Step 2 — Start MySQL
1. Open XAMPP Control Panel
2. Click **Start** next to **MySQL**
3. Click **Start** next to **Apache**
4. Both should turn green

### Step 3 — Create Database and Tables
1. Open browser and go to http://localhost/phpmyadmin
2. Click the **SQL** tab
3. Copy and paste the contents of `database.sql`
4. Click **Go**

### Step 4 — Verify
On the left sidebar you should see:
mern_auth_db
├── items
└── users

---

## ⚙️ Backend Setup

### Step 1 — Navigate to backend folder
```bash
cd backend
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Create environment file
Create a `.env` file inside the `backend` folder:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mern_auth_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

### Step 4 — Start the backend server
```bash
npm run dev
```

You should see:
Server running on http://localhost:5000
MySQL Connected Successfully!

---

## 🎨 Frontend Setup

### Step 1 — Navigate to frontend folder
```bash
cd frontend
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the frontend
```bash
npm run dev
```

Frontend runs on http://localhost:5173

---

## 🔗 API Endpoints

### Authentication Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| POST | `/api/auth/forgot-password` | Send reset email | Public |
| POST | `/api/auth/reset-password` | Reset with token | Public |
| GET | `/api/auth/me` | Get logged in user | Protected |

### Item Routes — `/api/items`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/items` | Get all user items | Protected |
| GET | `/api/items/:id` | Get single item | Protected |
| POST | `/api/items` | Create new item | Protected |
| PUT | `/api/items/:id` | Update item | Protected |
| DELETE | `/api/items/:id` | Delete item | Protected |
| GET | `/api/items/stats` | Get dashboard stats | Protected |

### Example Request — Register
```json
POST /api/auth/register
{
  "name": "Bhavani B",
  "email": "bhavani@example.com",
  "phone": "9999999999",
  "password": "test1234"
}
```

### Example Response — Login
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Bhavani B",
    "email": "bhavani@example.com",
    "phone": "9999999999"
  }
}
```

---

## ✨ Features

### Authentication
- User registration with password hashing (bcryptjs)
- User login with JWT token generation
- Password reset via email (Nodemailer)
- Protected routes — redirects to login if not authenticated
- Public routes — redirects to dashboard if already logged in
- Token stored in localStorage — persists after page refresh
- Auto logout on token expiry (401 response)

### Dashboard
- Statistics cards showing Total, Active, Pending, Completed counts
- Add new items with title, description and status
- Edit existing items
- Delete items with confirmation dialog
- Status badges with color coding
- Real-time stats update after every operation

### Security
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with expiry
- Parameterized SQL queries (prevents SQL injection)
- CORS configured for frontend origin
- Sensitive data never returned in responses

---

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | (empty for XAMPP) |
| DB_NAME | Database name | mern_auth_db |
| JWT_SECRET | Secret key for JWT | mysecretkey123 |
| JWT_EXPIRE | Token expiry time | 7d |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Sender email | you@gmail.com |
| EMAIL_PASS | Email app password | xxxx xxxx xxxx |

---

## 📸 Screenshots

| Page | Screenshot |
|------|-----------|
| Login | ![Login](screenshots/login.png) |
| Register | ![Register](screenshots/register.png) |
| Dashboard | ![Dashboard](screenshots/dashboard.png) |
| CRUD Operations | ![CRUD](screenshots/crud-operations.png) |
| MySQL Database | ![MySQL](screenshots/mysql-database.png) |

---

## 🛠️ Common Issues & Fixes

**MySQL Connection Error**
- Make sure XAMPP MySQL is running (green in control panel)
- Check `.env` has `DB_PASSWORD=` (empty, no quotes)

**Port already in use**
- Change `PORT=5001` in `.env`

**CORS Error**
- Make sure backend is running on port 5000
- Check `app.use(cors())` is in `server.js`

**Token expired**
- Login again to get a fresh token
- Tokens expire after 7 days

---

## 👨‍💻 Author

**Bhavani B**
Institution: CampusPe
Mentor: Jacob Dennis

---

## 📄 License

This project is created for educational purposes as part of the CampusPe Full Stack Development Assignment.
Save. Ctrl + S.

