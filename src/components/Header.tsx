import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import FullMenu from './FullMenu';
import { useThemeStore } from '../stores/themeStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const lastScrollY = useRef(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Автоматическое закрытие меню при скролле вниз (оставим, но можно убрать если мешает)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && isMenuOpen) {
        closeMenu();
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  return (
    <>
      <header style={{ borderBottom: '1px solid #2a2f3a', backgroundColor: '#212936' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} title="Russian Urban Dictionary Educational">
            <svg viewBox="0 0 240 129" preserveAspectRatio="xMidYMid meet" style={{ height: '40px', width: 'auto', marginRight: '8px' }} aria-label="Логотип Russian Urban Dictionary">
              <title>Russian Urban Dictionary Educational</title>
              <g transform="matrix(5.9101661242220676,0,0,5.9101661242220676,15.744689380576064,-10.614662327109873)" fill="#ffffff">
                <path d="M2.74 7.7 l0.06 1.58 l0 2.06 l0.72 0 l0.7 -0.06 l0.46 -0.44 l0 -0.2 l0.08 -1.36 l-0.16 -1.22 l0 -0.04 l-0.22 -0.8 l-0.54 -0.24 l-1.04 0 z M2.62 5.24 l2.62 0.04 l1.24 0.14 l1.02 0.58 l0.8 1.32 l-0.26 3.86 l-0.32 0.6 l-1.18 0.38 l1.34 1 l0.36 0.98 l0 1.6 l-0.18 4.24 l-0.52 0.12 l-2.06 -0.1 l-0.1 -3.9 l-0.14 -2.06 l-0.48 -0.52 l-0.92 -0.3 l0 1.48 l0 3.72 l0.06 1.56 l-1.94 -0.02 l-0.92 0.06 l-0.32 -0.06 l0 -2.88 l0 -2.1 l0.12 -2.72 l-0.08 -4.68 l-0.04 -2.32 z M9.52 17.44 l0.1 -11.92 l0.78 -0.34 l2.4 0.14 l0.54 0.2 l-0.2 4.7 l-0.24 7.34 l0.8 1.08 l1.52 -0.32 l-0.12 -8.5 l0.12 -4.62 l1.9 0 l0.06 12.98 l-0.54 1.32 l-2.5 0.72 l-3.6 -0.5 z M22.56 8.22 l-2.1 -0.22 l-0.22 9.2 l1.92 0.04 l0.28 -0.3 l0.48 -4.78 l0 -2.3 z M18.82 5.36 l0.62 0 l1.6 -0.04 c0.88 -0.02 1.72 -0.04 2.1 0.02 l1.18 0.34 c0.24 0.08 0.48 0.18 0.72 0.28 l1.1 1.76 c0.08 1.26 0.14 2.44 0.16 3.56 c0 1.92 0 4.02 -0.16 4.9 c-0.1 0.62 -0.24 1.14 -0.26 1.52 c-0.06 0.22 -0.08 0.44 -0.08 0.62 l-1.06 1.58 l-2.4 0.14 l-3.62 0 z M27.54 19.92 l-0.04 -6.94 l0.08 -0.74 l-0.04 -0.74 l0.1 -4.42 l0.18 -1.72 l6.5 0.12 l0.1 3.9 l-4.26 0 l-0.08 2.5 l3.26 -0.06 l0 0.22 l0.1 1.7 l-3.04 0.06 l0.1 2.96 l4.06 0.2 l0 3.08 z" />
              </g>
            </svg>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <SearchBar />
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#383F4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Переключить тему"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
                  <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
                  <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
                </svg>
              )}
            </button>
            {/* Кнопка меню – добавлен color: '#ffffff' */}
            <button
              onClick={toggleMenu}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                padding: 0,
                color: '#ffffff',        // ← явно задаём белый цвет
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#383F4A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && <FullMenu onClose={closeMenu} />}
    </>
  );
};

export default Header;