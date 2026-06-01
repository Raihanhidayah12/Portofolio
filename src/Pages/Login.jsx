import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { supabase } from "../supabase";
import { SITE } from "../config/site";
import {
  inputClass,
  PAGE_BG,
  GlowCard,
  PrimaryButton,
  PageGridBg,
} from "../components/ui/layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "admin") {
      alert("Access denied");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${PAGE_BG}`}>
      <PageGridBg className="opacity-40" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link
          to="/"
          className="absolute left-[5%] top-6 inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-sky-400 lg:left-[10%]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke situs
        </Link>

        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-500/90">
              {SITE.brandName} — Admin
            </p>
            <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center border border-sky-500/30 bg-sky-500/10 text-sky-400">
              <Shield className="h-6 w-6" />
            </div>
          </div>

          <GlowCard fill={false} className="p-8 sm:p-10">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                Sign in
              </h1>
              <p className="text-sm text-zinc-500">Kelola portofolio Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="text-xs uppercase tracking-wider text-zinc-500"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="admin@portofolio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={`${inputClass} w-full py-3 pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="text-xs uppercase tracking-wider text-zinc-500"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={`${inputClass} w-full py-3 pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-300"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <PrimaryButton
                type="submit"
                disabled={loading}
                wrapperClassName="w-full pt-1"
                className="w-full !py-3"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                ) : (
                  <>
                    Sign In
                    <LogIn className="h-4 w-4" />
                  </>
                )}
              </PrimaryButton>
            </form>
          </GlowCard>

          <p className="mt-6 text-center font-mono text-[10px] text-zinc-600">
            Hanya untuk administrator terdaftar
          </p>
        </div>
      </div>
    </div>
  );
}
