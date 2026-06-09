import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { JSX } from 'react';

interface LinkedTextProps {
  text: string;
  words: string[];
  excludeWord?: string;
}

export default function LinkedText({ text, words, excludeWord }: LinkedTextProps) {
  const linkedHtml = useMemo(() => {
    if (!text || words.length === 0) return text;

    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const escapedWords = sortedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(?<![\\p{L}\\p{N}])(${escapedWords.join('|')})(?![\\p{L}\\p{N}])`, 'giu');

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const matchedWord = match[1];
      // Проверяем, не нужно ли исключить это слово (регистронезависимо, но с учётом исходного регистра в matchedWord)
      const isExcluded = excludeWord && matchedWord.toLowerCase() === excludeWord.toLowerCase();
      if (isExcluded) {
        parts.push(matchedWord);
      } else {
        parts.push(
          <Link
            key={match.index}
            to={`/search?word=${encodeURIComponent(matchedWord)}`}
            style={{ color: '#4dafff', textDecoration: 'underline' }}
          >
            {matchedWord}
          </Link>
        );
      }
      lastIndex = match.index + matchedWord.length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  }, [text, words, excludeWord]);

  return <>{linkedHtml}</>;
}