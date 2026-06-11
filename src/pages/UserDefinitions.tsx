import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { getDefinitionsByAuthor } from '../services/api';
import type { Definition } from '../services/api';
import LoadMoreButton from '../components/LoadMoreButton';

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
  <LoadMoreButton onClick={loadMore} loading={loadingMore} />
) : (
  <div style={{ textAlign: 'center', margin: '32px 0', color: 'var(--blockquote-color)' }}>
    <p>Это все, пользователю {login} больше нечего добавить.</p>
  </div>
)}
    </div>
  );
}