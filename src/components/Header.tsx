import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import FullMenu from './FullMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header style={{ borderBottom: '1px solid #2a2f3a', backgroundColor: '#212936' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#ffffff' }}>
            Russian Urban Dictionary
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <SearchBar />
            <button
              onClick={toggleMenu}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#ffffff', lineHeight: 1 }}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && <FullMenu onClose={closeMenu} />}
    </>
  );
};

export default Header;