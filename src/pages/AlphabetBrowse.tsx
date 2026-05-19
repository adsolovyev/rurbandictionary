import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWordsByLetter } from '../services/api';

export default function AlphabetBrowse() {
  const { character } = useParams<{ character: string }>();
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetch() {
      if (!character) {
        if (!ignore) setLoading(false);
        return;
      }
      const data = await getWordsByLetter(character);
      if (!ignore) {
        setWords(data);
        setLoading(false);
      }
    }
    fetch();
    return () => { ignore = true; };
  }, [character]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Слова на букву {character?.toUpperCase()}</h2>
      {words.length === 0 ? (
        <p>Нет слов на эту букву.</p>
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