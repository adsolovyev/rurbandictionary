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
  const [stats, setStats] = useState({ pendingDefinitions: 0, pendingReports: 0 });
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

  if (loading) return <div style={{ color: '#fff' }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1>Панель администратора</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Левая колонка – модерация определений */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: '#2a2f3a', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <Link to="/admin/pending" style={{ textDecoration: 'none', color: '#fff' }}>
              <h2>Модерация определений</h2>
            </Link>
            <p>Ожидают: {stats.pendingDefinitions}</p>
          </div>
          {recentPending.length > 0 && (
            <div style={{ background: '#1e242c', borderRadius: '8px', padding: '16px' }}>
              <h3>Последние новые определения</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', width: '40%' }}>Слово</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%' }}>Автор</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%' }}>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPending.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>
                        <Link to={`/admin/pending?id=${item.id}`} style={{ color: '#4dafff' }}>
                          {item.word}
                        </Link>
                      </td>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>{item.author}</td>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Средняя колонка – жалобы */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: '#2a2f3a', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <Link to="/admin/reports" style={{ textDecoration: 'none', color: '#fff' }}>
              <h2>Жалобы</h2>
            </Link>
            <p>Ожидают: {stats.pendingReports}</p>
          </div>
          {recentReports.length > 0 && (
            <div style={{ background: '#1e242c', borderRadius: '8px', padding: '16px' }}>
              <h3>Последние жалобы</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', width: '40%' }}>Слово</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%' }}>Причина</th>
                    <th style={{ textAlign: 'left', padding: '8px', width: '30%' }}>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>
                        <Link to={`/admin/reports?id=${item.id}`} style={{ color: '#4dafff' }}>
                          {item.definition_word}
                        </Link>
                      </td>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>{item.reason}</td>
                      <td style={{ padding: '8px', wordBreak: 'break-word' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Правая колонка – управление пользователями */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: '#2a2f3a', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <Link to="/admin/users" style={{ textDecoration: 'none', color: '#fff' }}>
              <h2>Пользователи</h2>
            </Link>
            <p>Смена пароля пользователя</p>
          </div>
        </div>
      </div>
    </div>
  );
}