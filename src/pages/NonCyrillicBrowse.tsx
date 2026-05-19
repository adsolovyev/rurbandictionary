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

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Слова, начинающиеся с символов (не кириллица)</h2>
      {words.length === 0 ? (
        <p>Нет таких слов.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {words.map(word => (
            <Link key={word} to={`/search?word=${encodeURIComponent(word)}`}>
              {word}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}