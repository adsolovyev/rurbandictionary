import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getWordsByLetter } from '../services/api';

export default function AlphabetBrowse() {
  const { character } = useParams<{ character: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState('');
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
        setInputPage(String(currentPage));
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

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const page = parseInt(inputPage, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        goToPage(page);
      } else {
        setInputPage(String(currentPage));
      }
    }
  };

  if (loading) return <div style={{ color: 'var(--text-color)' }}>Загрузка...</div>;

  return (
    <div>
      <h2 style={{ color: 'var(--text-color)', marginBottom: '24px' }}>
        Слова на букву {character?.toUpperCase()}
      </h2>

      {words.length === 0 ? (
        <p style={{ color: 'var(--text-color)' }}>Нет слов на эту букву.</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
              backgroundColor: 'var(--alphabet-grid-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {words.map((word) => (
              <Link
                key={word}
                to={`/search?word=${encodeURIComponent(word)}`}
                style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  backgroundColor: 'var(--alphabet-tile-bg)',
                  border: '1px solid var(--border-color)',
                  textDecoration: 'none',
                  color: 'var(--text-color)',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--link-color)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--alphabet-tile-bg)';
                  e.currentTarget.style.color = 'var(--text-color)';
                }}
              >
                {word}
              </Link>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              flexWrap: 'wrap',
            }}
          >
            <button onClick={() => goToPage(1)} disabled={currentPage === 1} style={pageButtonStyle}>≪</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} style={pageButtonStyle}>←</button>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-color)' }}>Страница</span>
              <input
                type="text"
                inputMode="numeric"
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={handlePageInputSubmit}
                style={{
                  width: '60px',
                  padding: '4px',
                  textAlign: 'center',
                  background: 'var(--vote-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                }}
              />
              <span style={{ color: 'var(--text-color)' }}>из {totalPages}</span>
            </div>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} style={pageButtonStyle}>→</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} style={pageButtonStyle}>≫</button>
          </div>
        </>
      )}
    </div>
  );
}

const pageButtonStyle = {
  padding: '4px 12px',
  background: 'var(--vote-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  cursor: 'pointer',
  color: 'var(--text-color)',
} as const;