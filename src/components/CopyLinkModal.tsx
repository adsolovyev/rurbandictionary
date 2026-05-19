import { useState } from 'react';

interface CopyLinkModalProps {
  word: string;
  definitionId: number;
  onClose: () => void;
}

export default function CopyLinkModal({ word, definitionId, onClose }: CopyLinkModalProps) {
  const url = `${window.location.origin}/definition/${definitionId}`;
  const [copied, setCopied] = useState(false);

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
          backgroundColor: '#212936',
          color: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '450px',
          width: '90%',
          border: '1px solid #2a2f3a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок с крестиком */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Поделиться "{word}"</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#ffffff',
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Таблетка: поле + кнопка */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: '40px',
            border: '1px solid #2a2f3a',
            overflow: 'hidden',
            backgroundColor: '#1e242c',
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
              color: '#e0e0e0',
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