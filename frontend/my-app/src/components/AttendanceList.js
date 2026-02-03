import React, { useState, useEffect, useCallback } from 'react';
import { fetchEmployees, fetchAttendances, createAttendance } from '../api/api';
import EmployeeSelect from './EmployeeSelect';
import Spinner        from './Spinner';
import EmptyState     from './EmptyState';

/* pull the first meaningful string out of the backend error envelope */
function extractMessage(err) {
  const msg = err?.message;
  if (!msg) return 'Something went wrong.';
  if (typeof msg === 'string') return msg;
  const first = Object.values(msg).flat().find(Boolean);
  return first || 'Something went wrong.';
}

export default function AttendanceList() {
  const [employees,  setEmployees]  = useState([]);
  const [records,    setRecords]    = useState([]);
  const [filter,     setFilter]     = useState('');
  const [form,       setForm]       = useState({ employee: '', date: new Date().toISOString().slice(0, 10), status: 'Present' });
  const [formError,  setFormError]  = useState(null);
  const [loadError,  setLoadError]  = useState(null);
  const [loading,    setLoading]    = useState(true);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setEmployees(await fetchEmployees());
    } catch {
      setLoadError('Failed to load employee list. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecords = useCallback(async (empId) => {
    setRecords(await fetchAttendances(empId || null));
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);
  useEffect(() => { if (!loading && !loadError) loadRecords(filter); }, [filter, loading, loadError, loadRecords]);

  const changeForm   = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setFormError(null); };
  const changeFilter = (e) => setFilter(e.target.value);

  const submit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createAttendance({ ...form, employee: Number(form.employee) });
      loadRecords(filter);
      setForm({ ...form, date: new Date().toISOString().slice(0, 10) });
    } catch (err) {
      setFormError(extractMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Spinner />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-content">
        <div className="error-banner">
          <p>{loadError}</p>
          <button className="btn btn-primary btn-sm" onClick={loadEmployees}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p className="page-subtitle">Mark and review daily attendance for employees</p>
        </div>
      </div>

      {/* ── Mark attendance form ── */}
      <div className="card">
        <h3>Mark Attendance</h3>
        <form onSubmit={submit} className="inline-form" noValidate>
          <div className="form-group">
            <label htmlFor="att-employee">Employee</label>
            <EmployeeSelect
              id="att-employee"
              name="employee"
              value={form.employee}
              onChange={changeForm}
              employees={employees}
            />
          </div>

          <div className="form-group">
            <label htmlFor="att-date">Date</label>
            <input id="att-date" name="date" type="date" value={form.date} onChange={changeForm} required />
          </div>

          <div className="form-group">
            <label htmlFor="att-status">Status</label>
            <select id="att-status" name="status" value={form.status} onChange={changeForm} required>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Mark</button>
        </form>
        {formError && <p className="error">{formError}</p>}
      </div>

      {/* ── Filter + records table ── */}
      <div className="card">
        <div className="filter-row">
          <label htmlFor="att-filter">View records for:</label>
          <EmployeeSelect
            id="att-filter"
            name="filter"
            value={filter}
            onChange={changeFilter}
            employees={employees}
            placeholder="All Employees"
          />
        </div>

        {records.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No attendance records"
            description={filter ? 'This employee has no records yet.' : 'Mark attendance above to get started.'}
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.employee_name}</td>
                    <td>{r.date}</td>
                    <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
