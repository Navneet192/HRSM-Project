import React from 'react';

export default function EmployeeSelect({ id, name, value, onChange, employees, placeholder = '— Select —' }) {
  return (
    <select id={id} name={name} value={value} onChange={onChange} required>
      <option value="">{placeholder}</option>
      {employees.map((e) => (
        <option key={e.id} value={e.id}>{e.employee_id} – {e.full_name}</option>
      ))}
    </select>
  );
}
