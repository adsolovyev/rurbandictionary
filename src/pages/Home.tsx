import { useEffect, useState, useRef } from 'react';
import Card from '../components/Card';
import { getLatestDefinitions } from '../services/api';
import type { Definition } from '../services/api';

export default function Home() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [page, setPage] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isMounted = useRef(true);

  const loadPage = async (pageNum: number): Promise<Definition[]> => {
    try {
      const data = await getLatestDefinitions(pageNum, 20);
      if (!isMounted.current) return [];
      if (data.length === 0) setHasMore(false);
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await loadPage(1);
      if (mounted) {
        setDefinitions(data);
        setVisibleCount(Math.min(10, data.length));
        setPage(2);
        setLoadingInitial(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    if (visibleCount < definitions.length) {
      setVisibleCount(prev => Math.min(prev + 10, definitions.length));
      return;
    }
    setLoadingMore(true);
    const newData = await loadPage(page);
    if (!isMounted.current) return;
    if (newData.length === 0) {
      setHasMore(false);
    } else {
      const existingIds = new Set(definitions.map(d => d.id));
      const uniqueNew = newData.filter(d => !existingIds.has(d.id));
      setDefinitions(prev => [...prev, ...uniqueNew]);
      setVisibleCount(prev => prev + 10);
      setPage(prev => prev + 1);
    }
    setLoadingMore(false);
  };

  if (loadingInitial) {
    return <div style={{ color: 'var(--text-color)' }}>Загрузка...</div>;
  }

  if (definitions.length === 0 && !loadingInitial) {
    return <div style={{ color: 'var(--text-color)' }}>Нет определений</div>;
  }

  const displayedDefs = definitions.slice(0, visibleCount);
  const showLoadMore = hasMore || visibleCount < definitions.length;

  return (
    <div>
      {displayedDefs.map(def => <Card key={def.id} {...def} />)}
      {showLoadMore ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            {loadingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px', color: 'var(--blockquote-color)' }}>
          <p>Ой, кажется, вы всё просмотрели!</p>
          <p>Вы можете добавить свои определения, воспользовавшись <strong>Меню</strong>.</p>
        </div>
      )}
    </div>
  );
}