"use client";

import { useConfig } from "@/components/providers/ConfigProvider";
import { ListEditor } from "@/components/admin/ListEditor";
import { Grid2, PanelHeader, SectionBlock } from "@/components/admin/Panel";
import {
  MediaField,
  SwitchField,
  TextAreaField,
  TextField
} from "@/components/admin/fields";
import { Icon } from "@/components/ui/Icon";
import { uid } from "@/lib/utils";
import type { SelectOption } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Pengalaman magang                                                          */
/* -------------------------------------------------------------------------- */

export function InternshipsTab() {
  const { config, update } = useConfig();

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Pengalaman Magang & Galeri"
        description="Tambah, ubah, urutkan, atau hapus kartu pengalaman. Setiap kartu tampil di galeri horizontal."
      />

      <SectionBlock title="Daftar pengalaman">
        <ListEditor
          items={config.internships.items}
          onChange={(items) => update((d) => void (d.internships.items = items))}
          createItem={() => ({
            id: uid("int"),
            title: "Pengalaman baru",
            role: "Peran",
            company: "Perusahaan",
            period: "2024 · 3 bulan",
            description: "Deskripsi singkat pengalaman.",
            image: "",
            tags: []
          })}
          itemTitle={(item) => item.title}
          addLabel="Tambah pengalaman"
          renderItem={(item, patch) => (
            <>
              <Grid2>
                <TextField label="Judul" value={item.title} onChange={(v) => patch({ title: v })} />
                <TextField label="Peran" value={item.role} onChange={(v) => patch({ role: v })} />
                <TextField label="Instansi" value={item.company} onChange={(v) => patch({ company: v })} />
                <TextField label="Periode" value={item.period} onChange={(v) => patch({ period: v })} />
              </Grid2>
              <TextAreaField
                label="Deskripsi"
                value={item.description}
                onChange={(v) => patch({ description: v })}
              />
              <TextField
                label="Tag (pisahkan dengan koma)"
                value={(item.tags ?? []).join(", ")}
                onChange={(v) =>
                  patch({
                    tags: v
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  })
                }
              />
              <MediaField
                label="Gambar"
                value={item.image}
                onChange={(v) => patch({ image: v })}
                hint="Rasio 4:3 paling pas untuk kartu."
              />
            </>
          )}
        />
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sertifikasi                                                                */
/* -------------------------------------------------------------------------- */

export function CertificationsTab() {
  const { config, update } = useConfig();

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Sertifikasi & Coverflow"
        description="Urutan pada daftar ini menentukan urutan coverflow. Sertifikat aktif selalu tampil tepat di tengah."
      />

      <SectionBlock title="Daftar sertifikat">
        <ListEditor
          items={config.certifications.items}
          onChange={(items) => update((d) => void (d.certifications.items = items))}
          createItem={() => ({
            id: uid("cert"),
            title: "Sertifikat baru",
            issuer: "Penerbit",
            date: "2025",
            description: "Deskripsi singkat sertifikat.",
            image: ""
          })}
          itemTitle={(item) => item.title}
          addLabel="Tambah sertifikat"
          renderItem={(item, patch) => (
            <>
              <Grid2>
                <TextField label="Judul" value={item.title} onChange={(v) => patch({ title: v })} />
                <TextField label="Penerbit" value={item.issuer} onChange={(v) => patch({ issuer: v })} />
                <TextField label="Tahun" value={item.date} onChange={(v) => patch({ date: v })} />
              </Grid2>
              <TextAreaField
                label="Deskripsi"
                value={item.description}
                onChange={(v) => patch({ description: v })}
              />
              <MediaField
                label="Gambar sertifikat"
                value={item.image}
                onChange={(v) => patch({ image: v })}
                hint="Rasio 4:3 agar seragam pada coverflow."
              />
            </>
          )}
        />
      </SectionBlock>

      <p className="flex items-start gap-2 rounded-2xl bg-surface-subtle px-4 py-3 text-[12.5px] text-ink-muted">
        <Icon name="info" size={16} />
        Sistem coverflow otomatis mendukung jumlah sertifikat berapa pun.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hashtag                                                                    */
/* -------------------------------------------------------------------------- */

export function HashtagsTab() {
  const { config, update } = useConfig();

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Hashtag & Jumlah Pemakai"
        description="Perbarui jumlah pemakai secara manual dan ubah keterangan pembaruan."
      />

      <SectionBlock title="Keterangan pembaruan">
        <TextField
          label="Keterangan"
          value={config.hashtags.note}
          onChange={(value) => update((d) => void (d.hashtags.note = value))}
          hint='Contoh: "Diperbarui setiap hari Senin"'
        />
      </SectionBlock>

      <SectionBlock title="Daftar hashtag">
        <ListEditor
          items={config.hashtags.items}
          onChange={(items) => update((d) => void (d.hashtags.items = items))}
          createItem={() => ({ id: uid("tag"), tag: "#hashtag", count: 0 })}
          itemTitle={(item) => `${item.tag} · ${item.count}`}
          addLabel="Tambah hashtag"
          renderItem={(item, patch) => (
            <Grid2>
              <TextField label="Hashtag" value={item.tag} onChange={(v) => patch({ tag: v })} />
              <label className="block">
                <span className="field-label">Jumlah pemakai</span>
                <input
                  type="number"
                  className="field"
                  value={item.count}
                  onChange={(event) => patch({ count: Number(event.target.value) || 0 })}
                />
              </label>
            </Grid2>
          )}
        />
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Registrasi, Gen & Paling Jago                                              */
/* -------------------------------------------------------------------------- */

function OptionList({
  title,
  description,
  options,
  onChange,
  prefix
}: {
  title: string;
  description: string;
  options: SelectOption[];
  onChange: (options: SelectOption[]) => void;
  prefix: string;
}) {
  return (
    <SectionBlock title={title} description={description}>
      <ListEditor
        items={options}
        onChange={onChange}
        createItem={() => ({ id: uid(prefix), label: "Pilihan baru", active: true })}
        itemTitle={(item) => `${item.label}${item.active ? "" : " (nonaktif)"}`}
        addLabel="Tambah pilihan"
        renderItem={(item, patch) => (
          <>
            <TextField label="Label" value={item.label} onChange={(v) => patch({ label: v })} />
            <SwitchField
              label="Aktif"
              description="Pilihan nonaktif tidak muncul pada formulir."
              checked={item.active}
              onChange={(v) => patch({ active: v })}
            />
          </>
        )}
      />
    </SectionBlock>
  );
}

export function RegistrationTab() {
  const { config, update } = useConfig();
  const reg = config.registration;

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Registrasi, Gen & Paling Jago"
        description="Atur label formulir serta daftar pilihan Gen, gender, dan keahlian."
      />

      <SectionBlock title="Label & placeholder formulir">
        <Grid2>
          <TextField label="Nama — label" value={reg.nameLabel} onChange={(v) => update((d) => void (d.registration.nameLabel = v))} />
          <TextField label="Nama — placeholder" value={reg.namePlaceholder} onChange={(v) => update((d) => void (d.registration.namePlaceholder = v))} />
          <TextField label="Gender — label" value={reg.genderLabel} onChange={(v) => update((d) => void (d.registration.genderLabel = v))} />
          <TextField label="TikTok — label" value={reg.tiktokLabel} onChange={(v) => update((d) => void (d.registration.tiktokLabel = v))} />
          <TextField label="TikTok — placeholder" value={reg.tiktokPlaceholder} onChange={(v) => update((d) => void (d.registration.tiktokPlaceholder = v))} />
          <TextField label="Gen — label" value={reg.genLabel} onChange={(v) => update((d) => void (d.registration.genLabel = v))} />
          <TextField label="Paling jago — label" value={reg.skillLabel} onChange={(v) => update((d) => void (d.registration.skillLabel = v))} />
          <TextField label="Tombol kirim" value={reg.submitLabel} onChange={(v) => update((d) => void (d.registration.submitLabel = v))} />
        </Grid2>
      </SectionBlock>

      <OptionList
        title="Pilihan Gen tujuan"
        description="Contoh: Gen 1, Gen 2, Gen 3."
        options={reg.genOptions}
        onChange={(options) => update((d) => void (d.registration.genOptions = options))}
        prefix="gen"
      />

      <OptionList
        title="Pilihan Paling Jago"
        description="Contoh: JJ 3D, JJ biasa, Mograp."
        options={reg.skillOptions}
        onChange={(options) => update((d) => void (d.registration.skillOptions = options))}
        prefix="sk"
      />

      <OptionList
        title="Pilihan Gender"
        options={reg.genderOptions}
        description="Pilihan gender pada formulir."
        onChange={(options) => update((d) => void (d.registration.genderOptions = options))}
        prefix="g"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Format CN                                                                  */
/* -------------------------------------------------------------------------- */

export function CnTab() {
  const { config, update } = useConfig();
  const cn = config.cn;

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Format CN"
        description='Gunakan placeholder "{Nama}" — nama pendaftar akan otomatis dimasukkan.'
      />

      <SectionBlock title="Teks bagian CN">
        <Grid2>
          <TextField label="Judul" value={cn.title} onChange={(v) => update((d) => void (d.cn.title = v))} />
          <TextField label="Tombol salin" value={cn.copyLabel} onChange={(v) => update((d) => void (d.cn.copyLabel = v))} />
          <TextField label="Tombol setelah tersalin" value={cn.copiedLabel} onChange={(v) => update((d) => void (d.cn.copiedLabel = v))} />
          <TextField label="Tombol bergabung" value={cn.joinLabel} onChange={(v) => update((d) => void (d.cn.joinLabel = v))} />
        </Grid2>
        <TextAreaField label="Deskripsi" value={cn.description} onChange={(v) => update((d) => void (d.cn.description = v))} />
        <TextField label="Catatan placeholder" value={cn.placeholderHint} onChange={(v) => update((d) => void (d.cn.placeholderHint = v))} />
      </SectionBlock>

      <SectionBlock
        title="Daftar format CN"
        description='Contoh format tambahan: "{Nama} KSF Clan".'
      >
        <ListEditor
          items={cn.formats}
          onChange={(items) => update((d) => void (d.cn.formats = items))}
          createItem={() => ({ id: uid("cn"), label: "Format baru", template: "{Nama} KSF Clan", active: true })}
          itemTitle={(item) => `${item.label} · ${item.template}`}
          addLabel="Tambah format CN"
          renderItem={(item, patch) => (
            <>
              <TextField label="Nama format" value={item.label} onChange={(v) => patch({ label: v })} />
              <TextField
                label="Template"
                value={item.template}
                onChange={(v) => patch({ template: v })}
                hint='Wajib memuat "{Nama}".'
              />
              <SwitchField label="Aktif" checked={item.active} onChange={(v) => patch({ active: v })} />
            </>
          )}
        />
      </SectionBlock>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* URL tombol bergabung                                                       */
/* -------------------------------------------------------------------------- */

export function JoinTab() {
  const { config, update } = useConfig();
  const join = config.join;

  return (
    <div className="stack gap-5">
      <PanelHeader
        title="Tombol Bergabung"
        description="Tujuan tautan saat pengguna menekan tombol Bergabung pada modal konfirmasi."
      />

      <SectionBlock title="Tautan tujuan">
        <TextField
          label="URL bergabung"
          value={join.url}
          onChange={(v) => update((d) => void (d.join.url = v))}
          hint="Contoh: tautan grup WhatsApp, Telegram, atau Discord."
        />
      </SectionBlock>

      <SectionBlock title="Teks modal konfirmasi">
        <Grid2>
          <TextField label="Judul modal" value={join.title} onChange={(v) => update((d) => void (d.join.title = v))} />
          <TextField label="Tombol salin informasi — teks" value={join.copyInfoLabel} onChange={(v) => update((d) => void (d.join.copyInfoLabel = v))} />
          <TextField label="Setelah tersalin — teks" value={join.copyInfoDoneLabel} onChange={(v) => update((d) => void (d.join.copyInfoDoneLabel = v))} />
          <TextField label="Tombol bergabung — teks" value={join.joinLabel} onChange={(v) => update((d) => void (d.join.joinLabel = v))} />
        </Grid2>
        <TextAreaField label="Deskripsi modal" value={join.description} onChange={(v) => update((d) => void (d.join.description = v))} />
      </SectionBlock>
    </div>
  );
}
