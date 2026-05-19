import { Link } from 'react-router-dom';

const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

export default function Alphabet() {
  return (
    <div>
      <h2>Выберите букву</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {russianAlphabet.map(letter => (
          <Link key={letter} to={`/browse/${letter.toLowerCase()}`} style={{ fontSize: '1.5rem' }}>
            {letter}
          </Link>
        ))}
      </div>
    </div>
  );
}