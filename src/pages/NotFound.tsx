import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-color)' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Страница не найдена</p>
      <Link to="/" style={{ color: 'var(--link-color)' }}>Вернуться на главную</Link>
    </div>
  );
}