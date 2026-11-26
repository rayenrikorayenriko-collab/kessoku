"use client";

import { useConfig } from "@/components/providers/ConfigProvider";
import { Icon } from "@/components/ui/Icon";

export function Footer({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { config } = useConfig();
  const navItems = config.identity.navItems.filter((item) => item.active);

  return (
    <footer className="pb-10 pt-8">
      <div className="wrap">
        <div className="glass rounded-3xl px-5 py-7 sm:px-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <p className="font-display text-lg font-semibold text-ink">
                {config.identity.siteName}
              </p>
              <p className="mt-2 text-[13px] text-ink-muted">
                {config.identity.tagline}
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-[13.5px] font-medium text-ink-soft transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onOpenSettings}
              >
                <Icon name="settings" size={15} />
                Pengaturan
              </button>
              <a href="/admin" className="btn btn-outline btn-sm">
                <Icon name="lock" size={15} />
                Admin
              </a>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-2 border-t border-line pt-5 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {config.identity.siteName}. Seluruh hak
              dilindungi.
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Dibuat dengan standar premium untuk keluarga besar KSF
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
