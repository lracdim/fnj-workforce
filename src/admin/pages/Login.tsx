import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className={`w-full max-w-sm ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-3xl font-black text-[#0E5C3F]" style={{ fontFamily: 'serif' }}>F&J</span>
            <span className="text-sm uppercase tracking-widest text-[#0E5C3F] font-bold">WorkForce</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">Admin Portal</p>
        </div>

        <div className="bg-white border border-[#E4E0D8] rounded-2xl p-8">
          <h2 className="text-xl font-black uppercase text-[#16201C] mb-6">Sign In</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@fjworkforce.com"
                className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#0E5C3F] text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-[#073D29] transition-colors disabled:opacity-60 mt-2">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E4E0D8]">
            <p className="text-[10px] text-[#9CA3AF] text-center mb-2 uppercase tracking-wider">Demo Credentials</p>
            <div className="bg-[#F9F8F5] rounded-lg p-3 text-xs text-[#6B7280] font-mono space-y-1">
              <p>admin@fjworkforce.com</p>
              <p>FnJ2025!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}