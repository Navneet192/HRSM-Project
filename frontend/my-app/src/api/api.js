const BASE = 'http://localhost:8000/api';
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw data;       
  return data;
}
export const fetchEmployees   = ()   => request(`${BASE}/employees/`);
export const createEmployee   = (body) => request(`${BASE}/employees/`, { method: 'POST', body: JSON.stringify(body) });
export const deleteEmployee   = (id)  => request(`${BASE}/employees/${id}/`, { method: 'DELETE' });
export const fetchAttendances = (employeeId) => {
  const qs = employeeId ? `?employee_id=${employeeId}` : '';
  return request(`${BASE}/attendances/${qs}`);
};
export const createAttendance = (body) => request(`${BASE}/attendances/`, { method: 'POST', body: JSON.stringify(body) });
