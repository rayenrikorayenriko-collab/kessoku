// ---------------------------------------------------------------------------
// Kessoku Family — shared types.
// Every piece of public content is described here so it can be edited from the
// admin dashboard without touching source code.
// ---------------------------------------------------------------------------

export type NavItem = { id: string; label: string; href: string; active: boolean };

export type IdentityConfig = {
  siteName: string;
  brandMark: string;
  tagline: string;
  navItems: NavItem[];
  showNav: boolean;
};

export type BackgroundType = "plain" | "image" | "video";

export type BackgroundPreset = {
  id: string;
  label: string;
  type: BackgroundType;
  color: string;
  desktopUrl: string;
  mobileUrl: string;
};

export type BackgroundConfig = {
  type: BackgroundType;
  color: string;
  desktopUrl: string;
  mobileUrl: string;
  fadeBottom: boolean;
  overlayOpacity: number; // 0 - 1
  /** Extra backgrounds visitors can pick from the in-page settings menu. */
  presets: BackgroundPreset[];
};

export type LinkButton = { label: string; href: string };

export type StatItem = { id: string; label: string; value: string };

export type HeroConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: LinkButton;
  secondaryButton: LinkButton;
  stats: StatItem[];
};

export type SocialItem = { id: string; label: string; href: string; icon: IconName };

export type ProfileConfig = {
  name: string;
  role: string;
  location: string;
  bio: string;
  photoUrl: string;
  socials: SocialItem[];
};

export type AboutConfig = {
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  imageCaption: string;
  highlights: StatItem[];
};

export type NecklaceConfig = {
  title: string;
  subtitle: string;
  description: string;
  hint: string;
  frontImage: string;
  backImage: string;
  frontLabel: string;
  backLabel: string;
};

export type InternshipItem = {
  id: string;
  title: string;
  role: string;
  company: string;
  period: string;
  description: string;
  image: string;
  tags: string[];
};

export type InternshipConfig = {
  title: string;
  description: string;
  items: InternshipItem[];
};

export type CertificationItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
};

export type CertificationConfig = {
  title: string;
  description: string;
  items: CertificationItem[];
};

export type SelectOption = { id: string; label: string; active: boolean };

export type RegistrationConfig = {
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  genderLabel: string;
  tiktokLabel: string;
  tiktokPlaceholder: string;
  genLabel: string;
  skillLabel: string;
  submitLabel: string;
  genderOptions: SelectOption[];
  genOptions: SelectOption[];
  skillOptions: SelectOption[];
};

export type CnFormat = { id: string; label: string; template: string; active: boolean };

export type CnConfig = {
  title: string;
  description: string;
  placeholderHint: string;
  copyLabel: string;
  copiedLabel: string;
  joinLabel: string;
  formats: CnFormat[];
};

export type HashtagItem = { id: string; tag: string; count: number };

export type HashtagConfig = {
  title: string;
  description: string;
  note: string;
  items: HashtagItem[];
};

export type AnimationConfig = {
  enabled: boolean;
  scrollReveal: boolean;
  hoverEffects: boolean;
  shimmer: boolean;
  necklaceMotion: boolean;
  coverflowMotion: boolean;
  durationScale: number; // 0.5 (fast) – 2.0 (slow)
};

export type JoinConfig = {
  title: string;
  description: string;
  copyInfoLabel: string;
  copyInfoDoneLabel: string;
  joinLabel: string;
  url: string;
};

export type SiteConfig = {
  identity: IdentityConfig;
  background: BackgroundConfig;
  hero: HeroConfig;
  profile: ProfileConfig;
  about: AboutConfig;
  necklace: NecklaceConfig;
  internships: InternshipConfig;
  certifications: CertificationConfig;
  registration: RegistrationConfig;
  cn: CnConfig;
  join: JoinConfig;
  hashtags: HashtagConfig;
  animation: AnimationConfig;
};

export type RegistrationPayload = {
  name: string;
  gender: string;
  tiktok: string;
  gen: string;
  skill: string;
  cn_format: string;
  cn_value: string;
};

export type RegistrationRecord = RegistrationPayload & {
  id: string;
  created_at: string;
};

// Icon names available to the built-in vector icon set (no emoji anywhere).
export type IconName =
  | "menu"
  | "close"
  | "settings"
  | "link"
  | "copy"
  | "check"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "arrow-right"
  | "arrow-up-right"
  | "drag"
  | "flip"
  | "user"
  | "at"
  | "pin"
  | "layers"
  | "award"
  | "briefcase"
  | "hash"
  | "lock"
  | "logout"
  | "plus"
  | "trash"
  | "pencil"
  | "image"
  | "video"
  | "eye"
  | "eye-off"
  | "save"
  | "search"
  | "grip"
  | "sun"
  | "shirt"
  | "info"
  | "external"
  | "download";
