import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
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
import Alphabet from './pages/Alphabet';
import NonCyrillicBrowse from './pages/NonCyrillicBrowse';
import { useSettingsStore } from './stores/settingsStore';
import UserDefinitions from './pages/UserDefinitions.tsx';

function App() {
  const fetchMe = useAuthStore(state => state.fetchMe);
  const fetchSettings = useSettingsStore(state => state.fetchSettings);
  const user = useAuthStore(state => state.user);
  useEffect(() => {
  if (user) fetchSettings();
  }, [user, fetchSettings]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

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
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/alphabet" element={<Alphabet />} />
            <Route path="/browse/non-cyrillic" element={<NonCyrillicBrowse />} />
            <Route path="/user/:login" element={<UserDefinitions />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;