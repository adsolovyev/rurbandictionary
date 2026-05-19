import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { getDefinitionsByWord } from '../services/api';
import type { Definition } from '../services/api';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const word = searchParams.get('word') || '';
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetch() {
      if (!word) {
        if (!ignore) setLoading(false);
        return;
      }
      const data = await getDefinitionsByWord(word);
      if (!ignore) {
        setDefinitions(data);
        setLoading(false);
      }
    }
    fetch();
    return () => { ignore = true; };
  }, [word]);

  if (!word) return <div>Введите слово для поиска</div>;
  if (loading) return <div>Загрузка...</div>;
  if (definitions.length === 0) return <div>Определений для "{word}" не найдено.</div>;

  return (
    <div>
      <h2>Определения для слова "{word}"</h2>
      {definitions.map(def => (
        <Card key={def.id} {...def} />
      ))}
    </div>
  );
}