import Image from "next/image";
import clsx from "clsx";
import metadataJson from "@/public/portraits/metadata.json";

export type Variant =
  | "hero"
  | "about-header"
  | "inline"
  | "divider"
  | "cta-left"
  | "cta-right"
  | "avatar"
  | "insight"
  | "casual";

export type PortraitMetadata = {
  file: string;
  roles: string[];
  width: number;
  height: number;
  alt: string;
};

type PortraitProps = {
  variant: Variant;
  className?: string;
  altOverride?: string;
  size?: number;
  portrait?: PortraitMetadata | null;
};

const portraits = metadataJson as PortraitMetadata[];

const variantRolePreference: Record<Variant, string[][]> = {
  hero: [["hero"]],
  "about-header": [["about-header"]],
  inline: [["inline"], ["inline-fallback"]],
  divider: [["divider"]],
  "cta-left": [["cta-left"]],
  "cta-right": [["cta-right"]],
  avatar: [["avatar"], ["hero"]],
  insight: [["insight"]],
  casual: [["casual"]]
};

export function getPortrait(variant: Variant): PortraitMetadata | null {
  const preferences = variantRolePreference[variant] ?? [[variant]];

  for (const roles of preferences) {
    const match = portraits.find((entry) =>
      roles.some((role) => entry.roles.includes(role))
    );
    if (match) {
      return match;
    }
  }

  return null;
}

const heroSizes = "(min-width:1024px) 512px, 60vw";

export default function Portrait({
  variant,
  className,
  altOverride,
  size,
  portrait
}: PortraitProps): JSX.Element | null {
  const data = portrait ?? getPortrait(variant);

  if (!data) {
    return null;
  }

  const src = `/portraits/${data.file}`;
  const alt = altOverride ?? data.alt;

  if (variant === "hero") {
    return (
      <div
        className={clsx(
          "relative overflow-hidden rounded-2xl bg-[#2C4F52]/10",
          className
        )}
        style={{ aspectRatio: `${data.width} / ${data.height}` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes={heroSizes}
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2C4F52]/35 via-transparent to-[#F2E3D5]/20" />
      </div>
    );
  }

  if (variant === "divider") {
    return (
      <div
        className={clsx(
          "relative isolate w-full overflow-hidden rounded-3xl bg-[#3A3D40]/30",
          className
        )}
        style={{ aspectRatio: `${data.width} / ${data.height}` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          className="h-full w-full object-cover will-change-transform"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2C4F52]/15 via-transparent to-[#F2E3D5]/15" />
      </div>
    );
  }

  if (variant === "avatar") {
    const avatarSize = size ?? 256;

    return (
      <div
        className={clsx(
          "relative flex items-center justify-center overflow-hidden rounded-full border border-[#DBBF96] bg-[#F2E3D5]",
          className
        )}
        style={{ width: avatarSize, height: avatarSize }}
      >
        <Image
          src={src}
          alt={alt}
          width={avatarSize}
          height={avatarSize}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const loading = variant === "insight" ? "eager" : "lazy";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl bg-[#F2E3D5]",
        className
      )}
      style={{ aspectRatio: `${data.width} / ${data.height}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading={loading}
        className="object-cover"
      />
    </div>
  );
}
