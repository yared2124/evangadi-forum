
# Evangadi Forum – Q&A Platform

A full-stack community forum where users can ask questions, share knowledge, and get answers. Built with React (Vite) on the frontend and Node.js/Express/MySQL on the backend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## ✨ Features

- **User Authentication** – Sign up, login, and JWT-based session management
- **Ask Questions** – Registered users can post new questions with title and description
- **Answer Questions** – Users can provide answers to existing questions
- **View All Questions** – Homepage lists all questions with author and date
- **Single Question View** – View a question and all its answers on one page
- **Protected Routes** – Only authenticated users can ask questions or post answers
- **Responsive Design** – Works on desktop, tablet, and mobile
- **RESTful API** – Fully documented endpoints for all actions

---

## 🛠️ Tech Stack

### Backend
- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **MySQL** – Relational database
- **JWT** – Authentication tokens
- **bcrypt** – Password hashing

### Frontend
- **React 18** – UI library
- **Vite** – Build tool and dev server
- **React Router DOM v6** – Client-side routing
- **Axios** – HTTP client
- **Context API** – Global authentication state

---

## 📁 Project Structure

```
evangadi-forum/
├── backend/
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── controllers/
│   │   ├── userController.js   # register, login, checkUser
│   │   ├── questionController.js
│   │   └── answerController.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── questionRoutes.js
│   │   └── answerRoutes.js
│   ├── sql/
│   │   └── init.sql            # Database schema
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── client/vite-project/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Header.css
    │   │   ├── Footer.jsx
    │   │   └── Footer.css
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Home.css
    │   │   ├── Login.jsx
    │   │   ├── Login.css
    │   │   ├── Register.jsx
    │   │   ├── Register.css
    │   │   ├── AskQuestion.jsx
    │   │   ├── AskQuestion.css
    │   │   ├── QuestionPage.jsx
    │   │   ├── QuestionPage.css
    │   │   └── About.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── axiosConfig.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🔧 Prerequisites

- **Node.js** v14 or higher
- **MySQL** v8 or higher
- **npm** or **yarn**

---

## 🚀 Backend Setup

1. **Clone the repository** and navigate to the backend folder:
   ```bash
   cd evangadi-forum/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=evangadi_forum
   JWT_SECRET=your_super_secret_key
   ```

4. **Create the database**:
   - Log into MySQL: `mysql -u root -p`
   - Run the schema script:
     ```bash
     mysql -u root -p < sql/init.sql
     ```
   Or copy the contents of `init.sql` and execute manually.

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

---

## 🎨 Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd evangadi-forum/client/vite-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

> The frontend uses Vite's proxy to avoid CORS issues. If you change the backend port, update both `.env` and `vite.config.js` proxy target.

---

## 📡 API Endpoints

All endpoints are prefixed with `/api`. Authentication (except register/login) requires a Bearer token.

| Method | Endpoint                     | Description                     | Auth Required |
|--------|------------------------------|---------------------------------|---------------|
| POST   | `/api/user/register`         | Create a new user               | ❌            |
| POST   | `/api/user/login`            | Login and receive JWT token     | ❌            |
| GET    | `/api/user/checkUser`        | Get current authenticated user  | ✅            |
| GET    | `/api/question`              | Fetch all questions             | ❌            |
| GET    | `/api/question/:question_id` | Fetch a single question         | ❌            |
| POST   | `/api/question`              | Create a new question           | ✅            |
| GET    | `/api/answer/:question_id`   | Fetch all answers for a question| ❌            |
| POST   | `/api/answer`                | Submit an answer                | ✅            |

### Example Request (Login)
```json
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "12345678"
}
```

### Example Response (Login)
```json
{
  "message": "User login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Example Protected Request
```http
GET /api/user/checkUser
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Environment Variables

### Backend `.env`

| Variable       | Description                    | Default         |
|----------------|--------------------------------|-----------------|
| PORT           | Server port                     | 5000            |
| DB_HOST        | MySQL host                      | localhost       |
| DB_USER        | MySQL user                      | root            |
| DB_PASSWORD    | MySQL password                  | (empty)         |
| DB_NAME        | Database name                   | evangadi_forum  |
| JWT_SECRET     | Secret key for JWT signing      | (required)      |

### Frontend `.env`

| Variable        | Description               | Default                         |
|-----------------|---------------------------|---------------------------------|
| VITE_API_URL    | Backend API base URL      | `http://localhost:5000/api`     |

---

## 📸 Screenshots

> Add your own screenshots here for:
> - Home page (list of questions)
> - Login / Register page
> - Question detail with answers
> - Ask a question form

---

## 🚧 Future Improvements

- **Pagination** – Load questions in batches
- **Search** – Filter questions by title or content
- **User profiles** – View user's questions and answers
- **Voting** – Upvote/downvote questions and answers
- **Rich text editor** – Format questions and answers
- **Dark mode** – Theme toggle
- **Email verification** – Confirm registration via email
- **Password reset** – Forgot password flow

---

## 📄 License

MIT © [Yared]



---

This README is tailored to your exact folder structure (Vite + React) and the backend we built. Just copy it into your `README.md` file at the root of your project (or in the main repository). You can replace the placeholder screenshots and license section with your own details.
