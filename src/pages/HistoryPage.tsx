import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import RobuxIcon from '../components/RobuxIcon';
import { History, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Purchase {
  id: string;
  robux_amount: number;
  price: number;
  roblox_username: string;
  payment_method: string;
  status: string;
  created_at: string;
}

function formatRupiah(n: number) {
  return 'Rp' + n.toLocaleString('id-ID');
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-50 border-yellow-100', label: 'Pending' },
  processing: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Processing' },
  completed: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50 border-green-100', label: 'Completed' },
  failed: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50 border-red-100', label: 'Failed' },
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPurchases(data as Purchase[]);
      }
      setLoading(false);
    };

    fetchPurchases();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 max-w-sm mx-auto">
          <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Silakan masuk untuk melihat riwayat pembelian.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 border border-green-100 mb-6">
            <History className="w-5 h-5 text-green-600" />
            <span className="text-green-700 text-sm font-bold tracking-wide uppercase">Transaction History</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Riwayat Belanja</h2>
          <p className="text-slate-500 text-lg font-medium">Pantau semua transaksi Robux kamu di sini.</p>
        </div>

        {loading ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Transaksi...</div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-900 font-black text-xl mb-2">Belum ada riwayat.</p>
            <p className="text-slate-500 font-medium mb-8">Beli Robux pertama kamu sekarang!</p>
            <button className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">
              Pergi ke Shop
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => {
              const status = statusConfig[purchase.status] || statusConfig.pending;
              return (
                <div
                  key={purchase.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-green-500/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <RobuxIcon className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 font-black text-xl leading-none mb-1">
                          {purchase.robux_amount.toLocaleString()} Robux
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                          User: <span className="text-slate-900">{purchase.roblox_username}</span>
                        </div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                          {new Date(purchase.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-green-600 font-black text-2xl leading-none">{formatRupiah(purchase.price)}</div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
