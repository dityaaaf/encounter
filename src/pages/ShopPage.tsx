import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import RobuxIcon from '../components/RobuxIcon';
import { ShoppingCart, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ShopPageProps {
  onNavigate: (page: string) => void;
}

const REGULAR_PACKS = [
  { robux: 100, price: 15000 },
  { robux: 200, price: 30000 },
  { robux: 300, price: 47000 },
  { robux: 400, price: 65000 },
  { robux: 500, price: 78000 },
  { robux: 600, price: 95000 },
  { robux: 700, price: 105000 },
  { robux: 800, price: 125000 },
  { robux: 900, price: 140000 },
  { robux: 1000, price: 155000 },
];

const BULK_PACKS = [
  { robux: 2000, price: 335000 },
  { robux: 3000, price: 465000 },
  { robux: 4000, price: 625000 },
  { robux: 5000, price: 780000 },
  { robux: 6000, price: 935000 },
  { robux: 7000, price: 1090000 },
  { robux: 8000, price: 1245000 },
  { robux: 9000, price: 1400000 },
  { robux: 10000, price: 1555000 },
];

const ALL_PACKS = [...REGULAR_PACKS, ...BULK_PACKS];

function calculatePrice(robux: number) {
  if (robux <= 0) return 0;
  
  // Find exact match first
  const exactMatch = ALL_PACKS.find(p => p.robux === robux);
  if (exactMatch) return exactMatch.price;

  // If below 100, simple 150/r
  if (robux < 100) return Math.round(robux * 150);
  
  // Find the two surrounding points for interpolation
  let lower = ALL_PACKS[0];
  let upper = ALL_PACKS[ALL_PACKS.length - 1];
  
  let found = false;
  for (let i = 0; i < ALL_PACKS.length - 1; i++) {
    if (robux > ALL_PACKS[i].robux && robux < ALL_PACKS[i+1].robux) {
      lower = ALL_PACKS[i];
      upper = ALL_PACKS[i+1];
      found = true;
      break;
    }
  }

  if (!found && robux > 10000) {
    return Math.round(robux * 155.5);
  }

  // Linear interpolation: price = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
  const price = lower.price + (robux - lower.robux) * (upper.price - lower.price) / (upper.robux - lower.robux);
  return Math.round(price);
}

function formatRupiah(n: number) {
  return 'Rp' + n.toLocaleString('id-ID');
}

export default function ShopPage({ onNavigate }: ShopPageProps) {
  const { user } = useAuth();
  const [selectedPack, setSelectedPack] = useState<{ robux: number; price: number } | null>(null);
  const [robloxUsername, setRobloxUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [customRobux, setCustomRobux] = useState<string>('');

  const handleBuy = (pack: { robux: number; price: number }) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setSelectedPack(pack);
  };

  const handleCustomBuy = () => {
    const amount = parseInt(customRobux);
    if (!amount || amount <= 0) {
      setNotification({ type: 'error', message: 'Masukkan jumlah Robux yang valid.' });
      return;
    }
    if (amount > 10000) {
      setNotification({ type: 'error', message: 'Pembelian di atas 10.000 Robux silakan hubungi admin.' });
      return;
    }
    handleBuy({ robux: amount, price: calculatePrice(amount) });
  };

  const handleSubmit = async () => {
    if (!user || !selectedPack) return;
    if (!robloxUsername.trim()) {
      setNotification({ type: 'error', message: 'Masukkan username Roblox kamu.' });
      return;
    }
    if (robloxUsername.trim().length < 3) {
      setNotification({ type: 'error', message: 'Username Roblox minimal 3 karakter.' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('purchases').insert({
        user_id: user.id,
        robux_amount: selectedPack.robux,
        price: selectedPack.price,
        roblox_username: robloxUsername.trim(),
        payment_method: paymentMethod,
      });

      if (error) throw error;

      setNotification({ type: 'success', message: `Pesanan ${selectedPack.robux} Robux berhasil dibuat! Cek riwayat pembelian.` });
      setSelectedPack(null);
      setRobloxUsername('');
      setCustomRobux('');
    } catch {
      setNotification({ type: 'error', message: 'Gagal membuat pesanan. Coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-4">
            <RobuxIcon className="w-4 h-4" />
            <span className="text-green-600 text-sm font-bold">Official Encounter Shop</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Beli Robux</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-lg">Pilih paket Robux atau masukkan jumlah yang kamu inginkan, proses via Gamepass. 
            <p>(After Tax)
              </p>
            </p>
        </div>

        {/* Custom Robux Section */}
        <div className="mb-16 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Berapa Robux yang kamu butuh?</h3>
              <p className="text-slate-500">Atur jumlah Robux sesuai budget kamu (Maksimal 10.000 R$)</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="number"
                  value={customRobux}
                  onChange={(e) => setCustomRobux(e.target.value)}
                  placeholder="Contoh: 5000"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-lg"
                />
                <RobuxIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6" />
              </div>
              <button
                onClick={handleCustomBuy}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-lg"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
          {customRobux && parseInt(customRobux) > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 animate-fadeIn">
              <div className="text-green-600 font-bold text-lg">
                Total Harga: {formatRupiah(calculatePrice(parseInt(customRobux)))}
              </div>
              {parseInt(customRobux) > 10000 && (
                <div className="text-orange-500 font-bold text-sm bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                  Untuk pembelian &gt; 10.000 Robux silakan hubungi admin.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Regular Packs */}
        <h3 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <RobuxIcon className="w-5 h-5" />
          </div>
          Popular Packs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-16">
          {REGULAR_PACKS.map((pack) => (
            <button
              key={pack.robux}
              onClick={() => handleBuy(pack)}
              className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <RobuxIcon className="w-7 h-7" />
              </div>
              <div className="text-slate-900 font-bold text-xl mb-1">{pack.robux} R$</div>
              <div className="text-green-600 font-bold text-sm mb-4">{formatRupiah(pack.price)}</div>
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold group-hover:bg-green-600 group-hover:text-white transition-all uppercase tracking-wider">
                <ShoppingCart className="w-3.5 h-3.5" />
                Tambah
              </div>
            </button>
          ))}
        </div>

        {/* Bulk Packs */}
        <h3 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <RobuxIcon className="w-5 h-5" />
          </div>
          Bulk Packs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-16">
          {BULK_PACKS.map((pack) => (
            <button
              key={pack.robux}
              onClick={() => handleBuy(pack)}
              className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <RobuxIcon className="w-7 h-7" />
              </div>
              <div className="text-slate-900 font-bold text-xl mb-1">{pack.robux.toLocaleString()} R$</div>
              <div className="text-green-600 font-bold text-sm mb-4">{formatRupiah(pack.price)}</div>
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold group-hover:bg-green-600 group-hover:text-white transition-all uppercase tracking-wider">
                <ShoppingCart className="w-3.5 h-3.5" />
                Borong
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Konfirmasi</h3>
              <button onClick={() => setSelectedPack(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <RobuxIcon className="w-10 h-10" />
              </div>
              <div>
                <div className="text-slate-900 font-black text-2xl">{selectedPack.robux.toLocaleString()} Robux</div>
                <div className="text-green-600 font-bold text-lg">{formatRupiah(selectedPack.price)}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-500 text-sm font-bold mb-2 uppercase tracking-wide">Username Roblox</label>
                <input
                  type="text"
                  value={robloxUsername}
                  onChange={(e) => setRobloxUsername(e.target.value)}
                  placeholder="Masukkan username Roblox"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-sm font-bold mb-3 uppercase tracking-wide">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'transfer', label: 'Bank Transfer' },
                    { id: 'ewallet', label: 'E-Wallet' },
                    { id: 'qris', label: 'QRIS Scan' },
                    { id: 'pulsa', label: 'Pulsa' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                        paymentMethod === method.id
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-md shadow-green-500/10'
                          : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] text-lg"
              >
                {submitting ? 'Memproses...' : 'Selesaikan Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-slideIn">
          <div
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl border shadow-2xl ${
              notification.type === 'success'
                ? 'bg-white border-green-200 text-green-600'
                : 'bg-white border-red-200 text-red-500'
            }`}
          >
            {notification.type === 'success' ? (
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
              </div>
            )}
            <div className="pr-8">
              <div className="font-black text-slate-900">Notifikasi</div>
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="absolute top-4 right-4 opacity-40 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
