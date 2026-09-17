import { useState } from "react";
import API from "../../../axiosSetup/API";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const google_client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const google_callback_url = import.meta.env.VITE_GOOGLE_CALLBACK_URL || 'http://localhost:5173/auth/google/callback';
  const handleGoogleLogin = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: google_callback_url,
      client_id: `${google_client_id}`,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    };
    const queryString = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${queryString}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data?.success) {
        
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Always navigate to landing page after login
        navigate("/");
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-xl">
        {/* Logo and Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#a8ff3e] rounded-md flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-black rounded-sm" />
            </div>
            <span className="text-white text-lg font-bold">
              contrib<span className="text-[#a8ff3e]">.ai</span>
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-[#8a8f98] hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-white text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-[#8a8f98] text-sm mb-8">
          Login to access your repositories and conversations.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label className="block text-[#c5c9d0] text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white outline-none focus:border-[#a8ff3e] mb-4"
          />

          {/* Password */}
          <label className="block text-[#c5c9d0] text-sm mb-2">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-3 pr-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white outline-none focus:border-[#a8ff3e]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8ff3e] text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}

          {/* Normal Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-[#a8ff3e] text-black font-semibold hover:bg-[#bfff6e] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* --- OR Divider --- */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[#2a2a2a]"></div>
          <span className="px-3 text-[#8a8f98] text-xs uppercase">Or</span>
          <div className="flex-1 border-t border-[#2a2a2a]"></div>
        </div>

        {/* Google OAuth Button Integration */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg border border-[#2a2a2a] bg-[#161616] text-white font-medium hover:bg-[#1e1e1e] hover:border-[#a8ff3e] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.2)] hover:scale-105 flex items-center justify-center gap-2"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.416 1.421 15.52 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.77 0-.795-.085-1.4-.195-1.945H12.24z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[#8a8f98] text-sm mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#a8ff3e] hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}