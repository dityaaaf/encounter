import { ChevronRight, Sparkles } from 'lucide-react';
import RobuxIcon from '../components/RobuxIcon';
import logoEct from '../images/ect.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const highlights = [
    {
      icon: <img src={logoEct} alt="Ect" className="w-full h-full object-contain" />,
      title: 'Proses Kilat',
      desc: 'Robux terkirim dalam hitungan menit setelah pembayaran berhasil dikonfirmasi.',
    },
    {
      icon: <img src={logoEct} alt="Ect" className="w-full h-full object-contain" />,
      title: 'Keamanan Utama',
      desc: 'Sistem keamanan tingkat tinggi. Ribuan transaksi telah berhasil diproses dengan aman.',
    },
    {
      icon: <img src={logoEct} alt="Ect" className="w-full h-full object-contain" />,
      title: 'Bantuan 24/7',
      desc: 'Tim Customer Service kami selalu siap membantu Anda kapanpun dibutuhkan.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 border border-green-100 mb-8 animate-fadeIn shadow-sm">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-bold tracking-wide uppercase">Top Rated Robux Store #1</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-tight animate-fadeIn tracking-tight">
            Encounter
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">
              Robux Store
            </span>
          </h1>

          <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fadeIn font-medium leading-relaxed">
            Encounter Menyediakan Berbagai Jenis Robux Dengan Harga Yang Telah Tersedia, Limited Items Sooner!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Mulai Belanja
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3 px-6 py-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="relative">
                <RobuxIcon className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-slate-900 font-bold text-sm leading-none">30,000+</div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Ready Stock</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="group p-10 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-green-500/20 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '30K+', label: 'Robux Ready' },
              { value: '5K+', label: 'Pelanggan Puas' },
              { value: '< 5 min', label: 'Waktu Kirim' },
              { value: '24/7', label: 'Layanan Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl sm:text-4xl font-black text-green-600 mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
