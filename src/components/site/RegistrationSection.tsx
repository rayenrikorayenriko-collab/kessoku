"use client";

import { useMemo, useRef, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { copyText } from "@/lib/clipboard";
import { submitRegistration } from "@/lib/store";
import type { SelectOption } from "@/lib/types";

const fillTemplate = (template: string, name: string) =>
  template.replace(/\{Nama\}/gi, name);

const active = (options: SelectOption[] | undefined, idPrefix: string) =>
  (options ?? [])
    .filter((option) => option.active)
    .map((option) => ({ id: `${idPrefix}-${option.id}`, label: option.label, raw: option }));

export function RegistrationSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const anim = config.animation.enabled && animations;
  const reg = config.registration;
  const cn = config.cn;
  const join = config.join;

  const sectionRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"form" | "cn">("form");
  const [form, setForm] = useState({
    name: "",
    gender: "",
    tiktok: "",
    gen: "",
    skill: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [backendNote, setBackendNote] = useState("");
  const [selectedCn, setSelectedCn] = useState("");
  const [copiedCn, setCopiedCn] = useState("");
  const [joinOpen, setJoinOpen] = useState(false);
  const [infoCopied, setInfoCopied] = useState(false);

  const genderOptions = useMemo(
    () => active(reg.genderOptions, "g"),
    [reg.genderOptions]
  );
  const genOptions = useMemo(
    () => active(reg.genOptions, "gen"),
    [reg.genOptions]
  );
  const skillOptions = useMemo(
    () => active(reg.skillOptions, "sk"),
    [reg.skillOptions]
  );

  const labelOf = (list: { id: string; label: string }[], id: string) =>
    list.find((item) => item.id === id)?.label ?? "";

  const cnCards = useMemo(
    () =>
      (cn.formats ?? [])
        .filter((format) => format.active)
        .map((format) => ({
          id: format.id,
          label: format.label,
          value: fillTemplate(format.template, form.name.trim())
        })),
    [cn.formats, form.name]
  );

  const selectedCard = cnCards.find((card) => card.id === selectedCn);

  const infoText = useMemo(
    () =>
      [
        `Nama: ${form.name.trim()}`,
        `Gender: ${labelOf(genderOptions, form.gender)}`,
        `Nama TT: ${form.tiktok.trim()}`,
        `Gen: ${labelOf(genOptions, form.gen)}`,
        `Paling Jago: ${labelOf(skillOptions, form.skill)}`
      ].join("\n"),
    [form, genderOptions, genOptions, skillOptions]
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi.";
    if (!form.gender) next.gender = "Pilih gender.";
    if (!form.tiktok.trim()) next.tiktok = "Akun TikTok wajib diisi.";
    if (!form.gen) next.gen = "Pilih Gen tujuan.";
    if (!form.skill) next.skill = "Pilih keahlian paling jago.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setBackendNote("");
    try {
      await submitRegistration({
        name: form.name.trim(),
        gender: labelOf(genderOptions, form.gender),
        tiktok: form.tiktok.trim(),
        gen: labelOf(genOptions, form.gen),
        skill: labelOf(skillOptions, form.skill),
        cn_format: "",
        cn_value: ""
      });
    } catch {
      setBackendNote(
        "Pendaftaran diproses di perangkat ini. Hubungi admin bila perlu konfirmasi."
      );
    }
    setSubmitting(false);
    setStep("cn");
    window.setTimeout(
      () => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60
    );
  };

  const handleCopyCn = async (value: string) => {
    const ok = await copyText(value);
    if (ok) {
      setCopiedCn(value);
      window.setTimeout(() => setCopiedCn(""), 2000);
    }
  };

  const handleCopyInfo = async () => {
    const ok = await copyText(infoText);
    if (ok) setInfoCopied(true);
  };

  return (
    <Section id="registrasi">
      <div ref={sectionRef} className="scroll-mt-24" />
      <SectionHeading
        eyebrow="Registrasi"
        title={reg.title}
        description={reg.description}
        align="center"
      />

      <div className={`mt-10 ${anim ? "reveal" : ""}`}>
        {step === "form" ? (
          <form
            onSubmit={onSubmit}
            className="glass mx-auto max-w-2xl rounded-3xl p-5 sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="ksf-name">
                  {reg.nameLabel}
                </label>
                <input
                  id="ksf-name"
                  className="field"
                  placeholder={reg.namePlaceholder}
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                {errors.name ? (
                  <p className="mt-2 text-[12.5px] text-accent">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <CustomSelect
                  label={reg.genderLabel}
                  placeholder="Pilih gender"
                  value={form.gender}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, gender: value }))
                  }
                  options={genderOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                />
                {errors.gender ? (
                  <p className="mt-2 text-[12.5px] text-accent">{errors.gender}</p>
                ) : null}
              </div>

              <div>
                <label className="field-label" htmlFor="ksf-tiktok">
                  {reg.tiktokLabel}
                </label>
                <input
                  id="ksf-tiktok"
                  className="field"
                  placeholder={reg.tiktokPlaceholder}
                  value={form.tiktok}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tiktok: event.target.value }))
                  }
                />
                {errors.tiktok ? (
                  <p className="mt-2 text-[12.5px] text-accent">{errors.tiktok}</p>
                ) : null}
              </div>

              <div>
                <CustomSelect
                  label={reg.genLabel}
                  placeholder="Pilih Gen tujuan"
                  value={form.gen}
                  onChange={(value) => setForm((prev) => ({ ...prev, gen: value }))}
                  options={genOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                />
                {errors.gen ? (
                  <p className="mt-2 text-[12.5px] text-accent">{errors.gen}</p>
                ) : null}
              </div>

              <div>
                <CustomSelect
                  label={reg.skillLabel}
                  placeholder="Pilih keahlian"
                  value={form.skill}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, skill: value }))
                  }
                  options={skillOptions.map((option) => ({
                    id: option.id,
                    label: option.label
                  }))}
                />
                {errors.skill ? (
                  <p className="mt-2 text-[12.5px] text-accent">{errors.skill}</p>
                ) : null}
              </div>
            </div>

            {backendNote ? (
              <p className="mt-5 flex items-start gap-2 rounded-2xl bg-surface-subtle px-4 py-3 text-[12.5px] text-ink-muted">
                <Icon name="info" size={16} />
                {backendNote}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-accent mt-7 w-full"
            >
              {submitting ? (
                <>
                  <Icon name="flip" size={17} className="animate-spin-slow" />
                  Mengirim…
                </>
              ) : (
                <>
                  {reg.submitLabel}
                  <Icon name="arrow-right" size={17} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="glass rounded-3xl p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                    {cn.title}
                  </h3>
                  <p className="leading-copy mt-2 text-[13.5px] text-ink-muted sm:text-sm">
                    {cn.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm shrink-0"
                  onClick={() => {
                    setStep("form");
                    setSelectedCn("");
                    setInfoCopied(false);
                  }}
                >
                  Ubah data
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {cnCards.map((card) => {
                  const isSelected = card.id === selectedCn;
                  const isCopied = copiedCn === card.value;
                  return (
                    <div
                      key={card.id}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                        isSelected
                          ? "border-accent bg-accent-tint"
                          : "border-line bg-white/70 hover:border-ink/20"
                      }`}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => setSelectedCn(card.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                          {card.label}
                        </span>
                        <span className="mt-1 block truncate font-display text-[17px] font-semibold text-ink">
                          {card.value}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="icon-btn shrink-0"
                        aria-label={`Salin ${card.label}`}
                        onClick={() => handleCopyCn(card.value)}
                      >
                        <Icon name={isCopied ? "check" : "copy"} size={17} />
                      </button>
                    </div>
                  );
                })}
                {cnCards.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    Belum ada format CN yang aktif.
                  </p>
                ) : null}
              </div>

              {cn.placeholderHint ? (
                <p className="mt-4 text-[12.5px] text-ink-faint">
                  {cn.placeholderHint}
                </p>
              ) : null}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!selectedCard}
                  className="btn btn-outline flex-1"
                  onClick={() =>
                    selectedCard && handleCopyCn(selectedCard.value)
                  }
                >
                  <Icon
                    name={
                      selectedCard && copiedCn === selectedCard.value
                        ? "check"
                        : "copy"
                    }
                    size={17}
                  />
                  {selectedCard && copiedCn === selectedCard.value
                    ? cn.copiedLabel
                    : cn.copyLabel}
                </button>
                <button
                  type="button"
                  disabled={!selectedCard}
                  className="btn btn-accent flex-1"
                  onClick={() => {
                    setInfoCopied(false);
                    setJoinOpen(true);
                  }}
                >
                  {cn.joinLabel}
                  <Icon name="arrow-right" size={17} />
                </button>
              </div>
              {!selectedCard ? (
                <p className="mt-3 text-center text-[12.5px] text-ink-faint">
                  Pilih salah satu CN di atas untuk melanjutkan.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        title={join.title}
        description={join.description}
        footer={
          infoCopied ? (
            <a
              href={join.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent w-full"
              onClick={() => setJoinOpen(false)}
            >
              {join.joinLabel}
              <Icon name="external" size={17} />
            </a>
          ) : (
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleCopyInfo}
            >
              <Icon name="copy" size={17} />
              {join.copyInfoLabel}
            </button>
          )
        }
      >
        <div className="stack gap-3">
          <dl className="hairline overflow-hidden rounded-2xl bg-white/60">
            {[
              ["Nama", form.name.trim()],
              ["Gender", labelOf(genderOptions, form.gender)],
              ["Nama TT", form.tiktok.trim()],
              ["Gen", labelOf(genOptions, form.gen)],
              ["Paling Jago", labelOf(skillOptions, form.skill)]
            ].map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0"
              >
                <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  {key}
                </dt>
                <dd className="truncate text-[14.5px] font-medium text-ink">
                  {value || "-"}
                </dd>
              </div>
            ))}
          </dl>

          {infoCopied ? (
            <p className="flex items-center gap-2 rounded-2xl bg-accent-tint px-4 py-3 text-[13px] font-medium text-accent">
              <Icon name="check" size={16} />
              {join.copyInfoDoneLabel}
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-2xl bg-surface-subtle px-4 py-3 text-[12.5px] text-ink-muted">
              <Icon name="info" size={16} />
              Salin informasi ini terlebih dahulu, lalu tekan tombol Bergabung.
            </p>
          )}
        </div>
      </Modal>
    </Section>
  );
}
