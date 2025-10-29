import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type PortraitMetadata = {
  file: string;
  roles: string[];
  width: number;
  height: number;
  alt: string;
};

const ROOT = process.cwd();
const PORTRAIT_DIR = path.join(ROOT, "public", "portraits");
const METADATA_PATH = path.join(PORTRAIT_DIR, "metadata.json");

const FORMATS: Array<{
  format: "webp" | "avif";
  options: sharp.WebpOptions | sharp.AvifOptions;
}> = [
  {
    format: "webp",
    options: { quality: 82, effort: 5 }
  },
  {
    format: "avif",
    options: { quality: 70, effort: 5 }
  }
];

const AVATAR_SIZES = [256, 512];

async function loadMetadata(): Promise<PortraitMetadata[]> {
  try {
    const raw = await fs.readFile(METADATA_PATH, "utf8");
    return JSON.parse(raw) as PortraitMetadata[];
  } catch (error) {
    console.warn(
      `Unable to read portrait metadata at ${path.relative(ROOT, METADATA_PATH)}.`,
      error
    );
    return [];
  }
}

async function createDerivatives(
  portrait: PortraitMetadata
): Promise<void> {
  const sourcePath = path.join(PORTRAIT_DIR, portrait.file);
  const basename = portrait.file.replace(/\.[^.]+$/, "");

  for (const { format, options } of FORMATS) {
    const targetPath = path.join(PORTRAIT_DIR, `${basename}.${format}`);
    await sharp(sourcePath)
      .toFormat(format, options as sharp.WebpOptions & sharp.AvifOptions)
      .toFile(targetPath);
    console.log(`- ${path.basename(targetPath)}`);
  }

  if (portrait.roles.includes("avatar")) {
    for (const size of AVATAR_SIZES) {
      for (const { format, options } of FORMATS) {
        const targetPath = path.join(
          PORTRAIT_DIR,
          `${basename}-${size}.${format}`
        );
        await sharp(sourcePath)
          .resize(size, size, { fit: "cover" })
          .toFormat(format, options as sharp.WebpOptions & sharp.AvifOptions)
          .toFile(targetPath);
        console.log(`  * avatar ${size}px -> ${path.basename(targetPath)}`);
      }
    }
  }
}

async function run(): Promise<void> {
  sharp.cache(false);

  const metadata = await loadMetadata();

  if (metadata.length === 0) {
    console.warn("No portrait entries available. Skipping derivative build.");
    return;
  }

  for (const portrait of metadata) {
    console.log(`Processing ${portrait.file}...`);
    await createDerivatives(portrait);
  }
}

run().catch((error) => {
  console.error("Portrait derivative build failed:", error);
  process.exitCode = 1;
});
