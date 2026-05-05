import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Star, Trash2, Send, MessageSquare, Filter } from 'lucide-react';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  profiles: { username: string } | null;
}

type SortMode = 'newest' | 'highest';

export default function VouchPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    const query = supabase
      .from('reviews')
      .select('id, user_id, rating, content, created_at, profiles(username)')
      .order(sortMode === 'newest' ? 'created_at' : 'rating', { ascending: false });

    const { data, error } = await query;
    if (!error && data) {
      setReviews(data as unknown as Review[]);
    }
    setLoading(false);
  }, [sortMode]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!newContent.trim()) {
      setError('Tulis review kamu terlebih dahulu.');
      return;
    }
    if (newContent.trim().length > 500) {
      setError('Review maksimal 500 karakter.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Ensure profile exists (Auto-fix for users with missing profile)
      const { data: profile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          username: username
        });
        if (profileError) {
          setError(`Gagal sinkronisasi profil: ${profileError.message}`);
          return;
        }
      }

      const { error: insertError } = await supabase.from('reviews').insert({
        user_id: user.id,
        rating: newRating,
        content: newContent.trim(),
      });

      if (insertError) {
        if (insertError.message.includes('one review per day')) {
          setError('Kamu hanya bisa memberi 1 review per hari.');
        } else {
          setError(`Gagal mengirim review: ${insertError.message}`);
        }
        return;
      }

      setNewContent('');
      setNewRating(5);
      await fetchReviews();
    } catch (err: any) {
      setError(`Kesalahan sistem: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Encounter Vouch</h2>
          <p className="text-slate-500 text-lg font-medium">Taruh Review Jujur Kalian Disini Guys</p>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-16 p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-center">
            <div className="text-5xl font-black text-slate-900 mb-3 leading-none">{avgRating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rating Rata-Rata</div>
          </div>
          <div className="hidden sm:block w-px h-20 bg-slate-100" />
          <div className="text-center">
            <div className="text-5xl font-black text-slate-900 mb-3 leading-none">{reviews.length}</div>
            <div className="text-green-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Total Review
            </div>
          </div>
        </div>

        {/* Write Review */}
        {user && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 mb-12 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              Tulis Pengalaman Kamu
            </h3>
            <div className="flex items-center gap-2 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setNewRating(s)}
                  className="transition-all hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${s <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                  />
                </button>
              ))}
              <span className="ml-4 text-slate-900 font-black text-lg">{newRating}/5</span>
            </div>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Ceritakan pengalaman belanja kamu di Encounter..."
              rows={4}
              maxLength={500}
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all resize-none mb-4"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{newContent.length}/500 Karakter</span>
                {error && <span className="text-red-500 text-xs font-bold">{error}</span>}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Mengirim...' : 'Kirim Review'}
              </button>
            </div>
          </div>
        )}

        {/* Filter & List */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Urutkan</span>
            <div className="flex gap-2">
              {(['newest', 'highest'] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                    sortMode === mode
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'text-slate-400 hover:text-slate-600 bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {mode === 'newest' ? 'Terbaru' : 'Rating Tertinggi'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Review...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada review.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-green-500/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-black text-xl shadow-sm overflow-hidden">
                      {(() => {
                        const avatar = localStorage.getItem(`avatar_${review.user_id}`);
                        if (avatar) {
                          return <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />;
                        }
                        return (review.profiles?.username || 'U')[0].toUpperCase();
                      })()}
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-lg leading-tight">
                        {review.profiles?.username || 'Unknown User'}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {user && user.id === review.user_id && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2.5 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 text-base leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
