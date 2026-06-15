import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { reportDefinition, API_BASE } from '../services/api';
import CardSimple from '../components/CardSimple';
import type { Definition } from '../services/api';

export default function ReportForm() {
  const { definitionId } = useParams<{ definitionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/report/${definitionId}`));
      return;
    }
    if (!definitionId) return;
    fetch(`${API_BASE}/definitions/${definitionId}`, { credentials: 'include' })
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
    return <div style={{ color: 'var(--text-color)' }}>Ошибка загрузки определения: {fetchError}</div>;
  }

  if (!definition) {
    return <div style={{ color: 'var(--text-color)' }}>Загрузка определения...</div>;
  }

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
        <h2 style={{ color: 'var(--text-color)', textAlign: 'center', marginTop: '24px', marginBottom: '32px' }}>
          Пожаловаться на определение
        </h2>

        <CardSimple
          definition={definition}
          showDateAndAuthor={true}
          showVotes={true}
          style={{
            border: '2px solid #e0e0e0', 
            marginBottom: '24px',
          }}
        />

        <p style={{ color: 'var(--blockquote-color)', marginBottom: '24px', textAlign: 'center' }}>
          Пожалуйста, выберите причину жалобы. Мы рассмотрим её когда-нибудь.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '12px' }}>Причина жалобы *</label>
            {reasons.map(r => (
              <div key={r} style={{ marginBottom: '8px' }}>
                <label style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  {r}
                </label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: 'var(--text-color)', display: 'block', marginBottom: '8px' }}>Комментарий (необязательно)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--vote-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
              }}
              placeholder="Дополнительные детали..."
            />
          </div>

          {error && <div style={{ color: '#f44336', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

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
              {loading ? 'Отправка...' : 'Пожаловаться'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                padding: '8px 20px',
                borderRadius: '40px',
                cursor: 'pointer',
                color: 'var(--text-color)',
                fontSize: '1rem',
                transition: 'background-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#373e4a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-color)';
              }}
            >
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}