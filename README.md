# HRMS Lite

A small, full-stack HR tool for managing employees and tracking daily attendance.
Nothing fancy — just the things an HR admin actually needs to do every day, built cleanly
and deployed end to end.

---

## What it does

- **Employee management** — add employees with an ID, name, email and department.
  View the full list. Delete someone when they leave (attendance history goes with them).
- **Attendance tracking** — pick an employee, pick a date, mark them Present or Absent.
  Filter the records table by employee so you can see one person's history at a glance.

Every action talks to a real database. Validation happens on the server — duplicate IDs,
bad emails, double-marking the same day — all caught before anything is saved, with plain
error messages that show up right where you'd expect them.

---

## How the project is laid out

```
HRMS/
├── backend/
│   └── hrsmbackend/            ← Django project root (where manage.py lives)
│       ├── Hrmember/           ← the Django app (models, views, serializers, etc.)
│       ├── hrsmbackend/        ← Django settings, urls, wsgi
│       ├── requirements.txt    ← Python dependencies
│       ├── build.sh            ← Render build script
│       └── Procfile            ← tells Render how to start the server
└── frontend/
    └── my-app/                 ← React app (Create React App)
        └── src/
            ├── api/            ← all fetch calls to the backend live here
            ├── components/     ← every React component
            ├── App.js          ← top-level layout and sidebar nav
            └── App.css         ← all styles in one place
```

---

## Tech stack

| Layer | What | Why |
|---|---|---|
| Frontend | React 19, plain CSS | Simple and fast. No router library needed — the app only has two pages. |
| Backend | Django 6 + Django REST Framework | Solid, batteries-included. Serializer validation is thorough out of the box. |
| Database | SQLite locally, PostgreSQL on Render | SQLite means zero setup when you clone and run. Postgres in production because it actually persists across deploys. |
| Deployment | Render (backend + DB), Vercel or Netlify (frontend) | Both have free tiers that work for this. |

---

## Running it locally

You need Python 3.10+ and Node 18+ installed.

### 1. Backend

```bash
cd backend/hrsmbackend

# create and activate a virtual environment
python -m venv venv
source venv/bin/activate          # on Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# create the database tables
python manage.py migrate

# start the server
python manage.py runserver
```

The API will be at `http://localhost:8000/api/`. You can open that URL directly in the
browser — Django REST Framework gives you a clickable interface to test the endpoints.

### 2. Frontend

Open a second terminal:

```bash
cd frontend/my-app
npm install
npm start
```

The app opens at `http://localhost:3000` and talks to the backend automatically.

---

## API endpoints

Everything is under `/api/`. No authentication required.

### Employees

| Method | URL | What it does |
|---|---|---|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/` | Add one (send `employee_id`, `full_name`, `email`, `department`) |
| DELETE | `/api/employees/{id}/` | Remove one by its database ID |

### Attendance

| Method | URL | What it does |
|---|---|---|
| GET | `/api/attendances/` | All records |
| GET | `/api/attendances/?employee_id={id}` | Records for one employee |
| POST | `/api/attendances/` | Mark attendance (send `employee`, `date`, `status`) |

`status` must be exactly `Present` or `Absent`. You can't mark the same employee twice on the same date — the API will tell you if you try.

---

## Deploying

### Backend → Render

1. Push the repo to GitHub.
2. On Render, create a **PostgreSQL** database (free tier). Copy the internal database URL.
3. Create a **Web Service**, point it at your repo, set the root directory to `backend/hrsmbackend`.
4. Set the build command to `./build.sh` and the start command to what's in the `Procfile`.
5. Add these environment variables on the service:
   - `DATABASE_URL` — the URL you copied from the database
   - `SECRET_KEY` — any long random string
   - `DEBUG` — `False`
   - `CORS_ALLOWED_ORIGINS` — your frontend's live URL (fill this in after deploying the frontend)
6. Deploy. Wait for it to go green.

### Frontend → Vercel (or Netlify)

1. On Vercel, import the repo. Set the root directory to `frontend/my-app`.
2. Before deploying, add an environment variable:
   - `REACT_APP_API_BASE` — your Render backend URL (e.g. `https://hrms-backend.onrender.com/api`)
   - Then update `src/api/api.js` to use `process.env.REACT_APP_API_BASE` instead of the hardcoded localhost URL.
3. Deploy. Done.

---

## Assumptions and limitations

- There's no login. The whole app is assumed to be internal-only, used by a single admin.
- Leave management, payroll, and anything beyond employees + attendance are out of scope.
- The frontend currently points to `localhost:8000` by default. For production you swap that
  to the live backend URL (see deployment section above).
- SQLite is only used when running locally. The deployed version uses PostgreSQL.
