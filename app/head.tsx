import { getPortrait } from "@/components/Portrait";

export default function Head(): JSX.Element | null {
  const heroPortrait = getPortrait("hero");

  if (!heroPortrait) {
    return null;
  }

  const basePath = `/portraits/${heroPortrait.file.replace(/\.[^.]+$/, "")}`;

  return (
    <>
      <link rel="preload" as="image" href={`${basePath}.avif`} type="image/avif" />
      <link rel="preload" as="image" href={`${basePath}.webp`} type="image/webp" />
    </>
  );
}
