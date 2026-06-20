import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPendingDefinitions, approveDefinition, rejectDefinition, getDefinitionsByExactWord } from '../services/api';
import type { Definition } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import CardSimple from '../components/CardSimple';

export default function AdminPending() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Record<number, string>>({});
  const [similarDefs, setSimilarDefs] = useState<Record<number, Definition[]>>({});
  const [loadingSimilar, setLoadingSimilar] = useState<Record<number, boolean>>({});
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDef = definitions[currentIndex];

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPendingDefinitions();
        if (mounted) {
          setDefinitions(data);
          const params = new URLSearchParams(location.search);
          const idParam = params.get('id');
          if (idParam) {
            const idx = data.findIndex(d => d.id === parseInt(idParam, 10));
            if (idx !== -1) setCurrentIndex(idx);
          } else {
            const idxParam = params.get('index');
            if (idxParam) setCurrentIndex(parseInt(idxParam, 10) || 0);
          }
        }
      } catch (err) {
        void err;
        if (mounted) setMessage({ text: 'Ошибка загрузки определений', type: 'error' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user, navigate, location.search]);

  useEffect(() => {
    if (definitions.length === 0) return;
    const params = new URLSearchParams(location.search);
    params.set('index', String(currentIndex));
    navigate({ search: params.toString() }, { replace: true });
  }, [currentIndex, definitions.length, navigate, location.search]);

  const handleApprove = async (id: number) => {
    try {
      await approveDefinition(id);
      const newList = definitions.filter(def => def.id !== id);
      setDefinitions(newList);
      if (newList.length === 0) setCurrentIndex(0);
      else if (currentIndex >= newList.length) setCurrentIndex(newList.length - 1);
      setMessage({ text: `Определение #${id} одобрено`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: `Ошибка одобрения #${id}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReject = async (id: number) => {
    const reason = rejectionReasons[id];
    if (!reason || reason.trim() === '') {
      setMessage({ text: `Укажите причину отклонения для определения #${id}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    try {
      await rejectDefinition(id, reason);
      const newList = definitions.filter(def => def.id !== id);
      setDefinitions(newList);
      if (newList.length === 0) setCurrentIndex(0);
      else if (currentIndex >= newList.length) setCurrentIndex(newList.length - 1);
      setMessage({ text: `Определение #${id} отклонено`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: `Ошибка отклонения #${id}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReasonChange = (id: number, value: string) => {
    setRejectionReasons(prev => ({ ...prev, [id]: value }));
  };

  const handleShowSimilar = async (def: Definition) => {
    if (similarDefs[def.id]) return;
    setLoadingSimilar(prev => ({ ...prev, [def.id]: true }));
    try {
      const data = await getDefinitionsByExactWord(def.word);
      setSimilarDefs(prev => ({ ...prev, [def.id]: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSimilar(prev => ({ ...prev, [def.id]: false }));
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const goNext = () => {
    if (currentIndex < definitions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div className="loader" />
    </div>
  );
  if (!currentDef && definitions.length === 0) {
    return <div style={{ color: 'var(--text-color)', padding: '20px' }}>Нет определений на модерации.</div>;
  }
  if (!currentDef) return null;

  const total = definitions.length;
  const currentNumber = currentIndex + 1;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--text-color)' }}>Модерация определений</h1>
        <div>
          <button onClick={goPrev} disabled={currentIndex === 0} style={{ marginRight: '8px', ...buttonStyle }}>←</button>
          <span style={{ color: 'var(--text-color)' }}>{currentNumber} / {total}</span>
          <button onClick={goNext} disabled={currentIndex === total - 1} style={{ marginLeft: '8px', ...buttonStyle }}>→</button>
        </div>
      </div>
      {message && <div style={messageStyle(message.type)}>{message.text}</div>}

      <CardSimple
        definition={currentDef}
        showDateAndAuthor={true}
        showVotes={false}
        actions={
          <>
            <button onClick={() => handleApprove(currentDef.id)} style={approveButtonStyle}>Одобрить</button>
            <button onClick={() => handleReject(currentDef.id)} style={rejectButtonStyle}>Отклонить</button>
            <button onClick={() => alert('Функция связи с пользователем в разработке')} style={contactButtonStyle}>
              Связаться с автором (WIP)
            </button>
          </>
        }
      />
      
      <div style={{ marginTop: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Причина отклонения (обязательно, до 500 символов)"
          maxLength={500}
          value={rejectionReasons[currentDef.id] || ''}
          onChange={(e) => handleReasonChange(currentDef.id, e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginTop: '12px' }}>
        <button onClick={() => handleShowSimilar(currentDef)} style={linkButtonStyle}>
          {loadingSimilar[currentDef.id] ? 'Загрузка...' : 'Показать другие определения этого слова'}
        </button>
        {similarDefs[currentDef.id] && similarDefs[currentDef.id].length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-color)' }}>Другие определения слова «{currentDef.word}»:</h4>
            {similarDefs[currentDef.id].map(sim => (
              <CardSimple
                key={sim.id}
                definition={sim}
                showDateAndAuthor={true}
                showVotes={true}
              />
            ))}
          </div>
        )}
        {similarDefs[currentDef.id] && similarDefs[currentDef.id].length === 0 && (
          <div style={{ marginTop: '12px', color: 'var(--blockquote-color)' }}>Нет других определений.</div>
        )}
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

const approveButtonStyle = {
  background: '#4caf50',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
} as const;

const rejectButtonStyle = {
  background: '#f44336',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
} as const;

const contactButtonStyle = {
  background: '#ff9800',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
} as const;

const linkButtonStyle = {
  background: 'var(--link-color)',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
} as const;

const inputStyle = {
  width: '100%',
  padding: '8px',
  backgroundColor: 'var(--vote-bg)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-color)',
  borderRadius: '4px',
} as const;

const messageStyle = (type: string) => ({
  padding: '10px',
  marginBottom: '20px',
  background: type === 'success' ? '#4caf50' : '#f44336',
  color: '#fff',
  borderRadius: '5px',
} as const);