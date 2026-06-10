import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { getDefinitionsByAuthor } from '../services/api';
import type { Definition } from '../services/api';

export default function UserDefinitions() {
  const { login } = useParams<{ login: string }>();
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [page, setPage] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!login) return;
    let ignore = false;
    const load = async () => {
      setLoadingInitial(true);
      try {
        const data = await getDefinitionsByAuthor(login, 1, 20);
        if (ignore || !isMounted.current) return;
        setDefinitions(data);
        setVisibleCount(Math.min(10, data.length));
        setPage(2);
        setHasMore(data.length === 20);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore && isMounted.current) setLoadingInitial(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [login]);

  const loadMore = async () => {
    if (loadingMore) return;
    if (visibleCount < definitions.length) {
      setVisibleCount(prev => Math.min(prev + 10, definitions.length));
      return;
    }
    if (!hasMore) return;
    setLoadingMore(true);
    try {
      const data = await getDefinitionsByAuthor(login!, page, 20);
      if (isMounted.current) {
        setDefinitions(prev => [...prev, ...data]);
        setVisibleCount(prev => prev + 10);
        setPage(prev => prev + 1);
        setHasMore(data.length === 20);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setLoadingMore(false);
    }
  };

  if (loadingInitial) return <div style={{ color: 'var(--text-color)' }}>Загрузка...</div>;
  if (!definitions.length && !loadingInitial)
    return <div style={{ color: 'var(--text-color)' }}>Пользователь {login} ещё не добавил определений</div>;

  const displayedDefs = definitions.slice(0, visibleCount);
  const showLoadMore = hasMore || visibleCount < definitions.length;

  return (
    <div>
      <h2 style={{ color: 'var(--text-color)', marginBottom: '24px' }}>
        Определения пользователя {login}
      </h2>
      {displayedDefs.map(def => <Card key={def.id} {...def} />)}
      {showLoadMore ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem',
              color: '#4dafff',
              padding: '8px 20px',
              borderRadius: '40px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              const icon = e.currentTarget.querySelector('.more-icon') as HTMLElement;
              if (icon) icon.style.transform = 'rotate(360deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4dafff';
              const icon = e.currentTarget.querySelector('.more-icon') as HTMLElement;
              if (icon) icon.style.transform = 'rotate(0deg)';
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="more-icon"
              style={{ transition: 'transform 0.3s ease' }}
            >
              <path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" />
            </svg>
            <span>{loadingMore ? 'Загрузка...' : 'Показать ещё'}</span>
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '32px 0', color: 'var(--blockquote-color)' }}>
          <p>Больше пользователю {login} нечего добавить.</p>
        </div>
      )}
    </div>
  );
}