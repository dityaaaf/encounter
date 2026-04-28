import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, History } from 'lucide-react';
import logo from '../images/ect.png';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Vault' },
    { id: 'vouch', label: 'Vouch' },
    { id: 'social', label: 'Social' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-20">
          {/* Logo - Column 1 */}
          <div className="flex justify-start">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src={logo} alt="Encounter Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                Encounter
              </span>
            </button>
          </div>

          {/* Navigation Items - Column 2 (Hidden on Mobile) */}
          <div className="hidden md:flex justify-center">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-white text-green-600 shadow-md ring-1 ring-black/5'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions - Column 3 */}
          <div className="flex justify-end items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => handleNav('history')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      currentPage === 'history'
                        ? 'bg-green-50 text-green-600'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    Riwayat
                  </button>
                  <button
                    onClick={() => handleNav('profile')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all ${
                      currentPage === 'profile'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </button>
                  <button
                    onClick={signOut}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNav('login')}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => handleNav('register')}
                    className="px-8 py-3 rounded-xl text-sm font-black bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                  >
                    Daftar
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fadeIn overflow-hidden">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-green-50 text-green-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <div className="space-y-1 pt-2 border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleNav('history')}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Riwayat Pembelian
                </button>
                <button
                  onClick={() => handleNav('profile')}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                >
                  Profil Saya
                </button>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-[#2ecc71] text-white hover:bg-[#27ae60] transition-all"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
