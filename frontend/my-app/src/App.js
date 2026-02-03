import React, { useState } from 'react';
import './App.css';
import EmployeeList   from './components/EmployeeList';
import AttendanceList from './components/AttendanceList';

const NAV = [
  { key: 'employees',  label: 'Employees' },
  { key: 'attendance', label: 'Attendance' },
];

export default function App() {
  const [page, setPage] = useState('employees');

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">HRMS Lite</div>
        <nav>
          {NAV.map(({ key, label }) => (
            <button
              key={key}
              className={`nav-link${page === key ? ' active' : ''}`}
              onClick={() => setPage(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {page === 'employees'  && <EmployeeList  />}
        {page === 'attendance' && <AttendanceList />}
      </main>
    </div>
  );
}
