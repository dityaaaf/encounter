import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import logoEct from '../images/ect.png';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Masukkan email dan password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        let message = authError;
        if (authError === 'Email not confirmed') {
          message = 'Akun belum aktif! Silakan cek Gmail Anda untuk klik link aktivasi.';
        }
        setError(message);
      } else {
        onNavigate('home');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError('Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-6 drop-shadow-xl">
            <img src={logoEct} alt="Encounter Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Selamat Datang</h2>
          <p className="text-slate-500 font-medium">Masuk ke akun Encounter kamu.</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm mb-6 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-lg"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Memproses...' : 'Masuk ke Akun'}
            </button>

            <div className="text-center mt-8">
              <p className="text-slate-500 font-medium">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-green-600 font-black hover:text-green-700 transition-colors"
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

