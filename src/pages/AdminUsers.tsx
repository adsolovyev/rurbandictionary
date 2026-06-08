import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

interface User {
  id: number;
  login: string;
  email: string;
}

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch('/api/admin/users', { credentials: 'include' })
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleReset = async (userId: number) => {
  if (!newPassword) {
    alert('Введите новый пароль');
    return;
  }
  try {
    const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
      credentials: 'include',
    });
    if (res.ok) {
      setMessage(`Пароль для пользователя ${userId} сброшен`);
      setResetUserId(null);
      setNewPassword('');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Ошибка сброса');
    }
  } catch (err) {
    void err;
    setMessage('Ошибка сети');
  }
};

  if (!user?.isAdmin) return <Navigate to="/" />;
  if (loading) return <div style={{ color: '#fff' }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#fff' }}>Управление пользователями</h1>
      {message && <div style={{ padding: '8px', marginBottom: '16px', background: '#4caf50', color: '#fff', borderRadius: '4px' }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#2a2f3a', color: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#1e242c' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Логин</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #3a3f4a' }}>
              <td style={{ padding: '12px' }}>{u.id}</td>
              <td style={{ padding: '12px' }}>{u.login}</td>
              <td style={{ padding: '12px' }}>{u.email}</td>
              <td style={{ padding: '12px' }}>
                {resetUserId === u.id ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Новый пароль"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: 'none' }}
                    />
                    <button onClick={() => handleReset(u.id)} style={{ background: '#4caf50', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Сохранить</button>
                    <button onClick={() => { setResetUserId(null); setNewPassword(''); }} style={{ background: '#f44336', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                  </div>
                ) : (
                  <button onClick={() => setResetUserId(u.id)} style={{ background: '#ff9800', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Сбросить пароль</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}