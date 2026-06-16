import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';
import { getAdminStats, getRecentPendingDefinitions, getRecentReports } from '../services/api';

interface PendingItem {
  id: number;
  word: string;
  author: string;
  created_at: string;
}

interface ReportItem {
  id: number;
  definition_word: string;
  reason: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ pendingDefinitions: 0, pendingReports: 0, pendingResets: 0 });
  const [loading, setLoading] = useState(true);
  const [recentPending, setRecentPending] = useState<PendingItem[]>([]);
  const [recentReports, setRecentReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (user && user.isAdmin) {
      Promise.all([getAdminStats(), getRecentPendingDefinitions(10), getRecentReports(10)])
        .then(([statsData, pendingData, reportsData]) => {
          if (isMounted) {
            setStats(statsData);
            setRecentPending(pendingData);
            setRecentReports(reportsData);
          }
        })
        .catch(err => console.error(err))
        .finally(() => {
          if (isMounted) {
            setTimeout(() => setLoading(false), 0);
          }
        });
    } else if (user && !user.isAdmin) {
      if (isMounted) {
        setTimeout(() => setLoading(false), 0);
      }
    }
    return () => { isMounted = false; };
  }, [user]);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div style={{ color: 'var(--text-color)' }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: 'var(--text-color)' }}>Панель администратора</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Левая колонка – модерация определений */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
            <Link to="/admin/pending" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>
              <h2 style={{ color: 'var(--text-color)' }}>Модерация определений</h2>
            </Link>
            <p style={{ color: 'var(--text-color)' }}>Ожидают: {stats.pendingDefinitions}</p>
          </div>
          {recentPending.length > 0 && (
            <div style={{ background: 'var(--vote-bg)', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ color: 'var(--text-color)' }}>Последние новые определения</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-color)', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', width: '40%', color: 'var(--text-color)' }}>Слово</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%', color: 'var(--text-color)' }}>Автор</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%', color: 'var(--text-color)' }}>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPending.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>
                        <Link to={`/admin/pending?id=${item.id}`} style={{ color: 'var(--link-color)' }}>
                          {item.word}
                        </Link>
                      </td>
                      <td style={{ padding: '8px', wordBreak: 'break-word', color: 'var(--text-color)' }}>{item.author}</td>
                      <td style={{ padding: '8px', wordBreak: 'break-word', color: 'var(--text-color)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Средняя колонка – жалобы */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
            <Link to="/admin/reports" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>
              <h2 style={{ color: 'var(--text-color)' }}>Жалобы</h2>
            </Link>
            <p style={{ color: 'var(--text-color)' }}>Ожидают: {stats.pendingReports}</p>
          </div>
          {recentReports.length > 0 && (
            <div style={{ background: 'var(--vote-bg)', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ color: 'var(--text-color)' }}>Последние жалобы</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-color)', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', width: '40%', color: 'var(--text-color)' }}>Слово</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%', color: 'var(--text-color)' }}>Причина</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%', color: 'var(--text-color)' }}>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>
                        <Link to={`/admin/reports?id=${item.id}`} style={{ color: 'var(--link-color)' }}>
                          {item.definition_word}
                        </Link>
                      </td>
                      <td style={{ padding: '8px', wordBreak: 'break-word', color: 'var(--text-color)' }}>{item.reason}</td>
                      <td style={{ padding: '8px', wordBreak: 'break-word', color: 'var(--text-color)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Правая колонка – смена пароля пользователей */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
            <Link to="/admin/reset-requests" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>
              <h2 style={{ color: 'var(--text-color)' }}>Смена пароля пользователей</h2>
            </Link>
            <p style={{ color: 'var(--text-color)' }}>Ожидают: {stats.pendingResets}</p>
          </div>

          <div style={{
            backgroundColor: 'var(--contrast-bg)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            marginTop: '20px',
            border: '1px solid var(--border-color)',
          }}>
            <img
              src="images/i.svg"
              alt="Котик"
              style={{
                maxWidth: '140px',
                width: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
          <div style={{
            backgroundColor: 'var(--contrast-bg)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            marginTop: '20px',
            border: '1px solid var(--border-color)',
          }}>
            <a
              href="https://dashboard.simpleanalytics.com/?utm_source=rude-lv1t.onrender.com&utm_content=badge&affiliate=hapef"
              referrerPolicy="origin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <picture>
                <source
                  srcSet="https://simpleanalyticsbadges.com/rude-lv1t.onrender.com?mode=dark"
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  src="https://simpleanalyticsbadges.com/rude-lv1t.onrender.com?mode=light"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  alt="Simple Analytics"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </picture>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}