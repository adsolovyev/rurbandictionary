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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} title="Russian Urban Dictionary Educational">
            <svg
              viewBox="0 0 240 129"
              preserveAspectRatio="xMidYMid meet"
              style={{ height: '40px', width: 'auto' }}
              aria-label="Логотип Russian Urban Dictionary"
            >
              <title>Russian Urban Dictionary Educational</title>
              <g
                transform="matrix(5.9101661242220676,0,0,5.9101661242220676,15.744689380576064,-10.614662327109873)"
                fill="#ffffff"
              >
                <path d="M2.74 7.7 l0.06 1.58 l0 2.06 l0.72 0 l0.7 -0.06 l0.46 -0.44 l0 -0.2 l0.08 -1.36 l-0.16 -1.22 l0 -0.04 l-0.22 -0.8 l-0.54 -0.24 l-1.04 0 z M2.62 5.24 l2.62 0.04 l1.24 0.14 l1.02 0.58 l0.8 1.32 l-0.26 3.86 l-0.32 0.6 l-1.18 0.38 l1.34 1 l0.36 0.98 l0 1.6 l-0.18 4.24 l-0.52 0.12 l-2.06 -0.1 l-0.1 -3.9 l-0.14 -2.06 l-0.48 -0.52 l-0.92 -0.3 l0 1.48 l0 3.72 l0.06 1.56 l-1.94 -0.02 l-0.92 0.06 l-0.32 -0.06 l0 -2.88 l0 -2.1 l0.12 -2.72 l-0.08 -4.68 l-0.04 -2.32 z M9.52 17.44 l0.1 -11.92 l0.78 -0.34 l2.4 0.14 l0.54 0.2 l-0.2 4.7 l-0.24 7.34 l0.8 1.08 l1.52 -0.32 l-0.12 -8.5 l0.12 -4.62 l1.9 0 l0.06 12.98 l-0.54 1.32 l-2.5 0.72 l-3.6 -0.5 z M22.56 8.22 l-2.1 -0.22 l-0.22 9.2 l1.92 0.04 l0.28 -0.3 l0.48 -4.78 l0 -2.3 z M18.82 5.36 l0.62 0 l1.6 -0.04 c0.88 -0.02 1.72 -0.04 2.1 0.02 l1.18 0.34 c0.24 0.08 0.48 0.18 0.72 0.28 l1.1 1.76 c0.08 1.26 0.14 2.44 0.16 3.56 c0 1.92 0 4.02 -0.16 4.9 c-0.1 0.62 -0.24 1.14 -0.26 1.52 c-0.06 0.22 -0.08 0.44 -0.08 0.62 l-1.06 1.58 l-2.4 0.14 l-3.62 0 z M27.54 19.92 l-0.04 -6.94 l0.08 -0.74 l-0.04 -0.74 l0.1 -4.42 l0.18 -1.72 l6.5 0.12 l0.1 3.9 l-4.26 0 l-0.08 2.5 l3.26 -0.06 l0 0.22 l0.1 1.7 l-3.04 0.06 l0.1 2.96 l4.06 0.2 l0 3.08 z" />
              </g>
            </svg>
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