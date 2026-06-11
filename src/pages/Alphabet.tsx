import { Link } from 'react-router-dom';

const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

export default function Alphabet() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: 'var(--text-color)', marginBottom: '24px', textAlign: 'center' }}>Выберите букву</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
          gap: '8px',
        }}
      >
        {russianAlphabet.map(letter => (
          <Link
            key={letter}
            to={`/browse/${letter.toLowerCase()}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 0',
              backgroundColor: '#373e4a',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              color: '#ffffff',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4dafff';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#373e4a';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            {letter}
          </Link>
        ))}
      </div>
    </div>
  );
}