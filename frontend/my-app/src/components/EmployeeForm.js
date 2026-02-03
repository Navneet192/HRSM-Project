import React, { useState } from 'react';
import { createEmployee } from '../api/api';

export default function EmployeeForm({ onCreated, onClose }) {
  const [form, setForm]       = useState({ employee_id: '', full_name: '', email: '', department: '' });
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await createEmployee(form);
      onCreated();
    } catch (err) {
      setErrors(err?.message || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Employee</h2>
        <form onSubmit={submit} noValidate>
          {[
            { name: 'employee_id', label: 'Employee ID' },
            { name: 'full_name',   label: 'Full Name' },
            { name: 'email',       label: 'Email Address', type: 'email' },
            { name: 'department',  label: 'Department' },
          ].map(({ name, label, type = 'text' }) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={change}
                required
                autoComplete="off"
              />
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit"  className="btn btn-primary"  disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
