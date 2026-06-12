import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';

interface FullMenuProps {
  onClose: () => void;
}

const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
const allSymbols = [...russianAlphabet, '#'];

export default function FullMenu({ onClose }: FullMenuProps) {
  const { user, logout } = useAuthStore();
  const handleLinkClick = () => onClose();
const handleLogout = async () => {
  await logout();
  onClose();
  window.location.reload();
};
  const { dyslexicFont, toggleDyslexicFont } = useSettingsStore();

  return (
    <div style={{ borderTop: '1px solid #2a2f3a', borderBottom: '1px solid #2a2f3a', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#212936' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <Link to="/" onClick={handleLinkClick} style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: '#ffffff' }}>
            Главная
          </Link>
          <Link to="/add" onClick={handleLinkClick} style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: '#ffffff' }}>
            Добавить определение
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" onClick={handleLinkClick} style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: '#ffaa00' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M243.32,116.69l-16-16a16,16,0,0,0-20.84-1.53L156.84,49.52a16,16,0,0,0-1.52-20.84l-16-16a16,16,0,0,0-22.63,0l-64,64a16,16,0,0,0,0,22.63l16,16a16,16,0,0,0,20.83,1.52L96.69,124,31.31,189.38A25,25,0,0,0,66.63,224.7L132,159.32l7.17,7.16a16,16,0,0,0,1.52,20.84l16,16a16,16,0,0,0,22.63,0l64-64A16,16,0,0,0,243.32,116.69ZM80,104,64,88l64-64,16,16ZM55.32,213.38a9,9,0,0,1-12.69,0,9,9,0,0,1,0-12.68L108,135.32,120.69,148ZM101,105.66,145.66,61,195,110.34,150.35,155ZM168,192l-16-16,4-4h0l56-56h0l4-4,16,16Z" />
              </svg>
              Админка
            </Link>
          )}
          <Link to="/help" onClick={handleLinkClick} style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', textDecoration: 'none', color: '#ffffff' }}>
            Помощь
          </Link>
          <hr style={{ margin: '12px 0', borderColor: '#ffffff1a' }} />
          <button
            onClick={toggleDyslexicFont}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', padding: 0, marginBottom: '1rem', display: 'block' }}
          >
            {dyslexicFont ? 'Сменить шрифт на Roboto' : 'Сменить шрифт на OpenDyslexic'}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', padding: 0, marginBottom: '1rem', display: 'block' }}
            >
              Выйти
            </button>
          )}
        </div>
        <div style={{ flex: '2', minWidth: '200px', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#ffffff' }}>Алфавитный указатель</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 0,
              backgroundColor: '#2a2f3a',
              border: '1px solid #2a2f3a',
              borderRadius: '16px',
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
                  className="alphabet-button"
                  style={{
                    textAlign: 'center',
                    padding: '8px 0',
                    backgroundColor: '#373e4a',
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