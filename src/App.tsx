import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import VouchPage from './pages/VouchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotificationPage from './pages/NotificationPage';
import AdminPage from './pages/AdminPage';

import logoEct from './images/ect.png';

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('encounter_current_page') || 'landing';
  });
  const { user, loading } = useAuth();

  useEffect(() => {
    localStorage.setItem('encounter_current_page', currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2ecc71] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Simplified Landing View for unauthenticated users
  if (!user && currentPage !== 'login' && currentPage !== 'register') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl animate-float">
            <img src={logoEct} alt="Encounter Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">ENCOUNTER</h1>
          <p className="text-slate-500 font-medium mb-12">Pusat Top-Up Robux Terpercaya & Tercepat.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentPage('login')}
              className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:scale-[1.02] transition-all text-xl"
            >
              MASUK
            </button>
            <button 
              onClick={() => setCurrentPage('register')}
              className="w-full py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-black hover:bg-slate-50 hover:scale-[1.02] transition-all text-xl"
            >
              DAFTAR
            </button>
          </div>
          <p className="mt-12 text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 ENCOUNTER STORE</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    // If not logged in, only allow login or register pages
    if (!user) {
      if (currentPage === 'register') return <RegisterPage onNavigate={setCurrentPage} />;
      return <LoginPage onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'home':
      case 'landing': // Redirect landing to home if already logged in
        return <HomePage onNavigate={setCurrentPage} />;
      case 'shop':
        return <ShopPage onNavigate={setCurrentPage} />;
      case 'vouch':
        return <VouchPage />;
      case 'social':
        return <SocialPage />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'notifications':
        return <NotificationPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'admin':
        return <AdminPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {user && <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className={user ? "pt-0" : ""}>{renderPage()}</main>
      {user && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
