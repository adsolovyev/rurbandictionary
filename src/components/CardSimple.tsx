import type { Definition } from '../services/api';

interface CardSimpleProps {
  definition: Definition;
  actions?: React.ReactNode;
  showVotes?: boolean;
  showDateAndAuthor?: boolean;
  style?: React.CSSProperties; 
}

export default function CardSimple({
  definition,
  actions,
  showVotes = true,
  showDateAndAuthor = true,
  style,
}: CardSimpleProps) {
  const formattedDate = definition.created_at
    ? new Date(definition.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '16px',
        background: 'var(--bg-card)',
        color: 'var(--text-color)',
        ...style,
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: '1.8rem', color: 'var(--text-color)' }}>{definition.word}</h2>
      <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{definition.definition}</p>
      {definition.example && (
        <blockquote
          style={{
            borderLeft: '4px solid var(--link-color)',
            paddingLeft: '12px',
            margin: '12px 0',
            fontStyle: 'italic',
            color: 'var(--blockquote-color)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {definition.example}
        </blockquote>
      )}

      {showDateAndAuthor && (
        <div style={{ fontSize: '0.85rem', color: 'var(--blockquote-color)', marginTop: '12px' }}>
          Добавлено {definition.author}, {formattedDate}
        </div>
      )}

      {showVotes && (
        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--blockquote-color)' }}>
          ⯅ {definition.upvotes} ⯆ {definition.downvotes}
        </div>
      )}

      {actions && <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>{actions}</div>}
    </div>
  );
}