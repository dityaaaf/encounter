import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Shield, Trophy, HelpCircle, LogOut, ChevronRight, Edit2, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings & Privacy', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', label: 'Bantuan', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const leaderboardData: { name: string; total: number; rank: number }[] = [];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Data Pengguna</h3>
                <button className="flex items-center gap-2 text-sm text-green-600 font-medium hover:text-green-700">
                  <Edit2 className="w-4 h-4" /> Ubah Profil
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Email</div>
                    <div className="text-slate-900 font-semibold">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Bergabung Sejak</div>
                    <div className="text-slate-900 font-semibold">27 April 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center py-12">
              <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Leaderboard Kosong</h3>
              <p className="text-slate-500">Belum ada data pembelian untuk saat ini (Masa Testing).</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Pengaturan Akun</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400 group-hover:text-green-600" />
                    <span className="font-medium text-slate-700">Privasi & Keamanan</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-400 group-hover:text-green-600" />
                    <span className="font-medium text-slate-700">Notifikasi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">Pusat Bantuan Encounter</h3>
              
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Bagaimana cara membeli Robux?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Pilih paket yang Anda inginkan di halaman Shop, masukkan username Roblox Anda, pilih metode pembayaran, dan lakukan pembayaran sesuai instruksi. Robux akan dikirim segera setelah pembayaran diverifikasi.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Berapa lama proses pengiriman?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Proses pengiriman biasanya memakan waktu 5-15 menit. Namun, dalam beberapa kasus bisa memakan waktu hingga 24 jam tergantung antrian sistem.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Kenapa pesanan saya belum masuk?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Pastikan username Roblox yang Anda masukkan benar. Jika dalam 1 jam belum masuk, silakan hubungi admin melalui WhatsApp dengan melampirkan bukti pembayaran.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://wa.me/6281225133501" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-green-50 border border-green-100 text-center hover:bg-green-100 transition-colors group"
                >
                  <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">WhatsApp Support</div>
                  <p className="text-xs text-slate-500 mt-1">Chat langsung dengan Admin kami.</p>
                </a>
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <div className="font-bold text-slate-900">Keamanan Terjamin</div>
                  <p className="text-xs text-slate-500 mt-1">Transaksi Anda 100% aman bersama kami.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-green-500/20">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.email?.split('@')[0]}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-green-50 text-green-600 border-r-4 border-green-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-t border-slate-100"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
