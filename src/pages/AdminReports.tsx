import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getAllActiveReports, resolveReport, blockDefinition, banUser } from '../services/api';
import type { ReportDetails } from '../services/api';
import CardSimple from '../components/CardSimple';

export default function AdminReports() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<ReportDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [adminComment, setAdminComment] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentReport = reports[currentIndex];

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    let mounted = true;
    const load = async () => {
      try {
        const data = await getAllActiveReports();
        if (mounted) {
          setReports(data);
          const params = new URLSearchParams(location.search);
          const idParam = params.get('id');
          if (idParam) {
            const idx = data.findIndex(r => r.id === parseInt(idParam, 10));
            if (idx !== -1) setCurrentIndex(idx);
          } else {
            const idxParam = params.get('index');
            if (idxParam) setCurrentIndex(parseInt(idxParam, 10) || 0);
          }
        }
      } catch (err) {
        void err;
        if (mounted) setMessage({ text: 'Ошибка загрузки жалоб', type: 'error' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user, navigate, location.search]);

  useEffect(() => {
    if (reports.length === 0) return;
    const params = new URLSearchParams(location.search);
    params.set('index', String(currentIndex));
    navigate({ search: params.toString() }, { replace: true });
  }, [currentIndex, reports.length, navigate, location.search]);

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const goNext = () => {
    if (currentIndex < reports.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const removeCurrentAndMove = () => {
    const newReports = reports.filter((_, idx) => idx !== currentIndex);
    setReports(newReports);
    if (newReports.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= newReports.length) {
      setCurrentIndex(newReports.length - 1);
    }
  };

  const handleResolve = async () => {
    if (!currentReport) return;
    try {
      await resolveReport(currentReport.id, adminComment);
      setMessage({ text: `Жалоба #${currentReport.id} закрыта`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      removeCurrentAndMove();
    } catch (err) {
      void err;
      setMessage({ text: `Ошибка закрытия жалобы #${currentReport.id}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBlockWord = async () => {
    if (!currentReport) return;
    try {
      await blockDefinition(currentReport.definition_id);
      setMessage({ text: `Определение "${currentReport.word}" заблокировано`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      removeCurrentAndMove();
    } catch (err) {
      void err;
      setMessage({ text: `Ошибка блокировки определения`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBanUser = async () => {
    if (!currentReport) return;
    try {
      await banUser(currentReport.author_id);
      setMessage({ text: `Пользователь ${currentReport.author_login} заблокирован`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      removeCurrentAndMove();
    } catch (err) {
      void err;
      setMessage({ text: `Ошибка блокировки пользователя`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const contactUserWIP = () => alert('Функция связи с пользователем в разработке');
  const contactAuthorWIP = () => alert('Функция связи с автором в разработке');

  if (loading) return <div style={{ color: '#fff' }}>Загрузка...</div>;
  if (!currentReport && reports.length === 0) {
    return <div style={{ color: '#fff', padding: '20px' }}>Нет неразрешённых жалоб.</div>;
  }
  if (!currentReport) return null;

  const total = reports.length;
  const currentNumber = currentIndex + 1;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#fff' }}>Модерация жалоб</h1>
        <div>
          <button onClick={goPrev} disabled={currentIndex === 0} style={{ marginRight: '8px', ...buttonStyle }}>←</button>
          <span style={{ color: '#fff' }}>{currentNumber} / {total}</span>
          <button onClick={goNext} disabled={currentIndex === total - 1} style={{ marginLeft: '8px', ...buttonStyle }}>→</button>
        </div>
      </div>

      {message && <div style={messageStyle(message.type)}>{message.text}</div>}

      <CardSimple
        definition={{
          id: currentReport.definition_id,
          word: currentReport.word,
          definition: currentReport.definition,
          example: currentReport.example,
          author: currentReport.author_login,
          created_at: currentReport.def_created_at,
          upvotes: currentReport.upvotes,
          downvotes: currentReport.downvotes,
        }}
        showDateAndAuthor={true}
        showVotes={true}
      />

      <div style={{ marginTop: '16px', padding: '12px', background: '#2a2f3a', borderRadius: '8px' }}>
        <h3>Информация о жалобе</h3>
        <p><strong>Причина:</strong> {currentReport.reason}</p>
        {currentReport.comment && <p><strong>Комментарий репортёра:</strong> {currentReport.comment}</p>}
        <p><strong>Дата жалобы:</strong> {new Date(currentReport.created_at).toLocaleString()}</p>
        <hr style={{ borderColor: '#444', margin: '12px 0' }} />
        <p><strong>Автор определения:</strong> {currentReport.author_login} (ID: {currentReport.author_id})</p>
        <p><strong>Статус автора:</strong> {currentReport.is_banned ? 'Забанен' : 'Активен'}</p>
        <p><strong>Активных определений автора:</strong> {currentReport.author_definitions_count}</p>
        <p><strong>Активных жалоб на автора:</strong> {currentReport.author_reports_count}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <textarea
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#1e242c',
            border: '1px solid #2a2f3a',
            color: '#fff',
            borderRadius: '4px',
          }}
          placeholder="Причина закрытия (необязательно)"
        />
      </div>

      <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={handleResolve} style={{ ...actionButtonStyle, background: '#4caf50' }}>Отклонить жалобу (закрыть)</button>
        <button onClick={contactUserWIP} style={{ ...actionButtonStyle, background: '#ff9800' }}>Связаться с пользователем (WIP)</button>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={handleBlockWord} style={{ ...actionButtonStyle, background: '#f44336' }}>Заблокировать определение</button>
        <button onClick={handleBanUser} style={{ ...actionButtonStyle, background: '#800000' }}>Заблокировать автора</button>
        <button onClick={contactAuthorWIP} style={{ ...actionButtonStyle, background: '#ff9800' }}>Связаться с автором (WIP)</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: '#2a2f3a',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
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