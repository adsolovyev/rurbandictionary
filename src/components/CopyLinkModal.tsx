import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface CopyLinkModalProps {
  onClose: () => void;
  url: string;
  word: string;
  definition: string;
}

export default function CopyLinkModal({ onClose, url, word, definition }: CopyLinkModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Генерация случайных цветов для фона
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [bgColors] = useState(() => [getRandomColor(), getRandomColor()]);

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
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // повышаем качество
        useCORS: true,
        backgroundColor: null,
      });
      const imageDataUrl = canvas.toDataURL('image/png');
      // Копируем в буфер обмена как изображение
      const blob = await fetch(imageDataUrl).then(res => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Не удалось скопировать изображение');
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
        <h3 style={{ color: 'var(--text-color)', marginBottom: '16px' }}>Поделиться</h3>

        {/* Блок ссылки */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={url}
            readOnly
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'var(--vote-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-color)',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              backgroundColor: '#4dafff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '40px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {linkCopied ? 'Ссылка скопирована!' : 'Копировать ссылку'}
          </button>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />

        {/* Блок картинки */}
        <div style={{ marginBottom: '16px' }}>
          <div
            ref={cardRef}
            style={{
              width: '500px',
              height: '500px',
              maxWidth: '100%',
              aspectRatio: '1 / 1',
              background: `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              margin: '0 auto 12px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Белая карточка 300×300 с наклоном и тенью */}
            <div
              style={{
                width: '300px',
                height: '300px',
                maxWidth: '80%',
                maxHeight: '80%',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '8px 8px 20px rgba(0,0,0,0.2)',
                transform: 'rotate(-2deg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4356c9', marginBottom: '12px', wordBreak: 'break-word' }}>
                {word}
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
            }}
          >
            {imageCopied ? 'Изображение скопировано!' : 'Поделиться изображением'}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-color)',
            display: 'block',
            margin: '12px auto 0',
            fontSize: '14px',
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}