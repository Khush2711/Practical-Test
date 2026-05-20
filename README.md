# Auth API

A RESTful authentication API built with Node.js, Express, MongoDB, and JWT — featuring access/refresh token rotation, rate limiting, and protected user routes.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** MongoDB via Mongoose
- **Auth:** JSON Web Tokens (jsonwebtoken) + bcryptjs
- **Rate Limiting:** express-rate-limit

---

## Project Structure

```
├── index.js                          # App entry point
├── DB/
│   └── db_utilise.js                 # MongoDB connection
├── Controllers/
│   ├── auth.controller.js            # Register, login, logout, refresh
│   └── user.controller.js            # Get profile, update details, update password
├── Middleware/
│   ├── auth.js                       # JWT protect middleware
│   └── jwt.js                        # Token generation & verification
├── Models/
│   └── user.model.js                 # Mongoose user schema
└── Routes/
    ├── auth.routes.js                # /api/auth — logout, refresh
    ├── login-register.routes.js      # /api/auth — register, login (rate limited)
    └── user.routes.js                # /api/user — protected user routes
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone <repo-url>
cd <project-folder>
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=4000
DB_URL=mongodb://localhost:27017/your-db-name

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m

REFRESH_SECRET=your_refresh_token_secret
REFRESH_EXPIRES_SECRET=7d
```

### Run

```bash
node index.js
```

The server starts at `http://localhost:4000`.

---

## API Reference

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Check` | Confirms the API is live |

---

### Auth Routes — `/api/auth`

Rate limited to **10 requests per minute** on register and login.

#### Register

```
POST /api/auth/register
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registered Successfully",
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": { "id": "...", "email": "..." }
}
```

---

#### Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

#### Logout

```
POST /api/auth/logout
```

**Body:**
```json
{
  "refreshToken": "<refresh_token>"
}
```

---

#### Refresh Token

```
POST /api/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "<refresh_token>"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "<new_access_token>",
  "refreshToken": "<new_refresh_token>"
}
```

---

### User Routes — `/api/user`

All routes require the `Authorization` header:

```
Authorization: Bearer <access_token>
```

#### Get Current User

```
GET /api/user/me
```

#### Update Profile

```
PUT /api/user/update
```

**Body** (all fields optional):
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com"
}
```

#### Update Password

```
PUT /api/user/update-password
```

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Authentication Flow

1. **Register / Login** → receive `accessToken` (short-lived) and `refreshToken` (long-lived)
2. **Protected requests** → send `accessToken` in the `Authorization: Bearer` header
3. **Token expired** → call `/api/auth/refresh` with the `refreshToken` to get a new pair
4. **Logout** → call `/api/auth/logout` to invalidate the refresh token server-side

---

## Error Responses

All errors follow this shape:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid fields |
| 401 | Unauthenticated / invalid credentials |
| 403 | Invalid refresh token |
| 409 | Email already in use |
| 429 | Too many requests (rate limit) |
| 500 | Internal server error |
