import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { getDefinitionsByAuthor } from '../services/api';
import type { Definition } from '../services/api';

export default function UserDefinitions() {
  const { login } = useParams<{ login: string }>();
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const isFirstRun = useRef(true);

  const loadMore = useCallback(async (reset: boolean = false) => {
    if (!login) return;
    setLoading(true);
    if (reset) setInitialLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const data = await getDefinitionsByAuthor(login, currentPage, 10);
      if (reset) {
        setDefinitions(data);
        setPage(2);
        setInitialLoading(false);
      } else {
        setDefinitions(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
      setHasMore(data.length === 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [login, page]);

  useEffect(() => {
    if (!login) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      loadMore(true);
    }
  }, [login, loadMore]);

  if (initialLoading) return <div>Загрузка...</div>;
  if (!definitions.length && !loading) return <div>Пользователь {login} ещё не добавил определений</div>;

  return (
    <div>
      <h2>Определения пользователя {login}</h2>
      {definitions.map(def => <Card key={def.id} {...def} />)}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button onClick={() => loadMore()} disabled={loading}>
            {loading ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}
    </div>
  );
}