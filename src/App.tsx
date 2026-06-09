import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectRoute';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import DefinitionPage from './pages/DefinitionPage';
import AddDefinition from './pages/AddDefinition';
import ReportForm from './pages/ReportForm';
import AlphabetBrowse from './pages/AlphabetBrowse';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import ResetPassword from './pages/ResetPassword';
import AdminReports from './pages/AdminReports';
import AdminPending from './pages/AdminPending';
import AdminDashboard from './pages/AdminDashboard';
import Alphabet from './pages/Alphabet';
import NonCyrillicBrowse from './pages/NonCyrillicBrowse';
import { useSettingsStore } from './stores/settingsStore';
import UserDefinitions from './pages/UserDefinitions';
import Help from './pages/Help';
import AdminUsers from './pages/AdminUsers';
import { useWordsStore } from './stores/wordsStore';

function App() {
  const fetchMe = useAuthStore(state => state.fetchMe);
  const fetchSettings = useSettingsStore(state => state.fetchSettings);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (user) fetchSettings();
  }, [user, fetchSettings]);

  const fetchWords = useWordsStore(state => state.fetchWords);
  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return (
    <BrowserRouter>
      <Header />
      <main style={{ minHeight: '80vh', paddingTop: '32px' }}>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/definition/:id" element={<DefinitionPage />} />
            <Route path="/add" element={<AddDefinition />} />
            <Route path="/report/:definitionId" element={<ReportForm />} />
            <Route path="/browse/:character" element={<AlphabetBrowse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPasswordRequest />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/alphabet" element={<Alphabet />} />
            <Route path="/browse/non-cyrillic" element={<NonCyrillicBrowse />} />
            <Route path="/user/:login" element={<UserDefinitions />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/pending" element={<ProtectedRoute requireAdmin><AdminPending /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;