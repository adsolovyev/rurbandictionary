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
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      setAttempts(prev => prev + 1);
      setError('Поля заполнены неверно');
      void err;
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h2>Войдите в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Почта или имя пользователя</label><br />
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
        </div>
        <div>
          <label>Пароль</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '8px 16px',
            background: '#1e242c',
            color: '#fff',
            border: '1px solid #2a2f3a',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Войти
        </button>
      </form>
      <p style={{ marginTop: '16px' }}>
        Нет учетной записи? <a href="/register">Зарегистрироваться</a>
      </p>
      {attempts >= 2 && (
        <div style={{ marginTop: '16px', color: '#ffaa00', fontSize: '0.9rem' }}>
          Забыли пароль? Для смены пароля обратитесь к администратору. 
          Потребуется дополнительная информация об учетной записи.
        </div>
      )}

      {/* Разделитель с подписью */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #2a2f3a' }} />
        <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Другие способы входа</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #2a2f3a' }} />
      </div>

      <a
        href="/api/auth/google"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '20px',
          width: '100%',
          background: '#ffffff',
          color: '#000000',
          padding: '8px 16px',
          borderRadius: '4px',
          textDecoration: 'none',
          border: '1px solid #dadce0',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
        <span>Войти с учетной записью Gmail</span>
      </a>
    </div>
  );
}