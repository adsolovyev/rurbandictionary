import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getWordsByLetter } from '../services/api';

export default function AlphabetBrowse() {
  const { character } = useParams<{ character: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!character) return;
    let ignore = false;
    const load = async () => {
      if (!ignore && isMounted.current) setLoading(true);
      try {
        const data = await getWordsByLetter(character, currentPage, 20);
        if (ignore || !isMounted.current) return;
        setWords(data.words);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore && isMounted.current) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [character, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: String(page) });
  };

  if (loading) return <div style={{ color: '#fff' }}>Загрузка...</div>;

  return (
    <div>
      <h2 style={{ color: '#fff' }}>Слова на букву {character?.toUpperCase()}</h2>
      {words.length === 0 ? (
        <p style={{ color: '#fff' }}>Нет слов на эту букву.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {words.map(word => (
              <Link key={word} to={`/search?word=${encodeURIComponent(word)}`} style={{ color: '#4dafff' }}>
                {word}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} style={pageButtonStyle}>
              ← Назад
            </button>
            <span style={{ color: '#fff' }}>Страница {currentPage} из {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} style={pageButtonStyle}>
              Вперёд →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const pageButtonStyle = {
  padding: '4px 12px',
  background: '#2a2f3a',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#fff',
} as const;