# CRUD App - User Management Application

Full-stack user management application with React frontend and Express backend.

## Quick Start

```bash
# Install all dependencies (root, server, and client)
npm run install:all

# Run both server and client concurrently
npm start
# or
npm run dev
```

The backend will start on `http://localhost:3000` and the frontend on `http://localhost:3000` (React will auto-adjust port if 3000 is taken).

## Development

### Run individually

```bash
# Backend only (from root or test-sps-server/)
npm run dev:server

# Frontend only (from root or test-sps-react/)
npm run dev:client
```

## Environment Setup

1. Copy `.env.example` files:
```bash
cp test-sps-server/.env.example test-sps-server/.env
cp test-sps-react/.env.example test-sps-react/.env
```

2. Adjust ports if needed in `.env` files

## Project Structure

```
crud-app/
├── test-sps-server/    # Express backend (port 3000)
│   └── src/
│       ├── index.js
│       └── routes.js
└── test-sps-react/     # React frontend
    └── src/
        ├── pages/
        ├── services/
        └── routes.js
```

## Admin Credentials (for testing)

```
Email: admin@spsgroup.com.br
Password: 1234
```

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Express, JWT authentication, CORS
- **Storage**: In-memory (no database)

## API Endpoints (to be implemented)

- `POST /auth` - Authentication
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

All routes except `/auth` require JWT token in Authorization header.
