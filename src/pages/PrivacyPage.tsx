import { Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 text-sm font-bold tracking-wide uppercase">Privacy Policy</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Kebijakan Privasi</h1>
          <p className="text-slate-500">Bagaimana kami menjaga dan melindungi data Anda di Encounter.</p>
        </div>

        <div className="space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              Informasi yang Kami Kumpulkan
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Kami mengumpulkan informasi minimal yang diperlukan untuk memproses pesanan Anda, termasuk email (untuk akun) dan username Roblox (untuk pengiriman produk). Kami tidak pernah meminta password akun Roblox Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
              Penggunaan Data
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Data Anda hanya digunakan untuk tujuan transaksi, verifikasi pembayaran, dan pemberian dukungan layanan pelanggan. Kami tidak menjual atau membagikan data Anda kepada pihak ketiga untuk tujuan pemasaran.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Keamanan Transaksi</h2>
            <p className="text-slate-600 leading-relaxed">
              Semua transaksi di Encounter diproses melalui sistem yang aman. Kami menggunakan enkripsi standar industri untuk memastikan informasi pembayaran Anda tetap terlindungi selama proses berlangsung.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100 mt-12 text-center">
            <p className="text-slate-400 text-sm italic">Terakhir diperbarui: 27 April 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
