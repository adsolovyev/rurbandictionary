import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import SearchResults from './pages/SearchResults.tsx';
import DefinitionPage from './pages/DefinitionPage.tsx';
import AddDefinition from './pages/AddDefinition.tsx';
import ReportForm from './pages/ReportForm.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ResetPasswordRequest from './pages/ResetPasswordRequest.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import AdminReports from './pages/AdminReports.tsx';
import Alphabet from './pages/Alphabet.tsx';
import AlphabetBrowse from './pages/AlphabetBrowse.tsx';
import NonCyrillicBrowse from './pages/NonCyrillicBrowse';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ minHeight: '80vh' }}>
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
            <Route path="/browse/:character" element={<AlphabetBrowse />} />
            <Route path="/browse/non-cyrillic" element={<NonCyrillicBrowse />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;