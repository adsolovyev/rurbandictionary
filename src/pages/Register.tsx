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
            <div style={{ fontSize: '0.75rem', color: 'var(--blockquote-color)', marginTop: '4px' }}>
              Будет видно другим пользователям.
            </div>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Почта</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--blockquote-color)', marginTop: '4px' }}>
              Нужна для восстановления учётной записи. Никаких рассылок!
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: 'var(--vote-bg)', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', fontSize: '1rem' }} />
          </div>

          {error && <div style={{ color: '#f44336', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'var(--link-color)', color: '#fff', border: 'none', borderRadius: '40px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--link-color)')}>Зарегистрироваться</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-color)' }}>Уже есть учётная запись? <a href="/login" style={{ color: 'var(--link-color)' }}>Войти</a></p>
      </div>
    </div>
  );
}