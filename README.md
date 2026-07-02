# School Attendance Management System

A full-stack attendance management system built with React + Express.js.

## Project Structure

```
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Sidebar, StatCard
│       ├── hooks/           # useApi (axios wrapper)
│       ├── pages/           # Dashboard, Students, Attendance, Classes, Reports
│       └── styles/          # Utility CSS
│
└── server/school-server/    # Express backend
    ├── api/                 # OpenAPI spec
    ├── controllers/         # Route handlers
    ├── services/            # Business logic
    └── utils/               # Router setup
```

## Quick Start

### 1. Start the Backend
```bash
cd server/school-server
npm install
npm run dev
```
Server starts at http://localhost:5000

### 2. Start the Frontend
```bash
cd client
npm install
npm start
```
App opens at http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/students | List students |
| POST | /api/v1/students | Add student |
| PUT | /api/v1/students/:id | Update student |
| DELETE | /api/v1/students/:id | Remove student |
| GET | /api/v1/classes | List classes |
| POST | /api/v1/classes | Create class |
| GET | /api/v1/attendance | Get attendance records |
| POST | /api/v1/attendance | Mark attendance |
| GET | /api/v1/attendance/stats | Get statistics |
| GET | /api/v1/schools | List schools |

## Features
- ✅ Mark attendance (Present / Absent / Late / Excused)
- ✅ Bulk mark all students present/absent
- ✅ Student CRUD with class assignment
- ✅ Class management with teacher info
- ✅ Dashboard with live statistics
- ✅ Reports with sortable student analytics
- ✅ Attendance history view
- ✅ Toast notifications

v2