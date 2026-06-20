import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { getDefinitionsByWord } from '../services/api';
import type { Definition } from '../services/api';
import LoadMoreButton from '../components/LoadMoreButton';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const word = searchParams.get('word') || '';
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
    let ignore = false;
    if (!word) {
      if (isMounted.current) setLoadingInitial(false);
      return;
    }
    const load = async () => {
      if (isMounted.current) setLoadingInitial(true);
      try {
        const data = await getDefinitionsByWord(word, 1, 20);
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
  }, [word]);

  const loadMore = async () => {
    if (loadingMore) return;
    if (visibleCount < definitions.length) {
      setVisibleCount(prev => Math.min(prev + 10, definitions.length));
      return;
    }
    if (!hasMore) return;
    setLoadingMore(true);
    try {
      const data = await getDefinitionsByWord(word, page, 20);
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

  if (!word) return <div style={{ color: 'var(--text-color)' }}>Введите слово для поиска</div>;
  if (loadingInitial) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div className="loader" />
    </div>
  );
  if (definitions.length === 0)
    return <div style={{ color: 'var(--text-color)' }}>Определений для "{word}" еще нет, но вы можете это исправить.</div>;

  const displayedDefs = definitions.slice(0, visibleCount);
  const showLoadMore = hasMore || visibleCount < definitions.length;

  return (
    <div>
      <h2 style={{ color: 'var(--text-color)', marginBottom: '24px' }}>
        Определения для слова "{word}"
      </h2>
      {displayedDefs.map((def) => (
        <Card key={def.id} {...def} />
      ))}
{showLoadMore ? (
  <LoadMoreButton onClick={loadMore} loading={loadingMore} />
) : (
  <div style={{ textAlign: 'center', margin: '32px 0', color: 'var(--blockquote-color)' }}>
    <p>Это все определения по запросу "{word}".</p>
  </div>
)}
    </div>
  );
}