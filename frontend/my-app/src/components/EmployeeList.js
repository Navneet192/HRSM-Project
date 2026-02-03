import React, { useState, useEffect, useCallback } from 'react';
import { fetchEmployees, deleteEmployee } from '../api/api';
import EmployeeForm  from './EmployeeForm';
import ConfirmModal  from './ConfirmModal';
import Spinner       from './Spinner';
import EmptyState    from './EmptyState';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await fetchEmployees());
    } catch {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    await deleteEmployee(deleteId);
    setDeleteId(null);
    load();
  };

  if (loading) {
    return (
      <div className="page-content">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="error-banner">
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={load}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="page-subtitle">Manage your organisation's employee records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Employee</button>
      </div>

      {employees.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="👤"
            title="No employees yet"
            description='Click "Add Employee" to create your first record.'
          />
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td className="col-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(emp.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <EmployeeForm
          onCreated={() => { setShowForm(false); load(); }}
          onClose={() => setShowForm(false)}
        />
      )}

      {deleteId !== null && (
        <ConfirmModal
          title="Delete Employee"
          message="This will permanently remove the employee and all related attendance records. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
