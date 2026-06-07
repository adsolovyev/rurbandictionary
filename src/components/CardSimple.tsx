import type { Definition } from '../services/api';

interface CardSimpleProps {
  definition: Definition;
  actions?: React.ReactNode;
  showVotes?: boolean;
  showDateAndAuthor?: boolean;
}

export default function CardSimple({
  definition,
  actions,
  showVotes = true,
  showDateAndAuthor = true,
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
        border: '1px solid #2a2f3a',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        background: '#212936',
        color: '#ffffff',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{definition.word}</h2>
      <p>{definition.definition}</p>
      {definition.example && (
        <blockquote
          style={{
            borderLeft: '4px solid #4dafff',
            paddingLeft: '12px',
            margin: '12px 0',
            fontStyle: 'italic',
            color: '#cccccc',
          }}
        >
          {definition.example}
        </blockquote>
      )}

      {showDateAndAuthor && (
        <div style={{ fontSize: '0.85rem', color: '#a0a0a0', marginTop: '12px' }}>
          Добавлено {definition.author}, {formattedDate}
        </div>
      )}

      {showVotes && (
        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#a0a0a0' }}>
          ⯅ {definition.upvotes} ⯆ {definition.downvotes}
        </div>
      )}

      {actions && <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>{actions}</div>}
    </div>
  );
}