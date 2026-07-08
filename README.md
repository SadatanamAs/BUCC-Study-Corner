# BUCC Study Corner

BUCC Study Corner is a modern, secure, and performant web application built on the **MERN (MongoDB, Express.js, React, Node.js)** stack. This platform serves as a centralized hub where administrators can share curated educational videos (via YouTube links) with students to build a comprehensive, distraction-free study corner.

---

## 🚀 Backend & Security Core Architecture

The backend environment is built using **ES Modules** and structured for scalability, clean separation of concerns, and robust role-based access control (RBAC).

### Key Features
*   **Secure Authentication:** User registration, password encryption via `bcryptjs`, and stateless authentication using **JSON Web Tokens (JWT)**.
*   **Role-Based Access Control (RBAC):** Middleware validation gates that ensure only verified administrators can upload, edit, or delete video content, while allow student users to access the resources securely.
*   **Optimized Database Modeling:** Complete Mongoose Schemas representing users (with distinct permission roles) and YouTube links (with integrated URL validations).

---

## 📂 Project Structure

```
BUCC-Study-Corner/
├── client/                 # React frontend application
└── server/                 # Express backend application
    ├── config/             # Database connection setups
    │   └── db.js
    ├── controllers/        # Express handlers (Business logic)
    │   ├── authController.js
    │   └── videoController.js
    ├── middleware/         # Security & authentication gates
    │   └── authMiddleware.js
    ├── models/             # Mongoose Schemas (Data integrity)
    │   ├── User.js
    │   └── Video.js
    ├── routes/             # Express routing mapping
    │   ├── authRoutes.js
    │   └── videoRoutes.js
    ├── .env                # Secret environment variables (Excluded from git)
    ├── package.json        # Dependencies & scripts
    └── server.js           # Server initializer & core entrypoint
```

---

## 🛠️ Prerequisites

To run this project locally, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster)

---

## 💻 Installation & Environment Setup

Follow these steps to configure the backend environment:

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/BUCC-Study-Corner.git
cd BUCC-Study-Corner
```

### 2. Configure Backend Environment
Navigate to the server directory and install the necessary dependencies:
```bash
cd server
npm install
```

### 3. Configure Environment Variables
Copy the template `.env.example` file to create your local `.env` configuration:
```bash
cp .env.example .env
```
Open `.env` and fill in your environment parameters:
*   `PORT`: Port to listen on (e.g., `5001`). Note that macOS reserves port `5000` for AirPlay.
*   `MONGO_URI`: Your MongoDB connection URI.
*   `JWT_SECRET`: A secure signing key for JWT tokens.
*   `NODE_ENV`: Mode (`development` or `production`).


---

## 🏃 Running the Application

### Development Mode (with Nodemon auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once started, test the API's responsiveness by making a GET request to `http://localhost:5001/` which should return:
```json
{
  "message": "Study Corner API is running..."
}
```

---

## 📡 API Reference Documentation

All requests should be prefixed with the server's base URL (e.g., `http://localhost:5001`).

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body Payload |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new user account | `{ "name": "...", "email": "...", "password": "...", "departmentReference": "?" }` — `departmentReference` is optional; if it matches the server's `ADMIN_BOOTSTRAP_TOKEN` env var, the account is created as `admin`, otherwise as `user`. |
| **POST** | `/api/auth/login` | Public | Authenticate user & retrieve JWT | `{ "email": "...", "password": "..." }` |
| **GET** | `/api/auth/profile` | Private (User) | Retrieve authenticated user profile | *Requires Bearer Token* |

### Video Management Routes (`/api/videos`)

| Method | Endpoint | Access | Description | Request Body Payload |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/videos` | Public | Get all posted videos | None |
| **POST** | `/api/videos` | Private (Admin) | Post a new YouTube video link | `{ "title": "...", "youtubeId": "dQw4w9WgXcQ", "category": "...", "tags": ["..."] }` *Requires Bearer Token* |
| **PUT** | `/api/videos/:id` | Private (Admin) | Update video details | `{ "title": "...", "youtubeId": "...", "category": "...", "tags": ["..."] }` *Requires Bearer Token* |
| **DELETE** | `/api/videos/:id` | Private (Admin) | Delete a posted video by database ID | *Requires Bearer Token* |

---

## 🛡 Creating the First Admin

Public registration always creates a `user` account — unless the request includes an optional `departmentReference` field whose value matches the server's `ADMIN_BOOTSTRAP_TOKEN` env var. In that case, the account is created as `admin` directly.

### Setup

1. Generate a secret (once, then keep it private):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Set `ADMIN_BOOTSTRAP_TOKEN` to that value in `server/.env` (local) **or** in the backend Vercel project's Environment Variables (prod). Redeploy if you change it on Vercel — env vars need a fresh build to take effect.

### Self-service signup

The future admin just signs up and supplies the secret in the optional `departmentReference` field:

```bash
curl -X POST https://<your-server>.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@bucc.com",
    "password": "a-strong-password",
    "departmentReference": "<paste the secret here>"
  }'
```

If `departmentReference` matches the server's `ADMIN_BOOTSTRAP_TOKEN`, the response includes `"role": "admin"`. Otherwise it includes `"role": "user"`. The server never reveals whether the reference was wrong — it silently creates a regular user.

The admin can now sign in at `/login?role=admin` and access `/admin` plus the protected `POST /api/videos` / `DELETE /api/videos/:id` endpoints.

### Locking it down

To permanently stop new admins from being created via signup, delete `ADMIN_BOOTSTRAP_TOKEN` from the server's env vars and redeploy. With the env var unset, signup always creates `user` accounts — even when a `departmentReference` is supplied.

---

## 🛠️ Roadmap: Completing the Rest of the Project

Follow this guide to build the remaining layers of the system:

### Phase 1: Authentication Front-End
1. Set up routing in React client (`client/`) using `react-router-dom`.
2. Design custom Sign Up and Log In screens (ensure high-quality aesthetics, smooth animations, and interactive hover effects).
3. Connect the forms to `/api/auth/register` and `/api/auth/login`, and persist the returned JWT inside `localStorage` or context state.

### Phase 2: Video Dashboard
1. Build a responsive layout grid to showcase videos. Make sure to embed the YouTube video player using `react-player` or a standard iframe.
2. Call the `GET /api/videos` endpoint on page load to display all posted study corner content.

### Phase 3: Admin Management Core
1. Restrict the "Post Video" panel to users having the `admin` role in their decoded JWT payload.
2. Build an interactive form for administrators to type the **Video Title** and paste the **YouTube URL**.
3. Integrate API calls to `POST /api/videos` (attaching the JWT inside the `Authorization: Bearer <token>` header) and trigger a state reload to display the newly posted video instantly.
