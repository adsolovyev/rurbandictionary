import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomWord, getSuggestions } from '../services/api';
import type { Suggestion } from '../services/api';
import { useSuggestionsStore } from '../stores/suggestionsStore';

export default function SearchBar() {
  const { data: cachedData, loading: cacheLoading } = useSuggestionsStore();
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!headerRef.current) headerRef.current = document.querySelector('header');
    const updatePosition = () => {
      if (headerRef.current) setDropdownTop(headerRef.current.getBoundingClientRect().bottom);
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  // Логика подсказок
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const lowerQuery = query.toLowerCase();

      // Если кэш ещё загружается, ничего не делаем (ждём)
      if (cacheLoading) return;

      // Используем кэш
      if (cachedData.length > 0) {
        const matches = cachedData
          .filter(s => s.word.toLowerCase().startsWith(lowerQuery))
          .slice(0, 10); // ограничиваем 10
        setFilteredSuggestions(matches);
        setShowSuggestions(true);
        return;
      }

      // Fallback (старый запрос)
      try {
        const results = await getSuggestions(query);
        setFilteredSuggestions(results.slice(0, 10)); // ограничиваем
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, cachedData, cacheLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setShowSuggestions(false);
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
    try {
      const randomWord = await getRandomWord();
      setQuery('');
      setShowSuggestions(false);
      navigate(`/search?word=${encodeURIComponent(randomWord)}`);
    } catch (err) {
      console.error('Ошибка при получении случайного слова', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) handleSearch(query.trim());
  };

  const showSearchButton = query.trim().length > 0;

  return (
    <>
      <div ref={wrapperRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e242c', border: '1px solid #4b5563', borderRadius: '40px', padding: '0 8px', gap: '8px', height: '40px' }}>
          {showSuggestions && filteredSuggestions.length > 0 ? (
            <div
              style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.2s', color: '#a0a0a0', marginLeft: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#EFFF00'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
              onClick={() => { setQuery(''); setShowSuggestions(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#a0a0a0" viewBox="0 0 256 256" style={{ flexShrink: 0, marginLeft: '4px' }}><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>
          )}
          <input
            type="text"
            placeholder="Введите любое слово..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#ffffff', fontSize: '1rem', padding: '4px 0' }}
          />
          {showSearchButton ? (
            <button
              onClick={() => handleSearch(query.trim())}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: 0, marginRight: '4px', color: '#4dafff' }}
              title="Поиск"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>
            </button>
          ) : (
            <button
              onClick={handleRandomWord}
              className="random-button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: 0, marginRight: '4px' }}
              title="Случайное слово"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 256 256" className="random-icon"><path d="M237.66,178.34a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L212.69,192H200.94a72.12,72.12,0,0,1-58.59-30.15l-41.72-58.4A56.1,56.1,0,0,0,55.06,80H32a8,8,0,0,1,0-16H55.06a72.12,72.12,0,0,1,58.59,30.15l41.72,58.4A56.1,56.1,0,0,0,200.94,176h11.75l-10.35-10.34a8,8,0,0,1,11.32-11.32ZM143,107a8,8,0,0,0,11.16-1.86l1.2-1.67A56.1,56.1,0,0,1,200.94,80h11.75L202.34,90.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L212.69,64H200.94a72.12,72.12,0,0,0-58.59,30.15l-1.2,1.67A8,8,0,0,0,143,107Zm-30,42a8,8,0,0,0-11.16,1.86l-1.2,1.67A56.1,56.1,0,0,1,55.06,176H32a8,8,0,0,0,0,16H55.06a72.12,72.12,0,0,0,58.59-30.15l1.2-1.67A8,8,0,0,0,113,149Z"/></svg>
            </button>
          )}
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && dropdownTop > 0 && (
        <div style={{ position: 'fixed', top: dropdownTop, left: 0, right: 0, backgroundColor: '#212936', borderBottom: '1px solid #2a2f3a', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', zIndex: 999 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: '12px 0' }}>
              {filteredSuggestions.map((s) => (
                <li key={s.word} onMouseDown={() => handleSearch(s.word)} style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #2a2f3a', gap: '12px' }}>
                  <strong style={{ color: '#ffffff', fontWeight: 'bold', flex: '0 0 auto', maxWidth: '30%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.word}</strong>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0, wordBreak: 'break-word' }}>{s.definition.length > 150 ? s.definition.slice(0, 150) + '…' : s.definition}</span>
                  <div style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', transition: 'background-color 0.2s', color: '#4dafff' }}
                       onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFFF00'; e.currentTarget.style.color = '#000000'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4dafff'; }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>
                  </div>
                </li>
              ))}
              <li onMouseDown={handleRandomWord} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #2a2f3a' }}>
                <span style={{ color: '#ffffff' }}>Случайное слово</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', transition: 'background-color 0.2s', color: '#4dafff' }}
                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFFF00'; e.currentTarget.style.color = '#000000'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4dafff'; }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="random-icon"><path d="M237.66,178.34a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L212.69,192H200.94a72.12,72.12,0,0,1-58.59-30.15l-41.72-58.4A56.1,56.1,0,0,0,55.06,80H32a8,8,0,0,1,0-16H55.06a72.12,72.12,0,0,1,58.59,30.15l41.72,58.4A56.1,56.1,0,0,0,200.94,176h11.75l-10.35-10.34a8,8,0,0,1,11.32-11.32ZM143,107a8,8,0,0,0,11.16-1.86l1.2-1.67A56.1,56.1,0,0,1,200.94,80h11.75L202.34,90.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L212.69,64H200.94a72.12,72.12,0,0,0-58.59,30.15l-1.2,1.67A8,8,0,0,0,143,107Zm-30,42a8,8,0,0,0-11.16,1.86l-1.2,1.67A56.1,56.1,0,0,1,55.06,176H32a8,8,0,0,0,0,16H55.06a72.12,72.12,0,0,0,58.59-30.15l1.2-1.67A8,8,0,0,0,113,149Z"/></svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}