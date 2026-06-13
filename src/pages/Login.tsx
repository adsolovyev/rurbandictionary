import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const loginUser = useAuthStore(state => state.login);
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginUser(login, password);
      setAttempts(0);
      if (user.isAdmin) navigate('/admin');
      else navigate(redirectTo);
    } catch {
      setAttempts(prev => prev + 1);
      setError('Поля заполнены неверно');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: '48px', marginTop: '48px' }}>Войдите в аккаунт</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Почта или имя пользователя</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          {error && <div style={{ color: '#f44336', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'var(--link-color)', color: '#fff', border: 'none', borderRadius: '40px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--link-color)')}>Войти</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-color)' }}>Нет учетной записи? <a href="/register" style={{ color: 'var(--link-color)' }}>Зарегистрироваться</a></p>
        {attempts >= 2 && <div style={{ marginTop: '16px', color: '#ffaa00', fontSize: '0.85rem', textAlign: 'center' }}>Забыли пароль? Для смены пароля обратитесь к администратору.</div>}
      </div>
    </div>
  );
}