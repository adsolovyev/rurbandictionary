import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNonCyrillicWords } from '../services/api';

export default function NonCyrillicBrowse() {
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetch() {
      const data = await getNonCyrillicWords();
      if (!ignore) {
        setWords(data);
        setLoading(false);
      }
    }
    fetch();
    return () => { ignore = true; };
  }, []);

  if (loading) return <div style={{ color: 'var(--text-color)' }}>Загрузка...</div>;

  return (
    <div>
      <h2 style={{ color: 'var(--text-color)', marginBottom: '24px' }}>Слова, начинающиеся с символов (не кириллица)</h2>
      {words.length === 0 ? (
        <p style={{ color: 'var(--text-color)' }}>Нет таких слов.</p>
      ) : (
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
          {words.map(word => (
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
      )}
    </div>
  );
}