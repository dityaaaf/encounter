import { Instagram, MessageCircle, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../images/ect.png';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { user } = useAuth();
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-green-500/10">
                <img src={logo} alt="Encounter Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                Encounter
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Toko Robux terpercaya dengan proses cepat dan aman. Beli Robux dengan harga terbaik di Indonesia bersama Encounter.
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <div className="space-y-4">
              <div className="flex gap-8">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onNavigate?.('home');
                  }}
                  className="text-slate-500 text-sm hover:text-[#2ecc71] transition-colors font-semibold"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onNavigate?.('vouch');
                  }}
                  className="text-slate-500 text-sm hover:text-[#2ecc71] transition-colors font-semibold"
                >
                  Vouch
                </button>
              </div>
              <div className="flex gap-8">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onNavigate?.('shop');
                  }}
                  className="text-slate-500 text-sm hover:text-[#2ecc71] transition-colors font-semibold"
                >
                  Shop
                </button>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onNavigate?.('social');
                  }}
                  className="text-slate-500 text-sm hover:text-[#2ecc71] transition-colors font-semibold"
                >
                  Social
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/enkountera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#e1306c] hover:border-[#e1306c]/30 hover:bg-[#e1306c]/5 transition-all shadow-sm"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://discord.gg/encounter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#5865f2] hover:border-[#5865f2]/30 hover:bg-[#5865f2]/5 transition-all shadow-sm"
                >
                  <Gamepad2 className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/6281225133501"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#25d366] hover:border-[#25d366]/30 hover:bg-[#25d366]/5 transition-all shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-slate-400 font-medium">Tersedia 24/7 untuk bantuan Anda.</p>
            </div>
          </div>
        </div>

          {/* Developer Quick Access */}
          {user?.email === 'adit@nusabs.sch.id' && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <button 
                onClick={() => onNavigate?.('admin')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-green-400 font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Akses Cepat Developer Dashboard
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2026 Encounter. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigate?.('privacy');
              }}
              className="hover:text-slate-900 transition-colors font-bold"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigate?.('terms');
              }}
              className="hover:text-slate-900 transition-colors font-bold"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
