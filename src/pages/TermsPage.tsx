import { FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-100 mb-6">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700 text-sm font-bold tracking-wide uppercase">Terms of Service</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Syarat & Ketentuan</h1>
          <p className="text-slate-500">Aturan main dan ketentuan penggunaan layanan Encounter.</p>
        </div>

        <div className="space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
              </div>
              Ketentuan Umum
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Dengan menggunakan layanan Encounter, Anda setuju untuk mematuhi semua aturan yang berlaku. Kami berhak untuk mengubah atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              Tanggung Jawab Pengguna
            </h2>
            <ul className="list-disc list-inside text-slate-600 space-y-2 leading-relaxed">
              <li>Pengguna wajib memberikan username Roblox yang benar.</li>
              <li>Kesalahan penulisan username bukan tanggung jawab Encounter.</li>
              <li>Dilarang menggunakan layanan kami untuk aktivitas ilegal atau penipuan.</li>
              <li>Pembayaran yang sudah dilakukan tidak dapat dibatalkan (No Refund).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Proses Pengiriman</h2>
            <p className="text-slate-600 leading-relaxed">
              Pengiriman Robux dilakukan segera setelah pembayaran dikonfirmasi oleh sistem kami. Waktu proses normal adalah 5-30 menit, namun dalam kondisi tertentu bisa memakan waktu hingga 24 jam.
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
