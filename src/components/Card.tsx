import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { vote } from '../services/api';
import CopyLinkModal from './CopyLinkModal';
import { useWordsStore } from '../stores/wordsStore';
import LinkedText from './LinkedText';

interface CardProps {
  id: number;
  word: string;
  definition: string;
  example: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote?: number | null;
}

export default function Card({
  id,
  word,
  definition,
  example,
  author,
  created_at,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  user_vote,
}: CardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(() => {
    if (user_vote === 1) return 'up';
    if (user_vote === -1) return 'down';
    return null;
  });
  const [showModal, setShowModal] = useState(false);
  const { words } = useWordsStore();

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) {
      // Сохраняем полный путь (включая параметры поиска)
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (userVote === type) {
      if (type === 'up') {
        setUpvotes(prev => prev - 1);
      } else {
        setDownvotes(prev => prev - 1);
      }
      setUserVote(null);
      await vote(id, type);
      return;
    }

    if (type === 'up') {
      setUpvotes(prev => prev + 1);
      if (userVote === 'down') {
        setDownvotes(prev => prev - 1);
      }
    } else {
      setDownvotes(prev => prev + 1);
      if (userVote === 'up') {
        setUpvotes(prev => prev - 1);
      }
    }
    setUserVote(type);
    await vote(id, type);
  };

  const handleReport = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    navigate(`/report/${id}`);
  };

  const handleCopyLink = () => {
    setShowModal(true);
  };

  const speakWord = (word: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('ru-RU', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return (
    <>
      <div
        style={{
          border: '2px solid var(--border-color)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          background: 'var(--bg-card)',
          color: 'var(--text-color)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 className="card-title" style={{ margin: 0, fontSize: '2.5rem', lineHeight: 1, color: 'var(--text-color)' }}>{word}</h2>
            <button
              onClick={() => speakWord(word)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                transform: 'translateY(5px)',
              }}
              title="Произнести слово"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--text-color)" viewBox="0 0 256 256">
                <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" />
              </svg>
            </button>
          </div>
          <div className="card-action-buttons" style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCopyLink}
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
                color: '#6B7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }}
              title="Скопировать ссылку"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z" />
              </svg>
            </button>
            <button
              onClick={handleReport}
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
                color: '#6B7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }}
              title="Пожаловаться"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" />
              </svg>
            </button>
          </div>
        </div>

        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <LinkedText text={definition} words={words} excludeWord={word} />
        </p>

        <blockquote
          style={{
            borderLeft: '4px solid var(--link-color)',
            paddingLeft: '12px',
            margin: '12px 0',
            fontStyle: 'italic',
            color: 'var(--blockquote-color)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <LinkedText text={example} words={words} excludeWord={word} />
        </blockquote>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--blockquote-color)' }}>
            <span
              onClick={() => navigate(`/search?word=${encodeURIComponent(word)}`)}
              className="clickable-link"
              style={{ cursor: 'pointer', color: 'var(--link-color)' }}
            >
              {word}
            </span>
            {' '}добавлено{' '}
            <span
              onClick={() => navigate(`/user/${encodeURIComponent(author)}`)}
              className="clickable-link"
              style={{ cursor: 'pointer', color: 'var(--link-color)' }}
            >
              {author}
            </span>
            , {formattedDate}
          </div>

          <div
            style={{
              display: 'flex',
              borderRadius: '20px',
              border: '1px solid var(--vote-border)',
              overflow: 'hidden',
              backgroundColor: 'var(--vote-bg)',
            }}
          >
            <button
              onClick={() => handleVote('up')}
              className="vote-up"
              style={{
                background: userVote === 'up' ? '#4caf50' : 'transparent',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-color)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-color)" viewBox="0 0 256 256">
                <path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z" />
              </svg>
              {upvotes}
            </button>
            <div style={{ width: '1px', backgroundColor: 'var(--vote-border)', alignSelf: 'stretch' }} />
            <button
              onClick={() => handleVote('down')}
              className="vote-down"
              style={{
                background: userVote === 'down' ? '#f44336' : 'transparent',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-color)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-color)" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
              {downvotes}
            </button>
          </div>
        </div>
      </div>
      {showModal && <CopyLinkModal word={word} onClose={() => setShowModal(false)} />}
    </>
  );
}