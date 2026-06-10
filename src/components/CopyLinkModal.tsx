import { useState, useEffect } from 'react';

interface CopyLinkModalProps {
  word: string;
  onClose: () => void;
}

export default function CopyLinkModal({ word, onClose }: CopyLinkModalProps) {
  const url = `${window.location.origin}/search?word=${encodeURIComponent(word)}`;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-color)',
          padding: '20px',
          borderRadius: '16px',
          maxWidth: '450px',
          width: '90%',
          border: '1px solid var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-color)' }}>Поделиться "{word}"</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280',
              lineHeight: 1,
              padding: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: '40px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            backgroundColor: 'var(--vote-bg)',
          }}
        >
          <input
            type="text"
            value={url}
            readOnly
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-color)',
              fontSize: '0.9rem',
            }}
          />
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: '#4dafff',
              border: 'none',
              padding: '0 20px',
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4dafff')}
          >
            {copied ? 'Скопировано!' : 'Скопировать'}
          </button>
        </div>
      </div>
    </div>
  );
}