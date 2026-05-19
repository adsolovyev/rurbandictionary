import { Link } from 'react-router-dom';

interface FullMenuProps {
  onClose: () => void;
}

const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
const allSymbols = [...russianAlphabet, '#'];

export default function FullMenu({ onClose }: FullMenuProps) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div style={{ borderTop: '1px solid #2a2f3a', borderBottom: '1px solid #2a2f3a', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#212936' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Левая колонка – кнопки */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <Link to="/" onClick={handleLinkClick} style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: '#ffffff' }}>
            Главная
          </Link>
          <Link to="/add" onClick={handleLinkClick} style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: '#ffffff' }}>
            Добавить
          </Link>
        </div>

        {/* Правая колонка – сетка букв */}
        <div style={{ flex: '2', minWidth: '200px', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#ffffff' }}>Алфавитный указатель</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 0,
              backgroundColor: '#2a2f3a',
              border: '1px solid #2a2f3a',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {allSymbols.map((symbol) => {
              const isHash = symbol === '#';
              const link = isHash ? '/browse/non-cyrillic' : `/browse/${symbol.toLowerCase()}`;
              return (
                <Link
                  key={symbol}
                  to={link}
                  onClick={handleLinkClick}
                  style={{
                    textAlign: 'center',
                    padding: '8px 0',
                    backgroundColor: '#1e242c',
                    border: '1px solid #2a2f3a',
                    textDecoration: 'none',
                    color: '#ffffff',
                    gridColumn: isHash ? 'span 2' : 'auto',
                  }}
                >
                  {symbol}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}