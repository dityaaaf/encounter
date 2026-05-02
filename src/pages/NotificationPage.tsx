import { Bell, Shield, Smartphone, Mail } from 'lucide-react';

export default function NotificationPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 border border-green-100 mb-6">
            <Bell className="w-5 h-5 text-green-600" />
            <span className="text-green-700 text-sm font-bold tracking-wide uppercase">Notifications</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Pengaturan Notifikasi</h1>
          <p className="text-slate-500">Atur bagaimana kami memberikan informasi kepada Anda.</p>
        </div>

        <div className="space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Email Marketing</h3>
                <p className="text-sm text-slate-500">Dapatkan info promo dan update terbaru via email.</p>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Status Pesanan</h3>
                <p className="text-sm text-slate-500">Notifikasi push saat pesanan Anda diproses atau selesai.</p>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Keamanan Akun</h3>
                <p className="text-sm text-slate-500">Info saat ada aktivitas mencurigakan di akun Anda.</p>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked disabled />
              <div className="w-11 h-6 bg-slate-300 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-green-500 after:translate-x-full after:border-white"></div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 text-center mt-8 italic">
            * Notifikasi keamanan akun tidak dapat dinonaktifkan untuk melindungi akun Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
