"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfig } from "@/components/providers/ConfigProvider";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { getSessionEmail, signOut, updatePassword } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { IconName } from "@/lib/types";
import {
  AnimationTab,
  BackgroundTab,
  IdentityTab,
  MediaTab,
  TextsTab
} from "@/components/admin/tabs/ContentTabs";
import {
  CertificationsTab,
  CnTab,
  HashtagsTab,
  InternshipsTab,
  JoinTab,
  RegistrationTab
} from "@/components/admin/tabs/CollectionTabs";
import { RegistrationsTab } from "@/components/admin/tabs/RegistrationsTab";

type TabDef = {
  id: string;
  label: string;
  group: string;
  icon: IconName;
  Component: () => JSX.Element;
};

const TABS: TabDef[] = [
  { id: "identity", label: "Identitas & Navigasi", group: "Konten", icon: "settings", Component: IdentityTab },
  { id: "texts", label: "Teks & Tombol", group: "Konten", icon: "pencil", Component: TextsTab },
  { id: "background", label: "Background", group: "Tampilan", icon: "sun", Component: BackgroundTab },
  { id: "media", label: "Foto & Kalung", group: "Tampilan", icon: "image", Component: MediaTab },
  { id: "animation", label: "Animasi", group: "Tampilan", icon: "flip", Component: AnimationTab },
  { id: "internships", label: "Pengalaman Magang", group: "Bagian", icon: "briefcase", Component: InternshipsTab },
  { id: "certifications", label: "Sertifikasi", group: "Bagian", icon: "award", Component: CertificationsTab },
  { id: "hashtags", label: "Hashtag", group: "Bagian", icon: "hash", Component: HashtagsTab },
  { id: "registration", label: "Registrasi & Gen", group: "Alur", icon: "user", Component: RegistrationTab },
  { id: "cn", label: "Format CN", group: "Alur", icon: "hash", Component: CnTab },
  { id: "join", label: "URL Bergabung", group: "Alur", icon: "link", Component: JoinTab },
  { id: "registrations", label: "Data Pendaftar", group: "Data", icon: "layers", Component: RegistrationsTab }
];

