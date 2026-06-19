import { useState, useRef, useEffect } from 'react';
import domtoimage from 'dom-to-image';

interface CopyLinkModalProps {
  onClose: () => void;
  url: string;
  word: string;
  definition: string;
  example?: string;
}

export default function CopyLinkModal({ onClose, url, word, definition, example }: CopyLinkModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;

  const [bgColors] = useState(() => [getRandomColor(), getRandomColor()]);

  // Шайни-версия — 1% шанс
  const [isShiny] = useState(() => Math.random() < 0.9);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      alert('Не удалось скопировать ссылку');
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    try {
      const el = cardRef.current;
      const originalBorderRadius = el.style.borderRadius;
      el.style.borderRadius = '0';

      const blob = await domtoimage.toBlob(el, {
        width: 500,
        height: 500,
        style: {
          transform: 'scale(1)',
          borderRadius: '0',
          padding: '0',
          margin: '0',
        },
      });

      el.style.borderRadius = originalBorderRadius;

      if (!blob) throw new Error('Failed to generate image');

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (err) {
      console.error(err);
      try {
        const blob = await domtoimage.toBlob(cardRef.current, { width: 500, height: 500 });
        if (blob) {
          const link = document.createElement('a');
          link.download = `definition-${word}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          setImageCopied(true);
          setTimeout(() => setImageCopied(false), 2000);
        }
      } catch (e) {
        console.error(e);
        alert('Не удалось скопировать изображение');
      }
    }
  };

  const shareText = `${word}\n${definition}${example ? `\nПример: ${example}` : ''}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;

  // Шайни-стили
  const backgroundStyle = isShiny
    ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00, #FFD700)'
    : `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`;

  const cardBorder = isShiny ? '3px solid #FFD700' : 'none';
  const cardBoxShadow = isShiny
    ? '0 0 30px rgba(255,215,0,0.6), 8px 8px 20px rgba(0,0,0,0.2)'
    : '8px 8px 20px rgba(0,0,0,0.2)';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '560px',
          width: '100%',
          border: '1px solid var(--border-color)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: 'var(--text-color)', marginBottom: '16px' }}>
          Поделиться {isShiny && <span style={{ marginLeft: '8px' }}>✨</span>}
        </h3>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <input
            type="text"
            value={url}
            readOnly
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: 'var(--vote-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-color)',
              fontSize: '13px',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              backgroundColor: '#4dafff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4dafff')}
          >
            {linkCopied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--link-color)',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s, text-decoration 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--link-color)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z" />
            </svg>
            Поделиться в Telegram
          </a>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '0 0 20px 0' }} />

        <div style={{ marginBottom: '16px' }}>
          <div
            ref={cardRef}
            style={{
              width: '500px',
              height: '500px',
              maxWidth: '100%',
              aspectRatio: '1 / 1',
              borderRadius: '16px',
              margin: '0 auto 12px',
              position: 'relative',
              overflow: 'hidden',
              background: backgroundStyle,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-2deg)',
                width: '300px',
                maxHeight: '300px',
                minHeight: '120px',
                maxWidth: '85%',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: cardBorder,
                boxShadow: cardBoxShadow,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
                textAlign: 'left',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#4356c9',
                  marginBottom: '6px',
                  wordBreak: 'break-word',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {word}
                {isShiny && <span style={{ fontSize: '24px' }}>✨</span>}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                }}
              >
                {definition}
              </div>
              {example && (
                <div
                  style={{
                    fontSize: '14px',
                    color: '#555555',
                    fontStyle: 'italic',
                    marginTop: '8px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                  }}
                >
                  {example}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCopyImage}
            style={{
              backgroundColor: '#4dafff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'block',
              margin: '0 auto',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a8fcc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4dafff')}
          >
            {imageCopied ? 'Изображение скопировано!' : 'Скопировать изображение'}
          </button>
        </div>
      </div>
    </div>
  );
}