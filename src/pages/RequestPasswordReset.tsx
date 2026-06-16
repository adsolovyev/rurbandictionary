import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../stores/themeStore';

export default function RequestPasswordReset() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Простая валидация
    if (!login.trim() || !email.trim() || !password.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    if (login.length > 50) {
      setError('Имя пользователя не может быть длиннее 50 символов');
      return;
    }
    if (email.length > 100) {
      setError('Email не может быть длиннее 100 символов');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (notes.length > 500) {
      setError('Поле "последние взаимодействия" не может быть длиннее 500 символов');
      return;
    }

    setLoading(true);
    try {
      // TODO: заменить на реальный API вызов
      // await requestPasswordReset({ login, email, password, notes });
      console.log('Отправка запроса:', { login, email, password, notes });
      // Имитация успешного ответа
      setShowModal(true);
    } catch (err) {
      setError('Ошибка при отправке запроса. Попробуйте позже.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeButtonColor = theme === 'light' ? '#6B7280' : 'var(--text-color)';

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          position: 'relative',
        }}
      >
        <h1 style={{ color: 'var(--text-color)', marginBottom: '16px', textAlign: 'center', fontSize: '1.8rem' }}>
          Восстановление пароля
        </h1>
        <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '24px' }}>
          Нам нужно убедиться, что вы — это вы: укажите данные, которые помогут нам в этом убедиться!
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Имя пользователя"
              maxLength={50}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--vote-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-color)',
                fontSize: '1rem',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Почта"
              maxLength={100}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--vote-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-color)',
                fontSize: '1rem',
              }}
              required
            />
          </div>

          <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '8px' }}>
            Укажите новый пароль:
          </p>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ваш пароль никто не узнает"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--vote-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-color)',
                fontSize: '1rem',
              }}
              required
            />
          </div>

          <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '8px' }}>
            Укажите информацию о своих последних взаимодействиях: на какие определения вы ставили голоса или писали жалобы?
          </p>
          <div style={{ marginBottom: '24px' }}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ваши последние взаимодействия"
              maxLength={500}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--vote-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-color)',
                fontSize: '1rem',
                resize: 'vertical',
              }}
            />
          </div>

          {error && <div style={{ color: '#f44336', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#4dafff',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '40px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '1rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4dafff')}
            >
              {loading ? 'Отправка...' : 'Запросить смену пароля'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                color: closeButtonColor,
                transition: 'color 0.2s, background-color 0.2s',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#373e4a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = closeButtonColor;
              }}
              title="Закрыть"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: 'var(--text-color)', marginBottom: '16px' }}>✅ Запрос отправлен</h2>
            <p style={{ color: 'var(--text-color)', opacity: 0.9, marginBottom: '24px' }}>
              Вы успешно запросили смену пароля! Когда модератор удостоверится в корректности ваших данных, вы сможете войти в систему под новым паролем!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#4dafff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '40px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4dafff')}
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}
    </div>
  );
}