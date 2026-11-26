"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { getSessionEmail, signIn } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kessoku.family");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSessionEmail().then((session) => {
      if (session) router.replace("/admin/dashboard");
    });
  }, [router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
              <Icon name="lock" size={20} />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-ink">
                Dashboard Admin
              </h1>
              <p className="text-[12.5px] text-ink-muted">
                Kessoku Family — Area terbatas
              </p>
            </div>
          </div>

          {!isSupabaseConfigured ? (
            <p className="mt-6 flex items-start gap-2 rounded-2xl bg-surface-subtle px-4 py-3 text-[12.5px] text-ink-muted">
              <Icon name="info" size={16} />
              Supabase belum dikonfigurasi. Pratinjau lokal aktif — gunakan
              password awal admin untuk masuk.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="stack mt-6 gap-4" noValidate>
            <label className="block">
              <span className="field-label">Email admin</span>
              <input
                type="email"
                className="field"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="block">
              <span className="field-label">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  className="field !pr-12"
                  value={password}
                  placeholder="••••••••"
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-muted hover:text-ink"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
                </button>
              </span>
            </label>

            {error ? (
              <p className="rounded-2xl bg-accent-tint px-4 py-3 text-[13px] text-accent">
                {error}
              </p>
            ) : null}

            <button type="submit" className="btn btn-accent" disabled={busy}>
              {busy ? (
                <>
                  <Icon name="flip" size={17} className="animate-spin-slow" />
                  Memproses…
                </>
              ) : (
                <>
                  Masuk
                  <Icon name="arrow-right" size={17} />
                </>
              )}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            <Icon name="chevron-left" size={16} />
            Kembali ke portofolio
          </a>
        </div>
      </div>
    </main>
  );
}
