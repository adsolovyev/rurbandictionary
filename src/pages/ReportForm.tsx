import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportDefinition } from '../services/api';

export default function ReportForm() {
  const { definitionId } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Спам или реклама',
    'Оскорбительное содержание',
    'Неверное определение',
    'Другое'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Пожаловаться на определение</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Пожалуйста, выберите причину жалобы. Мы рассмотрим её в течение 24 часов.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Причина жалобы *</label>
          {reasons.map(r => (
            <div key={r}>
              <label>
                <input
                  type="radio"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                />
                {' '}{r}
              </label>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Комментарий (необязательно)</label><br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Дополнительные детали..."
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Пожаловаться'}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Закрыть
          </button>
        </div>
      </form>
    </div>
  );
}