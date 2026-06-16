import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { addDefinition } from '../services/api';

export default function AddDefinition() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/add');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/add');
      return;
    }
    if (!word.trim() || !definition.trim()) {
      setError('Слово и определение обязательны');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addDefinition({
        word: word.trim(),
        definition: definition.trim(),
        example: example.trim(),
      });
      navigate('/');
    } catch (err) {
      setError('Ошибка при добавлении. Попробуйте позже.');
      void err;
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const closeButtonColor = theme === 'light' ? '#6B7280' : 'var(--text-color)';

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border-color)',
        }}
      >
        <h1 style={{ color: 'var(--text-color)', marginBottom: '16px', textAlign: 'center', fontSize: '1.8rem' }}>
          Новое слово
        </h1>
        <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '24px' }}>
          Добавьте слово, которое вы используете в речи. Опишите его так, чтобы было понятно всем.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Слово"
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
            <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '8px' }}>
              Не указывайте личную информацию.
            </p>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={5}
              placeholder="Напишите здесь ваше определение"
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
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              rows={2}
              placeholder="Напишите пример использования этого слова"
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
              {loading ? 'Отправка...' : 'Добавить'}
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
    </div>
  );
}