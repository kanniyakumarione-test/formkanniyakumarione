import { useState } from "react";

export default function AdminLoginModal({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(password);
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 bg-[#030303]">
      
      {/* 🌌 Background ambient gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>

      {/* MODAL WRAPPER */}
      <div
        className={`
          w-full max-w-md
          bg-white/[0.01] border border-white/[0.08]
          rounded-[28px] p-10
          text-white shadow-2xl
          relative z-10
          backdrop-blur-xl
          overflow-hidden
          ${shake ? "admin-shake" : ""}
        `}
        style={{
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: "fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both"
        }}
      >
        {/* Decorative inner gradient background blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          
          {/* Logo / Icon */}
          <div className="text-center mb-8">
            <div className="
              w-16 h-16 mx-auto mb-4
              bg-gradient-to-tr from-blue-600 to-indigo-600
              rounded-2xl
              flex items-center justify-center
              shadow-[0_8px_30px_rgb(79,70,229,0.3)]
              border border-indigo-400/20
            ">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold font-outfit text-white tracking-tight">
              Admin Access
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Enter your credentials to manage service requests.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 block uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={showPassword ? "admin123" : "••••••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="input-ultra font-mono tracking-widest text-lg w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-2.29c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
          
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .admin-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
