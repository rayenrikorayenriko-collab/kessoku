"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { Icon } from "@/components/ui/Icon";
import { useActiveSection, useBodyLock } from "@/lib/hooks";

export function TopNav({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { config } = useConfig();
  const { navItems: allNav, showNav } = config.identity;
  const navItems = allNav.filter((item) => item.active);
  const ids = navItems.map((item) => item.href.replace("#", ""));
  const active = useActiveSection(ids, [ids.join("|")]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useBodyLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!showNav) {
    return (
      <div className="fixed inset-x-0 top-0 z-50 pt-3">
        <div className="wrap flex justify-end">
          <button
            type="button"
            className="icon-btn glass"
            aria-label="Pengaturan tampilan"
            onClick={onOpenSettings}
          >
            <Icon name="settings" size={19} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="wrap pt-3">
          <nav
            className={`glass flex items-center gap-2 rounded-full px-2 py-2 transition-shadow duration-300 ${
              scrolled ? "shadow-lift" : ""
            }`}
          >
            {/* Desktop: inline links */}
            <ul className="mx-auto hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = active === item.href.replace("#", "");
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      className={`rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                        isActive
                          ? "bg-ink text-white"
                          : "text-ink-soft hover:bg-white/70"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Mobile: menu button */}
            <button
              type="button"
              className="icon-btn md:hidden"
              aria-label="Buka menu navigasi"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" size={19} />
            </button>

            <div className="ml-auto flex items-center gap-2 md:ml-2">
              <button
                type="button"
                className="icon-btn"
                aria-label="Pengaturan tampilan"
                onClick={onOpenSettings}
              >
                <Icon name="settings" size={19} />
              </button>
              <button
                type="button"
                className="btn btn-accent btn-sm"
                onClick={() => go("#registrasi")}
              >
                <Icon name="arrow-right" size={16} />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="modal-backdrop md:hidden"
          onClick={() => setMenuOpen(false)}
          style={{ alignItems: "flex-start", paddingTop: 76 }}
        >
          <div
            className="glass-strong mx-4 w-full max-w-md animate-scale-in rounded-3xl p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                Navigasi
              </span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Tutup menu"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <ul className="stack gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium text-ink-soft transition-colors hover:bg-surface-muted"
                  >
                    {item.label}
                    <Icon name="arrow-up-right" size={18} className="text-ink-faint" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