export default function DashboardPage() {
  const router = useRouter();
  const { save, saveState, isDirty, reset, ready } = useConfig();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  useEffect(() => {
    getSessionEmail().then((session) => {
      if (!session) {
        router.replace("/admin");
        return;
      }
      setEmail(session);
      setChecking(false);
    });
  }, [router]);

  const current = useMemo(
    () => TABS.find((tab) => tab.id === activeTab) ?? TABS[0],
    [activeTab]
  );
  const ActiveComponent = current.Component;

  const groups = useMemo(() => {
    const map = new Map<string, TabDef[]>();
    TABS.forEach((tab) => {
      if (!map.has(tab.group)) map.set(tab.group, []);
      map.get(tab.group)!.push(tab);
    });
    return Array.from(map.entries());
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <span className="flex items-center gap-2 text-[13px] text-ink-muted">
          <Icon name="flip" size={17} className="animate-spin-slow" />
          Memeriksa sesi…
        </span>
      </main>
    );
  }

  const onLogout = async () => {
    await signOut();
    router.replace("/admin");
  };

  const onChangePassword = async () => {
    setPasswordErr("");
    setPasswordMsg("");
    if (newPassword.length < 6) {
      setPasswordErr("Password minimal 6 karakter.");
      return;
    }
    try {
      await updatePassword(newPassword);
      setPasswordMsg("Password berhasil diperbarui.");
      setNewPassword("");
    } catch (err) {
      setPasswordErr(err instanceof Error ? err.message : "Gagal memperbarui password.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-label="Buka menu dashboard"
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" size={19} />
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-ink text-white sm:flex">
              <Icon name="settings" size={17} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[14.5px] font-semibold text-ink">
                Dashboard Kessoku Family
              </p>
              <p className="truncate text-[11.5px] text-ink-muted">
                {email}
                {isSupabaseConfigured ? "" : " · mode pratinjau lokal"}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={`hidden text-[12px] font-medium sm:inline ${
                saveState === "error"
                  ? "text-accent"
                  : isDirty
                    ? "text-ink-muted"
                    : "text-emerald-600"
              }`}
            >
              {saveState === "saving"
                ? "Menyimpan…"
                : saveState === "saved"
                  ? "Tersimpan"
                  : isDirty
                    ? "Belum disimpan"
                    : "Tersinkron"}
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setPasswordOpen(true)}
            >
              <Icon name="lock" size={15} />
              <span className="hidden sm:inline">Ganti Password</span>
            </button>
            <a href="/" className="btn btn-outline btn-sm">
              <Icon name="external" size={15} />
              <span className="hidden sm:inline">Lihat Situs</span>
            </a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
              <Icon name="logout" size={15} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-[264px] shrink-0 lg:block">
          <div className="sticky top-24">
            <SidebarContent
              groups={groups}
              activeTab={activeTab}
              onSelect={setActiveTab}
            />
            <button
              type="button"
              className="btn btn-outline mt-4 w-full"
              onClick={() => {
                if (window.confirm("Kembalikan seluruh konten ke bawaan?")) reset();
              }}
            >
              <Icon name="flip" size={15} />
              Reset ke bawaan
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-28">
          {!isSupabaseConfigured ? (
            <p className="mb-4 flex items-start gap-2 rounded-2xl bg-accent-tint px-4 py-3 text-[12.5px] text-accent">
              <Icon name="info" size={16} />
              Supabase belum dikonfigurasi — perubahan disimpan di perangkat ini.
              Isi <code className="mx-1">.env.local</code> untuk mengaktifkan
              penyimpanan permanen.
            </p>
          ) : null}
          {!ready ? (
            <p className="text-[13px] text-ink-muted">Memuat konten…</p>
          ) : (
            <ActiveComponent />
          )}
        </main>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <p className="min-w-0 flex-1 truncate text-[12.5px] text-ink-muted">
            {saveState === "error"
              ? "Gagal menyimpan perubahan."
              : isDirty
                ? "Kamu memiliki perubahan yang belum disimpan."
                : "Semua perubahan sudah tersimpan."}
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={!isDirty}
            onClick={() => reset()}
          >
            Batalkan
          </button>
          <button
            type="button"
            className="btn btn-accent btn-sm"
            disabled={saveState === "saving"}
            onClick={() => void save()}
          >
            <Icon name="save" size={15} />
            {saveState === "saving" ? "Menyimpan…" : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative ml-0 h-full w-[290px] max-w-[86vw] animate-fade-in overflow-y-auto border-r border-line bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-[14.5px] font-semibold">Menu</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Tutup"
                onClick={() => setDrawerOpen(false)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <SidebarContent
              groups={groups}
              activeTab={activeTab}
              onSelect={(id) => {
                setActiveTab(id);
                setDrawerOpen(false);
              }}
            />
          </div>
        </div>
      ) : null}

      <Modal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setPasswordMsg("");
          setPasswordErr("");
        }}
        title="Ganti Password Admin"
        description="Gunakan password yang kuat dan unik."
        footer={
          <button type="button" className="btn btn-accent w-full" onClick={onChangePassword}>
            <Icon name="save" size={16} />
            Simpan Password
          </button>
        }
      >
        <label className="block">
          <span className="field-label">Password baru</span>
          <input
            type="password"
            className="field"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>
        {passwordErr ? (
          <p className="mt-3 rounded-2xl bg-accent-tint px-4 py-3 text-[13px] text-accent">
            {passwordErr}
          </p>
        ) : null}
        {passwordMsg ? (
          <p className="mt-3 flex items-center gap-2 rounded-2xl bg-surface-subtle px-4 py-3 text-[13px] text-ink-muted">
            <Icon name="check" size={16} />
            {passwordMsg}
          </p>
        ) : null}
      </Modal>
    </div>
  );
}

function SidebarContent({
  groups,
  activeTab,
  onSelect
}: {
  groups: [string, TabDef[]][];
  activeTab: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="stack gap-5">
      {groups.map(([group, tabs]) => (
        <div key={group}>
          <p className="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {group}
          </p>
          <div className="stack gap-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelect(tab.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? "bg-ink text-white"
                      : "text-ink-soft hover:bg-white"
                  }`}
                >
                  <Icon name={tab.icon} size={17} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
