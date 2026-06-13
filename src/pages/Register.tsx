import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const registerUser = useAuthStore(state => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(login, email, password);
      alert('Регистрация прошла успешно! Можете войти в систему.');
      navigate('/login');
    } catch {
      setError('Ошибка регистрации: попробуйте изменить почту или имя пользователя');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: '48px', marginTop: '48px' }}>Создание учётной записи</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Имя пользователя</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Почта</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          {error && <div style={{ color: '#f44336', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'var(--link-color)', color: '#fff', border: 'none', borderRadius: '40px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--link-color)')}>Зарегистрироваться</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-color)' }}>Уже есть учётная запись? <a href="/login" style={{ color: 'var(--link-color)' }}>Войти</a></p>
        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}><hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} /><span style={{ color: 'var(--blockquote-color)', fontSize: '0.85rem' }}>Другие способы регистрации</span><hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} /></div>
        <a href="/api/auth/google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px', width: '100%', background: '#fff', color: '#000', padding: '10px 16px', borderRadius: '40px', textDecoration: 'none', border: '1px solid #dadce0', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span>Зарегистрироваться через Gmail</span>
        </a>
      </div>
    </div>
  );
}