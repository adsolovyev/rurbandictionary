import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

interface User {
  id: number;
  login: string;
  email: string;
}

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) return;

    const timer = setTimeout(() => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      fetch(`/api/admin/users/search?q=${encodeURIComponent(searchTerm)}`, {
        credentials: 'include',
        signal: abortControllerRef.current.signal,
      })
        .then(res => res.json())
        .then(data => {
          if (isMounted.current) setUsers(data);
        })
        .catch(err => {
          if (err.name !== 'AbortError' && isMounted.current) console.error(err);
        })
        .finally(() => {
          if (isMounted.current) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        if (isMounted.current) {
          setMessage(`Пароль для пользователя ${userId} изменен`);
          setResetUserId(null);
          setNewPassword('');
          setTimeout(() => setMessage(''), 3000);
          setSearchTerm('');
          setUsers([]);
        }
      } else {
        if (isMounted.current) setMessage('Ошибка сброса');
      }
    } catch {
      if (isMounted.current) setMessage('Ошибка сети');
    }
  };

  if (!user?.isAdmin) return <Navigate to="/" />;

  const showResults = searchTerm.length >= 2 && !loading && users.length > 0;
  const showNoResults = searchTerm.length >= 2 && !loading && users.length === 0;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#fff' }}>Сброс пароля пользователя</h1>
      {message && <div style={{ padding: '8px', marginBottom: '16px', background: '#4caf50', color: '#fff', borderRadius: '4px' }}>{message}</div>}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Почта или имя пользователя"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#1e242c',
            border: '1px solid #2a2f3a',
            color: '#fff',
            borderRadius: '4px',
          }}
        />
      </div>
      {loading && <div style={{ color: '#fff' }}>Поиск...</div>}
      {showResults && (
        <div style={{ background: '#2a2f3a', borderRadius: '8px', overflow: 'hidden' }}>
          {users.map(u => (
            <div key={u.id} style={{ padding: '12px', borderBottom: '1px solid #3a3f4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ color: '#fff' }}>{u.login}</strong><br />
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{u.email}</span>
              </div>
              <div>
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
                  <button onClick={() => setResetUserId(u.id)} style={{ background: '#ff9800', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Изменить пароль</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {showNoResults && <div style={{ color: '#aaa', marginTop: '10px' }}>Пользователь не найден.</div>}
    </div>
  );
}