import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useSettingsStore } from './stores/settingsStore';
import { useThemeStore } from './stores/themeStore';
import { useWordsStore } from './stores/wordsStore';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AddDefinition from './pages/AddDefinition';
import ReportForm from './pages/ReportForm';
import AlphabetBrowse from './pages/AlphabetBrowse';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminReports from './pages/AdminReports';
import AdminPending from './pages/AdminPending';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import Alphabet from './pages/Alphabet';
import NonCyrillicBrowse from './pages/NonCyrillicBrowse';
import UserDefinitions from './pages/UserDefinitions';
import { useSuggestionsStore } from './stores/suggestionsStore';
import Help from './pages/Help';

function App() {
  const fetchMe = useAuthStore(state => state.fetchMe);
  const fetchSettings = useSettingsStore(state => state.fetchSettings);
  const fetchWords = useWordsStore(state => state.fetchWords);
  const { theme } = useThemeStore();
  const fetchSuggestionsData = useSuggestionsStore(state => state.fetchData);

  useEffect(() => {
    fetchSuggestionsData();
  }, [fetchSuggestionsData]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

useEffect(() => {
  fetchSettings();
}, [fetchSettings]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, paddingTop: '32px' }}>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/add" element={<AddDefinition />} />
              <Route path="/report/:definitionId" element={<ReportForm />} />
              <Route path="/browse/:character" element={<AlphabetBrowse />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/alphabet" element={<Alphabet />} />
              <Route path="/browse/non-cyrillic" element={<NonCyrillicBrowse />} />
              <Route path="/user/:login" element={<UserDefinitions />} />
              <Route path="/help" element={<Help />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/pending" element={<ProtectedRoute requireAdmin><AdminPending /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminReports /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;