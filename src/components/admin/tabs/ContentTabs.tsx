"use client";

import { useConfig } from "@/components/providers/ConfigProvider";
import { ListEditor } from "@/components/admin/ListEditor";
import { Grid2, PanelHeader, SectionBlock } from "@/components/admin/Panel";
import {
  MediaField,
  RangeField,
  SwitchField,
  TextAreaField,
  TextField
} from "@/components/admin/fields";
import { Icon } from "@/components/ui/Icon";
import { uid } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Identitas website & navigasi                                               */
/* -------------------------------------------------------------------------- */

export function IdentityTab() {
  const { config, update } = useConfig();
  const identity = config.identity;

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Identitas Website & Navigasi"
        description="Nama situs, tagline, dan daftar menu pada navigasi utama."
      />

      <SectionBlock title="Identitas">
        <Grid2>
          <TextField
            label="Nama situs"
            value={identity.siteName}
            onChange={(value) => update((d) => void (d.identity.siteName = value))}
          />
          <TextField
            label="Marka singkat"
            value={identity.brandMark}
            onChange={(value) => update((d) => void (d.identity.brandMark = value))}
          />
        </Grid2>
        <TextField
          label="Tagline"
          value={identity.tagline}
          onChange={(value) => update((d) => void (d.identity.tagline = value))}
        />
        <SwitchField
          label="Tampilkan navigasi"
          description="Matikan untuk menyembunyikan bar navigasi atas."
          checked={identity.showNav}
          onChange={(value) => update((d) => void (d.identity.showNav = value))}
        />
      </SectionBlock>

      <SectionBlock
        title="Menu navigasi"
        description="Urutkan, aktif/nonaktifkan, dan ubah tautan setiap menu."
      >
        <ListEditor
          items={identity.navItems}
          onChange={(items) => update((d) => void (d.identity.navItems = items))}
          createItem={() => ({
            id: uid("nav"),
            label: "Menu baru",
            href: "#hero",
            active: true
          })}
          itemTitle={(item) => item.label}
          addLabel="Tambah menu"
          renderItem={(item, patch) => (
            <>
              <Grid2>
                <TextField
                  label="Label"
                  value={item.label}
                  onChange={(value) => patch({ label: value })}
                />
                <TextField
                  label="Tautan"
                  value={item.href}
                  onChange={(value) => patch({ href: value })}
                  hint="Gunakan anchor, mis. #registrasi"
                />
              </Grid2>
              <SwitchField
                label="Aktif"
                checked={item.active}
                onChange={(value) => patch({ active: value })}
              />
            </>
          )}
        />
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Semua judul, teks, deskripsi & tombol                                      */
/* -------------------------------------------------------------------------- */

export function TextsTab() {
  const { config, update } = useConfig();

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Judul, Teks, Deskripsi & Tombol"
        description="Semua teks yang tampil di halaman portofolio dapat diubah di sini."
      />

      <SectionBlock title="Hero">
        <Grid2>
          <TextField
            label="Label kecil (eyebrow)"
            value={config.hero.eyebrow}
            onChange={(value) => update((d) => void (d.hero.eyebrow = value))}
          />
          <TextField
            label="Judul utama"
            value={config.hero.title}
            onChange={(value) => update((d) => void (d.hero.title = value))}
          />
        </Grid2>
        <TextField
          label="Subjudul"
          value={config.hero.subtitle}
          onChange={(value) => update((d) => void (d.hero.subtitle = value))}
        />
        <TextAreaField
          label="Deskripsi"
          value={config.hero.description}
          onChange={(value) => update((d) => void (d.hero.description = value))}
        />
        <Grid2>
          <TextField
            label="Tombol utama — teks"
            value={config.hero.primaryButton.label}
            onChange={(value) => update((d) => void (d.hero.primaryButton.label = value))}
          />
          <TextField
            label="Tombol utama — tautan"
            value={config.hero.primaryButton.href}
            onChange={(value) => update((d) => void (d.hero.primaryButton.href = value))}
          />
          <TextField
            label="Tombol kedua — teks"
            value={config.hero.secondaryButton.label}
            onChange={(value) => update((d) => void (d.hero.secondaryButton.label = value))}
          />
          <TextField
            label="Tombol kedua — tautan"
            value={config.hero.secondaryButton.href}
            onChange={(value) => update((d) => void (d.hero.secondaryButton.href = value))}
          />
        </Grid2>
        <ListEditor
          items={config.hero.stats}
          onChange={(items) => update((d) => void (d.hero.stats = items))}
          createItem={() => ({ id: uid("stat"), label: "Label", value: "0" })}
          itemTitle={(item) => `${item.value} · ${item.label}`}
          addLabel="Tambah statistik"
          renderItem={(item, patch) => (
            <Grid2>
              <TextField label="Nilai" value={item.value} onChange={(v) => patch({ value: v })} />
              <TextField label="Label" value={item.label} onChange={(v) => patch({ label: v })} />
            </Grid2>
          )}
        />
      </SectionBlock>

      <SectionBlock title="Profil">
        <Grid2>
          <TextField
            label="Nama"
            value={config.profile.name}
            onChange={(value) => update((d) => void (d.profile.name = value))}
          />
          <TextField
            label="Peran"
            value={config.profile.role}
            onChange={(value) => update((d) => void (d.profile.role = value))}
          />
          <TextField
            label="Lokasi"
            value={config.profile.location}
            onChange={(value) => update((d) => void (d.profile.location = value))}
          />
        </Grid2>
        <TextAreaField
          label="Bio"
          value={config.profile.bio}
          onChange={(value) => update((d) => void (d.profile.bio = value))}
        />
        <ListEditor
          items={config.profile.socials}
          onChange={(items) => update((d) => void (d.profile.socials = items))}
          createItem={() => ({
            id: uid("soc"),
            label: "Sosial",
            href: "https://",
            icon: "link" as const
          })}
          itemTitle={(item) => item.label}
          addLabel="Tambah sosial"
          renderItem={(item, patch) => (
            <>
              <Grid2>
                <TextField label="Label" value={item.label} onChange={(v) => patch({ label: v })} />
                <TextField label="Tautan" value={item.href} onChange={(v) => patch({ href: v })} />
              </Grid2>
              <TextField
                label="Ikon"
                value={item.icon}
                onChange={(v) => patch({ icon: v as typeof item.icon })}
                hint="at · link · image · user · pin · layers · hash"
              />
            </>
          )}
        />
      </SectionBlock>

      <SectionBlock title="Tentang Kessoku">
        <Grid2>
          <TextField
            label="Judul"
            value={config.about.title}
            onChange={(value) => update((d) => void (d.about.title = value))}
          />
          <TextField
            label="Subjudul"
            value={config.about.subtitle}
            onChange={(value) => update((d) => void (d.about.subtitle = value))}
          />
        </Grid2>
        <TextAreaField
          label="Isi teks"
          rows={5}
          value={config.about.body}
          onChange={(value) => update((d) => void (d.about.body = value))}
        />
        <TextField
          label="Keterangan gambar"
          value={config.about.imageCaption}
          onChange={(value) => update((d) => void (d.about.imageCaption = value))}
        />
        <ListEditor
          items={config.about.highlights}
          onChange={(items) => update((d) => void (d.about.highlights = items))}
          createItem={() => ({ id: uid("hl"), label: "Label", value: "0" })}
          itemTitle={(item) => `${item.value} · ${item.label}`}
          addLabel="Tambah highlight"
          renderItem={(item, patch) => (
            <Grid2>
              <TextField label="Nilai" value={item.value} onChange={(v) => patch({ value: v })} />
              <TextField label="Label" value={item.label} onChange={(v) => patch({ label: v })} />
            </Grid2>
          )}
        />
      </SectionBlock>

      <SectionBlock title="Kalung interaktif">
        <Grid2>
          <TextField
            label="Judul"
            value={config.necklace.title}
            onChange={(value) => update((d) => void (d.necklace.title = value))}
          />
          <TextField
            label="Label kecil"
            value={config.necklace.subtitle}
            onChange={(value) => update((d) => void (d.necklace.subtitle = value))}
          />
        </Grid2>
        <TextAreaField
          label="Deskripsi"
          value={config.necklace.description}
          onChange={(value) => update((d) => void (d.necklace.description = value))}
        />
        <TextField
          label="Petunjuk penggunaan"
          value={config.necklace.hint}
          onChange={(value) => update((d) => void (d.necklace.hint = value))}
        />
        <Grid2>
          <TextField
            label="Label sisi depan"
            value={config.necklace.frontLabel}
            onChange={(value) => update((d) => void (d.necklace.frontLabel = value))}
          />
          <TextField
            label="Label sisi belakang"
            value={config.necklace.backLabel}
            onChange={(value) => update((d) => void (d.necklace.backLabel = value))}
          />
        </Grid2>
      </SectionBlock>

      <SectionBlock title="Pengalaman magang">
        <TextField
          label="Judul bagian"
          value={config.internships.title}
          onChange={(value) => update((d) => void (d.internships.title = value))}
        />
        <TextAreaField
          label="Deskripsi bagian"
          value={config.internships.description}
          onChange={(value) => update((d) => void (d.internships.description = value))}
        />
      </SectionBlock>

      <SectionBlock title="Sertifikasi">
        <TextField
          label="Judul bagian"
          value={config.certifications.title}
          onChange={(value) => update((d) => void (d.certifications.title = value))}
        />
        <TextAreaField
          label="Deskripsi bagian"
          value={config.certifications.description}
          onChange={(value) => update((d) => void (d.certifications.description = value))}
        />
      </SectionBlock>

      <SectionBlock title="Statistik hashtag — teks">
        <TextField
          label="Judul bagian"
          value={config.hashtags.title}
          onChange={(value) => update((d) => void (d.hashtags.title = value))}
        />
        <TextAreaField
          label="Deskripsi bagian"
          value={config.hashtags.description}
          onChange={(value) => update((d) => void (d.hashtags.description = value))}
        />
        <p className="text-[12px] text-ink-faint">
          Keterangan pembaruan dan jumlah pemakai diatur pada tab “Hashtag”.
        </p>
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Background                                                                 */
/* -------------------------------------------------------------------------- */

export function BackgroundTab() {
  const { config, update } = useConfig();
  const bg = config.background;

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Background Foto / Video"
        description="Latar utama halaman. Pada perangkat mobile gunakan rasio 9:16 agar bagian bawah memudar halus ke putih."
      />

      <SectionBlock title="Latar utama">
        <div className="grid gap-2 sm:grid-cols-3">
          {(["plain", "image", "video"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update((d) => void (d.background.type = type))}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                bg.type === type
                  ? "border-accent bg-accent-tint"
                  : "border-line bg-white/70 hover:border-ink/20"
              }`}
            >
              <Icon
                name={type === "video" ? "video" : type === "image" ? "image" : "sun"}
                size={18}
              />
              <span className="text-[13.5px] font-medium capitalize">
                {type === "plain" ? "Warna polos" : type}
              </span>
            </button>
          ))}
        </div>

        {bg.type === "plain" ? (
          <TextField
            label="Warna latar (hex)"
            value={bg.color}
            onChange={(value) => update((d) => void (d.background.color = value))}
          />
        ) : (
          <>
            <MediaField
              label="Media desktop"
              value={bg.desktopUrl}
              accept={bg.type === "video" ? "video/*" : "image/*"}
              onChange={(value) => update((d) => void (d.background.desktopUrl = value))}
              hint="Rasio lebar (16:9) paling ideal."
            />
            <MediaField
              label="Media mobile (9:16)"
              value={bg.mobileUrl}
              accept={bg.type === "video" ? "video/*" : "image/*"}
              onChange={(value) => update((d) => void (d.background.mobileUrl = value))}
              hint="Rasio tegak 9:16 untuk perangkat mobile."
            />
          </>
        )}

        <SwitchField
          label="Pudarkan bagian bawah ke putih"
          description="Membuat transisi halus menuju konten."
          checked={bg.fadeBottom}
          onChange={(value) => update((d) => void (d.background.fadeBottom = value))}
        />
        <RangeField
          label="Intensitas lapisan putih"
          value={bg.overlayOpacity}
          min={0}
          max={1}
          step={0.02}
          onChange={(value) => update((d) => void (d.background.overlayOpacity = value))}
        />
      </SectionBlock>

      <SectionBlock
        title="Pilihan background untuk pengunjung"
        description="Preset ini muncul pada menu pengaturan di halaman portofolio."
      >
        <ListEditor
          items={bg.presets}
          onChange={(items) => update((d) => void (d.background.presets = items))}
          createItem={() => ({
            id: uid("bg"),
            label: "Preset baru",
            type: "image" as const,
            color: "#FFFFFF",
            desktopUrl: "",
            mobileUrl: ""
          })}
          itemTitle={(item) => item.label}
          addLabel="Tambah preset"
          renderItem={(item, patch) => (
            <>
              <Grid2>
                <TextField label="Nama preset" value={item.label} onChange={(v) => patch({ label: v })} />
                <TextField label="Warna dasar (hex)" value={item.color} onChange={(v) => patch({ color: v })} />
              </Grid2>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["plain", "image", "video"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => patch({ type })}
                    className={`rounded-xl border px-3 py-2 text-[12.5px] font-medium capitalize ${
                      item.type === type
                        ? "border-accent bg-accent-tint"
                        : "border-line bg-white/70"
                    }`}
                  >
                    {type === "plain" ? "Warna polos" : type}
                  </button>
                ))}
              </div>
              {item.type !== "plain" ? (
                <>
                  <MediaField
                    label="Media desktop"
                    value={item.desktopUrl}
                    accept={item.type === "video" ? "video/*" : "image/*"}
                    onChange={(v) => patch({ desktopUrl: v })}
                  />
                  <MediaField
                    label="Media mobile"
                    value={item.mobileUrl}
                    accept={item.type === "video" ? "video/*" : "image/*"}
                    onChange={(v) => patch({ mobileUrl: v })}
                  />
                </>
              ) : null}
            </>
          )}
        />
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Foto profil & kalung                                                       */
/* -------------------------------------------------------------------------- */

export function MediaTab() {
  const { config, update } = useConfig();

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Foto Profil & Kalung"
        description="Unggah langsung ke Supabase Storage atau tempel tautan gambar."
      />

      <SectionBlock title="Foto profil">
        <MediaField
          label="Foto profil (rasio 1:1)"
          value={config.profile.photoUrl}
          onChange={(value) => update((d) => void (d.profile.photoUrl = value))}
          hint="Gunakan foto persegi agar tidak gepeng."
        />
      </SectionBlock>

      <SectionBlock title="Foto Tentang Kessoku">
        <MediaField
          label="Foto bagian Tentang"
          value={config.about.imageUrl}
          onChange={(value) => update((d) => void (d.about.imageUrl = value))}
          hint="Disarankan rasio 4:5 (tegak)."
        />
      </SectionBlock>

      <SectionBlock title="Kalung interaktif">
        <MediaField
          label="Gambar sisi depan"
          value={config.necklace.frontImage}
          onChange={(value) => update((d) => void (d.necklace.frontImage = value))}
          hint="Gunakan PNG latar transparan / putih, rasio 1:1."
        />
        <MediaField
          label="Gambar sisi belakang"
          value={config.necklace.backImage}
          onChange={(value) => update((d) => void (d.necklace.backImage = value))}
          hint="Gunakan PNG latar transparan / putih, rasio 1:1."
        />
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Animasi                                                                    */
/* -------------------------------------------------------------------------- */

export function AnimationTab() {
  const { config, update } = useConfig();
  const anim = config.animation;

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Animasi & Micro-interaction"
        description="Aktifkan atau nonaktifkan animasi agar tetap ringan di perangkat mobile."
      />

      <SectionBlock title="Sakelar animasi">
        <SwitchField
          label="Master animasi"
          description="Sakelar utama seluruh animasi halaman."
          checked={anim.enabled}
          onChange={(value) => update((d) => void (d.animation.enabled = value))}
        />
        <SwitchField
          label="Scroll reveal"
          description="Elemen muncul halus saat digulir."
          checked={anim.scrollReveal}
          onChange={(value) => update((d) => void (d.animation.scrollReveal = value))}
        />
        <SwitchField
          label="Efek hover"
          description="Micro-interaction pada kartu dan tombol."
          checked={anim.hoverEffects}
          onChange={(value) => update((d) => void (d.animation.hoverEffects = value))}
        />
        <SwitchField
          label="Efek shimmer"
          description="Gerakan cahaya lembut pada gambar."
          checked={anim.shimmer}
          onChange={(value) => update((d) => void (d.animation.shimmer = value))}
        />
        <SwitchField
          label="Gerak kalung"
          description="Kalung dapat digerakkan dengan kursor/sentuhan."
          checked={anim.necklaceMotion}
          onChange={(value) => update((d) => void (d.animation.necklaceMotion = value))}
        />
        <SwitchField
          label="Animasi coverflow sertifikat"
          description="Perpindahan 3D antar sertifikat."
          checked={anim.coverflowMotion}
          onChange={(value) => update((d) => void (d.animation.coverflowMotion = value))}
        />
      </SectionBlock>

      <SectionBlock title="Kecepatan">
        <RangeField
          label="Skala durasi"
          value={anim.durationScale}
          min={0.5}
          max={2}
          step={0.1}
          suffix="×"
          onChange={(value) => update((d) => void (d.animation.durationScale = value))}
        />
      </SectionBlock>
    </div>
  );
}
