import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuggestions, getRandomWord } from '../services/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        const results = await getSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (word: string) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/search?word=${encodeURIComponent(word)}`);
  };

  const handleRandomWord = async () => {
    const randomWord = await getRandomWord();
    setQuery('');
    setShowSuggestions(false);
    navigate(`/search?word=${encodeURIComponent(randomWord)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query.trim());
    }
  };

  // Определяем, показывать кнопку поиска или рандома
  const showSearchButton = query.trim().length > 0;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1e242c',
          border: '1px solid #2a2f3a',
          borderRadius: '4px',
          padding: '4px 8px',
          gap: '8px',
        }}
      >
        {/* Иконка лупы слева */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#a0a0a0"
          viewBox="0 0 256 256"
          style={{ flexShrink: 0 }}
        >
          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
        </svg>

        {/* Поле ввода */}
        <input
          type="text"
          placeholder="Введите любое слово..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '1rem',
            padding: '4px 0',
          }}
        />

        {/* Динамическая кнопка справа */}
        {showSearchButton ? (
          <button
            onClick={() => handleSearch(query.trim())}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              padding: 0,
              color: '#4dafff',
            }}
            title="Поиск"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleRandomWord}
            className="random-button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              padding: 0,
              color: '#a0a0a0',
            }}
            title="Случайное слово"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="random-icon"
            >
              <path d="M237.66,178.34a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L212.69,192H200.94a72.12,72.12,0,0,1-58.59-30.15l-41.72-58.4A56.1,56.1,0,0,0,55.06,80H32a8,8,0,0,1,0-16H55.06a72.12,72.12,0,0,1,58.59,30.15l41.72,58.4A56.1,56.1,0,0,0,200.94,176h11.75l-10.35-10.34a8,8,0,0,1,11.32-11.32ZM143,107a8,8,0,0,0,11.16-1.86l1.2-1.67A56.1,56.1,0,0,1,200.94,80h11.75L202.34,90.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L212.69,64H200.94a72.12,72.12,0,0,0-58.59,30.15l-1.2,1.67A8,8,0,0,0,143,107Zm-30,42a8,8,0,0,0-11.16,1.86l-1.2,1.67A56.1,56.1,0,0,1,55.06,176H32a8,8,0,0,0,0,16H55.06a72.12,72.12,0,0,0,58.59-30.15l1.2-1.67A8,8,0,0,0,113,149Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Выпадающие подсказки */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#212936',
            border: '1px solid #2a2f3a',
            borderTop: 'none',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            zIndex: 1000,
            borderRadius: '0 0 4px 4px',
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s}
              onClick={() => handleSearch(s)}
              style={{
                padding: '6px',
                cursor: 'pointer',
                borderBottom: '1px solid #2a2f3a',
                color: '#ffffff',
              }}
            >
              {s}
            </li>
          ))}
            <li
            style={{
                borderTop: '1px solid #2a2f3a',
                marginTop: '4px',
                padding: '6px',
                cursor: 'pointer',
                color: '#4dafff',
                backgroundColor: '#212936',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
            onClick={handleRandomWord}
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
                style={{ flexShrink: 0 }}
            >
                <path d="M237.66,178.34a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L212.69,192H200.94a72.12,72.12,0,0,1-58.59-30.15l-41.72-58.4A56.1,56.1,0,0,0,55.06,80H32a8,8,0,0,1,0-16H55.06a72.12,72.12,0,0,1,58.59,30.15l41.72,58.4A56.1,56.1,0,0,0,200.94,176h11.75l-10.35-10.34a8,8,0,0,1,11.32-11.32ZM143,107a8,8,0,0,0,11.16-1.86l1.2-1.67A56.1,56.1,0,0,1,200.94,80h11.75L202.34,90.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L212.69,64H200.94a72.12,72.12,0,0,0-58.59,30.15l-1.2,1.67A8,8,0,0,0,143,107Zm-30,42a8,8,0,0,0-11.16,1.86l-1.2,1.67A56.1,56.1,0,0,1,55.06,176H32a8,8,0,0,0,0,16H55.06a72.12,72.12,0,0,0,58.59-30.15l1.2-1.67A8,8,0,0,0,113,149Z" />
            </svg>
            <span>Случайное слово</span>
            </li>
        </ul>
      )}
    </div>
  );
}