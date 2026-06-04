import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { reportDefinition } from '../services/api';

interface DefinitionPreview {
  id: number;
  word: string;
  definition: string;
  example: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
}

export default function ReportForm() {
  const { definitionId } = useParams<{ definitionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [definition, setDefinition] = useState<DefinitionPreview | null>(null);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/report/${definitionId}`));
      return;
    }
    if (!definitionId) return;
    fetch(`/api/definitions/${definitionId}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Definition not found');
        return res.json();
      })
      .then(data => setDefinition(data))
      .catch(err => setFetchError(err.message));
  }, [definitionId, user, navigate]);

  const reasons = [
    'Спам или реклама',
    'Оскорбительное содержание',
    'Неверное определение',
    'Другое',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reason) {
      setError('Выберите причину жалобы');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await reportDefinition(Number(definitionId), reason, comment);
      alert('Жалоба отправлена. Спасибо.');
      navigate('/');
    } catch {
      setError('Ошибка при отправке. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (fetchError) {
    return <div style={{ color: '#ffffff' }}>Ошибка загрузки определения: {fetchError}</div>;
  }

  if (!definition) {
    return <div style={{ color: '#ffffff' }}>Загрузка определения...</div>;
  }

  const formattedDate = definition.created_at
    ? new Date(definition.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff' }}>Пожаловаться на определение</h2>

      <div
        style={{
          border: '1px solid #2a2f3a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          background: '#212936',
          color: '#ffffff',
        }}
      >
        <h3 style={{ marginTop: 0 }}>{definition.word}</h3>
        <p>{definition.definition}</p>
        {definition.example && (
          <blockquote
            style={{
              borderLeft: '4px solid #4dafff',
              paddingLeft: '12px',
              margin: '12px 0',
              fontStyle: 'italic',
              color: '#cccccc',
            }}
          >
            {definition.example}
          </blockquote>
        )}
        <div style={{ fontSize: '0.85rem', color: '#a0a0a0', marginTop: '12px' }}>
          Добавлено {definition.author}, {formattedDate}
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#a0a0a0' }}>
          👍 {definition.upvotes} 👎 {definition.downvotes}
        </div>
      </div>

      <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
        Пожалуйста, выберите причину жалобы. Мы рассмотрим её в течение 24 часов.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#ffffff' }}>Причина жалобы *</label>
          {reasons.map(r => (
            <div key={r}>
              <label style={{ color: '#ffffff' }}>
                <input type="radio" value={r} checked={reason === r} onChange={(e) => setReason(e.target.value)} />
                {' '}{r}
              </label>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#ffffff' }}>Комментарий (необязательно)</label><br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1e242c',
              border: '1px solid #2a2f3a',
              color: '#ffffff',
              borderRadius: '4px',
            }}
            placeholder="Дополнительные детали..."
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#4dafff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            {loading ? 'Отправка...' : 'Пожаловаться'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#2a2f3a',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            Закрыть
          </button>
        </div>
      </form>
    </div>
  );
}