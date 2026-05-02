import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Search, Filter, RefreshCw, AlertCircle, Check, User, Eye, Clock, Calendar, Tag, CreditCard, X } from 'lucide-react';
import RobuxIcon from '../components/RobuxIcon';

interface Purchase {
  id: string;
  robux_amount: number;
  price: number;
  roblox_username: string;
  payment_method: string;
  status: string;
  created_at: string;
  user_id: string;
}

function formatRupiah(n: number) {
  return 'Rp' + n.toLocaleString('id-ID');
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-100', label: 'Pending' },
  processing: { color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Processing' },
  completed: { color: 'text-green-600 bg-green-50 border-green-100', label: 'Completed' },
  failed: { color: 'text-red-600 bg-red-50 border-red-100', label: 'Failed' },
};

export default function AdminPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  // Security: Only allow specific email (Case-insensitive & trimmed)
  const isAdmin = user?.email?.toLowerCase().trim() === 'adit@nusabs.sch.id';

  const fetchAllPurchases = async () => {
    setLoading(true);
    console.log('Admin: Memaksa penarikan data tanpa syarat...');
    
    // Kita gunakan query paling sederhana yang terbukti berhasil di tombol merah tadi
    const { data, error } = await supabase
      .from('purchases')
      .select('*');

    if (error) {
      console.error('Supabase Error:', error);
      setNotification({ type: 'error', message: `Gagal: ${error.message}` });
    } else if (data) {
      console.log(`Berhasil! Ditemukan ${data.length} pesanan.`);
      setPurchases(data as Purchase[]);
      if (data.length === 0) {
        setNotification({ type: 'error', message: 'Database Kosong!' });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // Tarik data langsung saat halaman dibuka
    fetchAllPurchases();

    // 2. Berlangganan perubahan data secara Real-time
    const channel = supabase
      .channel('admin_purchases_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Mendengarkan Insert, Update, dan Delete
          schema: 'public',
          table: 'purchases'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          if (payload.eventType === 'INSERT') {
            setPurchases(prev => [payload.new as Purchase, ...prev]);
            setNotification({ type: 'success', message: 'Ada pesanan baru masuk!' });
          } else if (payload.eventType === 'UPDATE') {
            setPurchases(prev => prev.map(p => p.id === payload.new.id ? payload.new as Purchase : p));
          } else if (payload.eventType === 'DELETE') {
            setPurchases(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const createTestOrder = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('purchases').insert({
        user_id: user.id,
        robux_amount: 999,
        price: 1000,
        roblox_username: 'TEST_ADMIN',
        payment_method: 'qris',
        status: 'pending'
      });
      if (error) throw error;
      setNotification({ type: 'success', message: 'Koneksi Sukses! Data tes berhasil dibuat.' });
      fetchAllPurchases();
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Database Gagal: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      console.log(`Admin: Mengirim update status untuk #${id} ke ${newStatus}...`);
      
      // 1. Kirim update ke Supabase
      const { error } = await supabase
        .from('purchases')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // 2. Verifikasi: Tarik ulang data tersebut untuk memastikan sudah berubah di DB
      const { data: verifyData } = await supabase
        .from('purchases')
        .select('status')
        .eq('id', id)
        .single();

      if (verifyData && verifyData.status === newStatus) {
        console.log('Admin: Verifikasi Sukses! Data tersimpan permanen.');
        setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setNotification({ type: 'success', message: `SUKSES! Status #${id.slice(0,8)} telah tersimpan secara permanen sebagai ${newStatus}.` });
      } else {
        throw new Error('Database menolak perubahan. Pastikan SQL Policy sudah dijalankan.');
      }
      
    } catch (err: any) {
      console.error('Update Error Detail:', err);
      const actualError = err.message || 'Error tidak dikenal';
      setNotification({ 
        type: 'error', 
        message: `DATABASE ERROR: ${actualError}` 
      });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setNotification(null), 8000); // Pesan error bertahan lebih lama agar terbaca
    }
  };

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.roblox_username.toLowerCase().includes(search.toLowerCase()) || 
                         p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center p-12 bg-white rounded-3xl border border-red-100 shadow-xl max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Akses Ditolak</h2>
          <p className="text-slate-500 mb-8">Halaman ini hanya dapat diakses oleh Administrator utama.</p>
          <a href="/" className="inline-block px-8 py-3 rounded-xl bg-slate-900 text-white font-bold transition-all hover:bg-slate-800">Kembali ke Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc]">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-6 z-[60] animate-slideIn">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success' ? 'bg-white border-green-200 text-green-600' : 'bg-white border-red-200 text-red-600'
          }`}>
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Identity Check Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Logged in as</div>
              <div className="text-blue-900 font-black">{user?.email}</div>
            </div>
          </div>
          {isAdmin ? (
            <div className="px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-black uppercase tracking-widest animate-pulse">
              Admin Access Verified
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest">
              Access Denied
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white mb-4">
              <LayoutDashboard className="w-4 h-4 text-green-400" />
              <span className="text-xs font-black uppercase tracking-widest">Developer Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manajemen Transaksi</h1>
            <p className="text-slate-500 font-medium">Pantau dan konfirmasi pesanan Robux dari seluruh pengguna.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={createTestOrder}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <AlertCircle className="w-4 h-4" />
              Buat Pesanan Tes
            </button>
            <button 
              onClick={fetchAllPurchases}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Pesanan</div>
            <div className="text-3xl font-black text-slate-900">{purchases.length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-2">Pending</div>
            <div className="text-3xl font-black text-slate-900">{purchases.filter(p => p.status === 'pending').length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-blue-500 text-xs font-black uppercase tracking-widest mb-2">Processing</div>
            <div className="text-3xl font-black text-slate-900">{purchases.filter(p => p.status === 'processing').length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-green-500 text-xs font-black uppercase tracking-widest mb-2">Completed</div>
            <div className="text-3xl font-black text-slate-900">{purchases.filter(p => p.status === 'completed').length}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari Username atau Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Detail Pesanan</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Roblox User</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Data...</div>
                    </td>
                  </tr>
                ) : filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada transaksi ditemukan.</div>
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-black text-sm uppercase tracking-tight">#{p.id.slice(0, 8)}</span>
                          <span className="text-slate-400 text-xs font-medium">
                            {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="text-slate-900 font-bold">{p.roblox_username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-slate-900 font-black">
                            <RobuxIcon className="w-3.5 h-3.5" />
                            {p.robux_amount.toLocaleString()}
                          </div>
                          <span className="text-green-600 text-xs font-bold">{formatRupiah(p.price)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusConfig[p.status].color}`}>
                          {statusConfig[p.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedPurchase(p)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                            title="Lihat Detail Lengkap"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {p.status === 'pending' && (
                            <button 
                              onClick={() => updateStatus(p.id, 'completed')}
                              disabled={updatingId === p.id}
                              className="px-4 py-2 rounded-xl bg-green-500 text-white font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                            >
                              {updatingId === p.id ? 'Loading...' : 'Konfirmasi Paid'}
                            </button>
                          )}
                          {(p.status === 'pending' || p.status === 'processing') && (
                            <button 
                              onClick={() => updateStatus(p.id, 'failed')}
                              disabled={updatingId === p.id}
                              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal for Admin */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Detail Transaksi</h3>
                <p className="text-slate-400 font-medium text-sm italic">Informasi lengkap pesanan user.</p>
              </div>
              <button onClick={() => setSelectedPurchase(null)} className="p-3 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mb-8">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-md">
                  <RobuxIcon className="w-12 h-12" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-slate-900 font-black text-3xl">{selectedPurchase.robux_amount.toLocaleString()} R$</div>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${statusConfig[selectedPurchase.status].color}`}>
                      {statusConfig[selectedPurchase.status].label}
                    </span>
                  </div>
                  <div className="text-green-600 font-black text-xl">{formatRupiah(selectedPurchase.price)}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
                    <Tag className="w-4 h-4" />
                    ID Pesanan
                  </div>
                  <div className="text-slate-900 font-black">#{selectedPurchase.id.toUpperCase()}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
                    <User className="w-4 h-4" />
                    Username Roblox
                  </div>
                  <div className="text-slate-900 font-black text-lg">{selectedPurchase.roblox_username}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
                    <CreditCard className="w-4 h-4" />
                    Metode Pembayaran
                  </div>
                  <div className="text-slate-900 font-black uppercase">{selectedPurchase.payment_method}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    Tanggal & Jam
                  </div>
                  <div className="text-slate-900 font-black text-right">
                    {new Date(selectedPurchase.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    <br />
                    <span className="text-slate-400 text-sm font-bold tracking-tight">
                      {new Date(selectedPurchase.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })} WIB
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    User ID (DB)
                  </div>
                  <div className="text-slate-400 text-[10px] font-mono">{selectedPurchase.user_id}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {selectedPurchase.status === 'pending' && (
                 <button
                   onClick={() => {
                     updateStatus(selectedPurchase.id, 'completed');
                     setSelectedPurchase(null);
                   }}
                   className="py-5 rounded-2xl bg-green-500 text-white font-black shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all text-lg"
                 >
                   Konfirmasi Paid
                 </button>
               )}
               <button
                 onClick={() => setSelectedPurchase(null)}
                 className={`py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 transition-all text-lg ${selectedPurchase.status !== 'pending' ? 'col-span-2' : ''}`}
               >
                 Tutup Detail
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
