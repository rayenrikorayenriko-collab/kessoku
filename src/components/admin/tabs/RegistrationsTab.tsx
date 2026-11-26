"use client";

import { useCallback, useEffect, useState } from "react";
import { PanelHeader } from "@/components/admin/Panel";
import { Icon } from "@/components/ui/Icon";
import { copyText } from "@/lib/clipboard";
import { deleteRegistration, listRegistrations } from "@/lib/store";
import type { RegistrationRecord } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function RegistrationsTab() {
  const [rows, setRows] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await listRegistrations());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (id: string) => {
    try {
      await deleteRegistration(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  };

  const filtered = rows.filter((row) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [row.name, row.tiktok, row.gen, row.skill, row.gender]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const exportCsv = () => {
    const header = ["Nama", "Gender", "Nama TT", "Gen", "Paling Jago", "Tanggal"];
    const lines = filtered.map((row) =>
      [row.name, row.gender, row.tiktok, row.gen, row.skill, row.created_at]
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kessoku-registrations-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Data Pendaftar"
        description="Hanya admin terautentikasi yang dapat membaca data registrasi anggota."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => void load()}>
              <Icon name="flip" size={15} />
              Muat ulang
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={exportCsv}>
              <Icon name="download" size={15} />
              CSV
            </button>
          </div>
        }
      />

      <div className="relative">
        <Icon
          name="search"
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          className="field !pl-11"
          placeholder="Cari nama, TikTok, gen, atau keahlian…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error ? (
        <p className="rounded-2xl bg-accent-tint px-4 py-3 text-[13px] text-accent">{error}</p>
      ) : null}

      {loading ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-[13px] text-ink-faint">
          Memuat data…
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-[13px] text-ink-faint">
          Belum ada pendaftar.
        </p>
      ) : (
        <div className="stack gap-3">
          {filtered.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-line bg-white/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-[15.5px] font-semibold text-ink">
                    {row.name}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-ink-muted">
                    {row.tiktok} · {row.gender}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="icon-btn !h-9 !w-9"
                    aria-label="Salin data"
                    onClick={async () => {
                      const text = `Nama: ${row.name}\nGender: ${row.gender}\nNama TT: ${row.tiktok}\nGen: ${row.gen}\nPaling Jago: ${row.skill}`;
                      if (await copyText(text)) {
                        setCopied(row.id);
                        window.setTimeout(() => setCopied(""), 1600);
                      }
                    }}
                  >
                    <Icon name={copied === row.id ? "check" : "copy"} size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn !h-9 !w-9 !text-accent"
                    aria-label="Hapus data"
                    onClick={() => void remove(row.id)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip">{row.gen}</span>
                <span className="chip">{row.skill}</span>
                <span className="chip !text-ink-faint">{formatDateTime(row.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="text-[12px] text-ink-faint">
        Total ditampilkan: {filtered.length} dari {rows.length} pendaftar.
      </p>
    </div>
  );
}
