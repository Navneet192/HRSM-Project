# HRMS Lite — Frontend

The React side of the HRMS Lite app. Two pages, a sidebar, and a handful of reusable
components. No routing library, no state management library — just React doing its thing.

---

## How it's structured

```
src/
├── api/
│   └── api.js              ← every network request goes through here.
│                              Change the backend URL in one place and it
│                              applies everywhere.
├── components/
│   ├── AttendanceList.js   ← the attendance page: mark form + filtered table
│   ├── EmployeeList.js     ← the employee page: table + add/delete
│   ├── EmployeeForm.js     ← modal form for adding an employee
│   ├── EmployeeSelect.js   ← reusable employee dropdown (used twice on the attendance page)
│   ├── ConfirmModal.js     ← reusable yes/no dialog (used for delete confirmation)
│   ├── EmptyState.js       ← the centered "nothing here yet" block
│   └── Spinner.js          ← the loading spinner
├── App.js                  ← the shell: sidebar nav + swaps between the two pages
├── App.css                 ← all styles, organised by section
├── index.js                ← React entry point
└── index.css               ← global body reset (font stack, margins)
```

---

## Running it

Make sure the backend is already running on `localhost:8000`. Then:

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

---

## What the components actually do

**App.js** is the layout shell. It renders the sidebar and decides which page component
to show based on a single piece of state. That's the entire "routing" — no extra library
needed for two pages.

**EmployeeList** fetches the employee list when it mounts. If the fetch fails you get a
red banner with a retry button instead of a blank screen. If the list is empty you get a
clear prompt to add someone. Each row has a delete button that opens a confirmation dialog
before anything actually happens.

**EmployeeForm** is a modal. It handles its own form state and submission. If the backend
returns validation errors (duplicate ID, invalid email, missing field) they show up directly
under the relevant input — the form doesn't just reset or go silent.

**AttendanceList** has two jobs: the mark-attendance form at the top, and the records table
below it. The table can be filtered to show one employee's history. Both the form and the
filter use the same **EmployeeSelect** component — same dropdown, same data, rendered once
in code and reused twice.

**Spinner, EmptyState, ConfirmModal** are all small, single-purpose components. They take
props for their content and render nothing else. Used in multiple places so the look and
feel stays consistent without copy-pasting JSX.

---

## Deploying (Vercel)

1. Push this folder to GitHub.
2. Go to Vercel, import the repo, set the root to `frontend/my-app`.
3. Before the first deploy, open `src/api/api.js` and replace the `BASE` URL with your
   live Render backend URL.
4. Deploy. That's it.

If you want to keep localhost working locally *and* point to a live backend in production,
set a `REACT_APP_API_BASE` environment variable on Vercel and update `api.js` to read from
`process.env.REACT_APP_API_BASE` with a localhost fallback.
