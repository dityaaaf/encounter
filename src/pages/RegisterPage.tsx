import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (username.length < 3) {
      setError('Username minimal 3 karakter.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    setError('');
    const { error: authError } = await signUp(email, password, username);
    if (authError) {
      setError(authError);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Daftar</h2>
          <p className="text-gray-500">Buat akun RobuxStore baru.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Pilih username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#2ecc71]/50 focus:ring-1 focus:ring-[#2ecc71]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#2ecc71]/50 focus:ring-1 focus:ring-[#2ecc71]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#2ecc71]/50 focus:ring-1 focus:ring-[#2ecc71]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-white font-semibold shadow-lg shadow-[#2ecc71]/20 hover:shadow-[#2ecc71]/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="text-center text-gray-500 text-sm mt-5">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-[#2ecc71] hover:underline font-medium"
            >
              Masuk
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
