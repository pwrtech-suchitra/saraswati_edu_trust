import React, { useState, useEffect } from 'react';

import { adminApi } from '../../api/adminApi';
import { Spinner } from '../../components/common/Loader';
import { useNotification } from '../../hooks/useNotification';

export default function AdminUsersPage() {
  const { showSuccess, showError } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await adminApi.getUsers();
        if (res.success) setUsers(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showSuccess(`Role updated to ${newRole}`);
    } catch {
      showError('Failed to change role');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>User & Role Management</h2>
        <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
          Assign operational roles (Admin, Staff, Member) across Saraswati Trust console.
        </p>
      </div>

      {loading ? (
        <Spinner text="Loading users roster..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Registered Date</th>
                <th>Assigned Role</th>
                <th style={{ textAlign: 'right' }}>Role Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-slate-900)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-400)' }}>{u.id}</div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.createdAt}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'ADMIN'
                          ? 'badge-danger'
                          : u.role === 'STAFF'
                          ? 'badge-warning'
                          : 'badge-emerald'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', display: 'inline-block', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
