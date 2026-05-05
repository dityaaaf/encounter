import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Settings, Shield, Trophy, HelpCircle, LogOut, ChevronRight, Edit2, Mail, Calendar, MessageCircle, LayoutDashboard, ShoppingBag, History } from 'lucide-react';
import logoEct from '../images/ect.png';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalRobux, setTotalRobux] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) setAvatarUrl(savedAvatar);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert('Hanya support file JPG dan PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        if (user) {
          localStorage.setItem(`avatar_${user.id}`, base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPurchases(data);
        const completedPurchases = data.filter(p => p.status === 'completed' || p.status === 'processing');
        const spent = completedPurchases.reduce((sum, p) => sum + p.price, 0);
        const robux = completedPurchases.reduce((sum, p) => sum + p.robux_amount, 0);
        setTotalSpent(spent);
        setTotalRobux(robux);
      }
      setLoadingStats(false);
    };

    fetchStats();
  }, [user]);

  useEffect(() => {
    if (activeSection === 'leaderboard' && leaderboardData.length === 0) {
      fetchLeaderboard();
    }
  }, [activeSection]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    // Fetch completed/processing purchases for all users
    const { data, error } = await supabase
      .from('purchases')
      .select('user_id, roblox_username, price, robux_amount, status')
      .in('status', ['completed', 'processing']);

    if (!error && data) {
      const userTotals: Record<string, { user_id: string, roblox_username: string, total_spent: number, total_robux: number }> = {};
      
      data.forEach(p => {
        if (!userTotals[p.user_id]) {
          userTotals[p.user_id] = { user_id: p.user_id, roblox_username: p.roblox_username, total_spent: 0, total_robux: 0 };
        }
        userTotals[p.user_id].total_spent += p.price;
        userTotals[p.user_id].total_robux += p.robux_amount;
      });

      // Sort by total_spent descending and take top 10
      const sortedLeaderboard = Object.values(userTotals)
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 10);
        
      setLeaderboardData(sortedLeaderboard);
    } else if (error) {
      console.error('Error fetching leaderboard:', error);
    }
    setLoadingLeaderboard(false);
  };

  function formatRupiah(n: number) {
    return 'Rp' + n.toLocaleString('id-ID');
  }

  const menuItems = [
    { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings & Privacy', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', label: 'Bantuan', icon: <HelpCircle className="w-5 h-5" /> },
    ...(user?.email === 'adit@nusabs.sch.id' ? [{ id: 'admin', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, isAdmin: true }] : []),
  ];


  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Data Pengguna</h3>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex items-center gap-2 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Ubah Profil
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/jpeg, image/png" 
                  className="hidden" 
                />
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
                    <div className="text-slate-900 font-semibold">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                        : 'Tidak diketahui'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistik Pembelian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Pengeluaran</div>
                  <div className="text-2xl font-black text-slate-900">{loadingStats ? '...' : formatRupiah(totalSpent)}</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <History className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Robux Dibeli</div>
                  <div className="text-2xl font-black text-slate-900">{loadingStats ? '...' : totalRobux.toLocaleString()} R$</div>
                </div>
              </div>
            </div>

            {/* Pembelian Terakhir */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Pembelian Terakhir</h3>
              {loadingStats ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <div className="text-xs text-slate-500 font-bold">Memuat data...</div>
                </div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-medium">
                  Belum ada riwayat pembelian.
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900">{p.robux_amount.toLocaleString()} Robux</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatRupiah(p.price)}</div>
                        <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${p.status === 'completed' || p.status === 'processing' ? 'text-green-500' : p.status === 'failed' ? 'text-red-500' : 'text-slate-400'}`}>
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                  {purchases.length > 3 && (
                    <button 
                      onClick={() => onNavigate?.('history')}
                      className="w-full py-3 mt-2 text-sm font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                    >
                      Lihat Semua Riwayat
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <img src={logoEct} alt="Encounter Store Logo" className="w-16 h-16 object-contain drop-shadow-xl animate-float" />
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Sultan Leaderboard</h3>
                  <p className="text-slate-500 font-medium">Peringkat pembeli terbanyak di Encounter Store.</p>
                </div>
              </div>

              {loadingLeaderboard ? (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Memuat Klasemen...</div>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                  <img src={logoEct} alt="Encounter Store Logo" className="w-20 h-20 mx-auto mb-4 opacity-50 grayscale" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Leaderboard Kosong</h3>
                  <p className="text-slate-500">Belum ada data pembelian yang selesai.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboardData.map((user, index) => (
                    <div 
                      key={user.user_id} 
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                        index === 0 ? 'bg-yellow-50 border-yellow-200 shadow-md' :
                        index === 1 ? 'bg-slate-50 border-slate-200' :
                        index === 2 ? 'bg-orange-50/50 border-orange-100' :
                        'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xl shadow-inner ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-yellow-500/50' :
                        index === 1 ? 'bg-slate-300 text-slate-700 shadow-slate-400/50' :
                        index === 2 ? 'bg-orange-300 text-orange-900 shadow-orange-400/50' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        #{index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm flex-shrink-0">
                            {(() => {
                              const avatar = localStorage.getItem(`avatar_${user.user_id}`);
                              if (avatar) {
                                return <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />;
                              }
                              return (user.roblox_username || 'U')[0].toUpperCase();
                            })()}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-lg leading-none">{user.roblox_username}</span>
                              {index === 0 && <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-[10px] font-black text-yellow-900 uppercase tracking-widest">SULTAN</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-slate-500 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" /> {user.total_robux.toLocaleString()} R$
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Topup</div>
                        <div className={`font-black text-xl ${
                          index === 0 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {formatRupiah(user.total_spent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Pengaturan Akun</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => onNavigate?.('privacy')}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400 group-hover:text-green-600" />
                    <span className="font-medium text-slate-700">Privasi & Keamanan</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
                <button 
                  onClick={() => onNavigate?.('notifications')}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
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
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Bagaimana cara membeli Robux?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed pl-4">
                    Pilih paket yang Anda inginkan di halaman Shop, masukkan username Roblox Anda, pilih metode pembayaran QRIS, dan lakukan scan. Setelah membayar, silakan klik tombol konfirmasi WhatsApp di riwayat belanja.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Berapa lama proses pengiriman?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed pl-4">
                    Proses pengiriman biasanya memakan waktu 5-15 menit setelah konfirmasi. Namun, dalam beberapa kasus bisa memakan waktu hingga 24 jam tergantung antrian sistem dan status server Roblox.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Kenapa status saya masih "Not Paid"?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed pl-4">
                    Pastikan Anda telah mengirimkan bukti pembayaran melalui tombol WhatsApp di detail riwayat belanja. Admin akan memverifikasi secara manual sebelum mengubah status menjadi "Paid".
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Apakah aman bertransaksi di sini?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed pl-4">
                    Tentu saja! Kami telah memproses ribuan transaksi dengan aman. Kami tidak pernah meminta password akun Roblox Anda, hanya username untuk keperluan pengiriman.
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
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 mx-auto mb-4 flex items-center justify-center text-slate-500 text-3xl font-bold shadow-sm overflow-hidden relative group cursor-pointer"
                title="Klik untuk ubah foto profil"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.email?.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                  <Edit2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.email?.split('@')[0]}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'admin') {
                      onNavigate?.('admin');
                    } else {
                      setActiveSection(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-green-50 text-green-600 border-r-4 border-green-600'
                      : (item as any).isAdmin 
                        ? 'text-slate-900 bg-slate-50 hover:bg-slate-100'
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
