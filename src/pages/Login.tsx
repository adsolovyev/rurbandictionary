import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0); // счётчик неудачных попыток
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
      // успешный вход – сбрасываем счётчик
      setAttempts(0);
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      // неудачная попытка – увеличиваем счётчик
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
        <button type="submit" style={{ padding: '8px 16px' }}>Войти</button>
      </form>
      <p>
        Нет учетной записи? <a href="/register">Зарегистрироваться</a>
      </p>
      {/* Показываем подсказку о сбросе пароля только после 2+ неудачных попыток */}
      {attempts >= 2 && (
        <div style={{ marginTop: '16px', color: '#ffaa00', fontSize: '0.9rem' }}>
          Забыли пароль? Для смены пароля обратитесь к администратору. 
          Потребуется дополнительная информация об учетной записи.
        </div>
      )}
    </div>
  );
}