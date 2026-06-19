import { useState, useRef, useEffect } from 'react';
import domtoimage from 'dom-to-image';

interface CopyLinkModalProps {
  onClose: () => void;
  url: string;
  word: string;
  definition: string;
  example?: string;
}

type Rarity = 'common' | 'gold' | 'black' | 'invert';

export default function CopyLinkModal({ onClose, url, word, definition, example }: CopyLinkModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;

  const generateBgColors = () => [getRandomColor(), getRandomColor()];

  // Механика первого раза: первый раз 10%, дальше 3%
  const getInitialRarity = (): Rarity => {
    const hasSeenShiny = localStorage.getItem('hasSeenShiny');
    let isRare: boolean;
    if (!hasSeenShiny) {
      isRare = Math.random() < 0.1; // первый раз 10%
      if (isRare) localStorage.setItem('hasSeenShiny', 'true');
    } else {
      isRare = Math.random() < 0.03; // дальше 3%
    }
    if (!isRare) return 'common';
    const types: Rarity[] = ['gold', 'black', 'invert'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const [bgColors, setBgColors] = useState(() => generateBgColors());
  const [rarity, setRarity] = useState<Rarity>(() => getInitialRarity());

  const isShiny = rarity !== 'common';

  const regenerateCard = () => {
    setBgColors(generateBgColors());
    // При реролле используем базовый шанс (3%), без "первого раза"
    const isRare = Math.random() < 0.03;
    if (!isRare) {
      setRarity('common');
    } else {
      const types: Rarity[] = ['gold', 'black', 'invert'];
      setRarity(types[Math.floor(Math.random() * types.length)]);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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

  // Стили для разных редкостей
  const getRarityStyles = () => {
    switch (rarity) {
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700, #FF8C00)',
          border: '3px solid #FFD700',
          boxShadow: '0 0 30px rgba(255,215,0,0.6), 8px 8px 20px rgba(0,0,0,0.2)',
          icon: '⭐',
          label: 'Золотая карточка!',
        };
      case 'black':
        return {
          background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1a1a1a)',
          border: '3px solid #C0C0C0',
          boxShadow: '0 0 30px rgba(192,192,192,0.3), 8px 8px 20px rgba(0,0,0,0.5)',
          icon: '🖤',
          label: 'Чёрная карточка!',
        };
      case 'invert':
        return {
          background: 'linear-gradient(135deg, #ffffff, #e0e0e0, #ffffff)',
          border: '3px solid #000000',
          boxShadow: '0 0 30px rgba(0,0,0,0.3), 8px 8px 20px rgba(0,0,0,0.2)',
          icon: '🌀',
          label: 'Инверсированная карточка!',
        };
      default:
        return {
          background: `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`,
          border: 'none',
          boxShadow: '8px 8px 20px rgba(0,0,0,0.2)',
          icon: '',
          label: '',
        };
    }
  };

  const rarityStyles = getRarityStyles();

  const isInvert = rarity === 'invert';

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
          {/* Уведомление о редкой карточке */}
          {isShiny && (
  <div
    style={{
      textAlign: 'center',
      padding: '4px 12px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: '20px',
      display: 'inline-block',
      margin: '0 auto 8px',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '14px',
      letterSpacing: '0.5px',
    }}
  >
    {rarityStyles.icon} Вам выпала {rarityStyles.label} {rarityStyles.icon}
  </div>
)}

          {/* Карточка */}
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
              background: rarityStyles.background,
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
                backgroundColor: isInvert ? '#000000' : '#ffffff',
                borderRadius: '12px',
                border: rarityStyles.border,
                boxShadow: rarityStyles.boxShadow,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
                textAlign: 'left',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                {isShiny && <span style={{ fontSize: '24px' }}>{rarityStyles.icon}</span>}
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: isInvert ? '#ffffff' : '#4356c9',
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                  }}
                >
                  {word}
                </div>
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: isInvert ? '#ffffff' : '#000000',
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
                    color: isInvert ? '#cccccc' : '#555555',
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

          {/* Кнопки */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={regenerateCard}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s, color 0.2s',
                color: 'var(--text-color)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--vote-bg)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-color)';
              }}
              title="Перегенерировать карточку"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                <path d="M192,32H64A32,32,0,0,0,32,64V192a32,32,0,0,0,32,32H192a32,32,0,0,0,32-32V64A32,32,0,0,0,192,32Zm16,160a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H192a16,16,0,0,1,16,16ZM104,84A12,12,0,1,1,92,72,12,12,0,0,1,104,84Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,84Zm-72,44a12,12,0,1,1-12-12A12,12,0,0,1,104,128Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,128Zm-72,44a12,12,0,1,1-12-12A12,12,0,0,1,104,172Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,172Z" />
              </svg>
            </button>

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
    </div>
  );
}