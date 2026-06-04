import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { addDefinition } from '../services/api';

export default function AddDefinition() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [tags, setTags] = useState('');
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
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      navigate('/');
    } catch (err) {
      setError('Ошибка при добавлении. Попробуйте позже.');
      void err;
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // редирект уже сработает, но пока ничего

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Добавить новое определение</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Слово *</label><br />
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Определение *</label><br />
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Пример использования</label><br />
          <textarea
            value={example}
            onChange={(e) => setExample(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Теги (через запятую)</label><br />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            placeholder="сленг, интернет, мем"
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Закрыть
          </button>
        </div>
      </form>
    </div>
  );
}