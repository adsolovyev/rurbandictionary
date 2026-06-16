import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { API_BASE } from '../services/api';

interface ResetRequest {
  id: number;
  user_id: string;
  user_mail: string;
  new_password_hash: string;
  notes: string;
  status: string;
  created_at: string;
  loginExists: boolean;
  emailExists: boolean;
  userMatch: boolean;
  matchedUserId: number | null;
}

export default function AdminResetRequests() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentRequest = requests[currentIndex];

  // Загрузка данных
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/reset-requests`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (mounted) {
          setRequests(data);
          // Установим индекс из URL после загрузки
          const params = new URLSearchParams(location.search);
          const idx = parseInt(params.get('index') || '0', 10);
          if (!isNaN(idx) && idx >= 0 && idx < data.length) {
            setCurrentIndex(idx);
          } else {
            setCurrentIndex(0);
          }
        }
      } catch (err) {
        if (mounted) setMessage({ text: 'Ошибка загрузки заявок', type: 'error' });
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user, navigate, location.search]);

  // Обновляем URL при смене индекса вручную (без useEffect)
  const updateIndex = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= requests.length) return;
    setCurrentIndex(newIndex);
    const params = new URLSearchParams(location.search);
    params.set('index', String(newIndex));
    navigate({ search: params.toString() }, { replace: true });
  };

  const goPrev = () => {
    if (currentIndex > 0) updateIndex(currentIndex - 1);
  };
  const goNext = () => {
    if (currentIndex < requests.length - 1) updateIndex(currentIndex + 1);
  };

  const removeCurrentAndMove = () => {
    const newRequests = requests.filter((_, idx) => idx !== currentIndex);
    setRequests(newRequests);
    if (newRequests.length === 0) {
      setCurrentIndex(0);
      // очистим параметр index в URL
      const params = new URLSearchParams(location.search);
      params.delete('index');
      navigate({ search: params.toString() }, { replace: true });
    } else {
      const newIndex = currentIndex >= newRequests.length ? newRequests.length - 1 : currentIndex;
      updateIndex(newIndex);
    }
  };

  const handleApply = async () => {
    if (!currentRequest) return;
    try {
      const res = await fetch(`${API_BASE}/admin/reset-requests/${currentRequest.id}/apply`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Apply failed');
      setMessage({ text: `Пароль применён для заявки #${currentRequest.id}`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      removeCurrentAndMove();
    } catch (err) {
      setMessage({ text: 'Ошибка применения пароля', type: 'error' });
      console.error(err);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReject = async () => {
    if (!currentRequest) return;
    try {
      const res = await fetch(`${API_BASE}/admin/reset-requests/${currentRequest.id}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Reject failed');
      setMessage({ text: `Заявка #${currentRequest.id} отклонена`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      removeCurrentAndMove();
    } catch (err) {
      setMessage({ text: 'Ошибка отклонения заявки', type: 'error' });
      console.error(err);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-color)' }}>Загрузка...</div>;
  if (!currentRequest && requests.length === 0) {
    return <div style={{ color: 'var(--text-color)', padding: '20px' }}>Нет активных заявок на смену пароля.</div>;
  }
  if (!currentRequest) return null;

  const total = requests.length;
  const currentNumber = currentIndex + 1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--text-color)' }}>Заявки на смену пароля</h1>
        <div>
          <button onClick={goPrev} disabled={currentIndex === 0} style={{ marginRight: '8px', ...buttonStyle }}>←</button>
          <span style={{ color: 'var(--text-color)' }}>{currentNumber} / {total}</span>
          <button onClick={goNext} disabled={currentIndex === total - 1} style={{ marginLeft: '8px', ...buttonStyle }}>→</button>
        </div>
      </div>

      {message && <div style={messageStyle(message.type)}>{message.text}</div>}

      <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '20px', border: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: 'var(--text-color)' }}>Заявка #{currentRequest.id}</strong>
          <span style={{ color: 'var(--blockquote-color)', marginLeft: '12px' }}>от {new Date(currentRequest.created_at).toLocaleString()}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-color)' }}><strong>Имя пользователя:</strong> {currentRequest.user_id}</span>
            <span style={{ color: currentRequest.loginExists ? 'green' : 'red', fontSize: '1.2rem' }}>
              {currentRequest.loginExists ? '✓' : '✗'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-color)' }}><strong>Почта:</strong> {currentRequest.user_mail}</span>
            <span style={{ color: currentRequest.emailExists ? 'green' : 'red', fontSize: '1.2rem' }}>
              {currentRequest.emailExists ? '✓' : '✗'}
            </span>
          </div>
          <div style={{ marginTop: '8px', color: 'var(--text-color)' }}>
            <strong>Статус проверки:</strong>{' '}
            {currentRequest.userMatch ? (
              <span style={{ color: 'green' }}>Имя пользователя и почта есть в базе и совпадают</span>
            ) : (
              <span style={{ color: 'red' }}>Имя пользователя и почта не совпали</span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong style={{ color: 'var(--text-color)' }}>Дополнительная информация:</strong>
          <p style={{ color: 'var(--text-color)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
            {currentRequest.notes || '(не указана)'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleApply} style={{ ...actionButtonStyle, background: '#4caf50' }}>
            Применить новый пароль
          </button>
          <button onClick={handleReject} style={{ ...actionButtonStyle, background: '#f44336' }}>
            Отклонить
          </button>
          <button onClick={() => navigate('/admin')} style={{ ...actionButtonStyle, background: '#6c757d' }}>
            Вернуться в дашборд
          </button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: 'var(--vote-bg)',
  border: '1px solid var(--border-color)',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: 'var(--text-color)',
} as const;

const actionButtonStyle = {
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
  fontWeight: 'bold',
} as const;

const messageStyle = (type: string) => ({
  padding: '10px',
  marginBottom: '20px',
  background: type === 'success' ? '#4caf50' : '#f44336',
  color: '#fff',
  borderRadius: '5px',
} as const);