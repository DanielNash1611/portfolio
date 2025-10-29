import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type PortraitSeed = {
  file: string;
  roles: string[];
  alt: string;
};

type PortraitMetadata = PortraitSeed & {
  width: number;
  height: number;
};

const ROOT = process.cwd();
const PORTRAIT_DIR = path.join(ROOT, "public", "portraits");
const METADATA_PATH = path.join(PORTRAIT_DIR, "metadata.json");

const portraitSeeds: PortraitSeed[] = [
  {
    file: "hero_square_photo.jpg",
    roles: ["hero", "avatar"],
    alt: "Daniel Nash smiling, close-up portrait."
  },
  {
    file: "about_medium_photo.jpg",
    roles: ["about-header"],
    alt: "Daniel Nash seated on a teal sofa, smiling toward the camera."
  },
  {
    file: "front_medium_photo.jpg",
    roles: ["inline"],
    alt: "Daniel Nash facing forward on a teal sofa with artwork behind."
  },
  {
    file: "center_medium_photo.jpg",
    roles: ["inline-fallback"],
    alt: "Daniel Nash centered on a teal sofa, friendly expression."
  },
  {
    file: "wide_room_photo.jpg",
    roles: ["divider"],
    alt: "Wide shot of Daniel in a teal living room with artwork and plants."
  },
  {
    file: "looking_right_photo.jpg",
    roles: ["cta-left"],
    alt: "Daniel looking to the right with a thoughtful smile."
  },
  {
    file: "looking_left_photo.jpg",
    roles: ["cta-right"],
    alt: "Daniel looking to the left with a relaxed smile."
  },
  {
    file: "thinking_medium_photo.jpg",
    roles: ["insight"],
    alt: "Daniel resting his chin on his hand, thinking."
  },
  {
    file: "relaxed_medium_photo.jpg",
    roles: ["casual"],
    alt: "Daniel leaning back on a teal sofa with hands behind his head."
  }
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function buildMetadata(): Promise<PortraitMetadata[]> {
  const entries: PortraitMetadata[] = [];

  for (const seed of portraitSeeds) {
    const sourcePath = path.join(PORTRAIT_DIR, seed.file);
    const exists = await fileExists(sourcePath);

    if (!exists) {
      console.warn(`Skipping ${seed.file} (file not found).`);
      continue;
    }

    const { width, height } = await sharp(sourcePath).metadata();

    if (!width || !height) {
      console.warn(`Skipping ${seed.file} (unable to read image dimensions).`);
      continue;
    }

    entries.push({
      ...seed,
      width,
      height
    });
  }

  return entries;
}

async function writeMetadata(metadata: PortraitMetadata[]): Promise<void> {
  const json = `${JSON.stringify(metadata, null, 2)}\n`;
  await fs.writeFile(METADATA_PATH, json, "utf8");
}

async function run(): Promise<void> {
  const metadata = await buildMetadata();

  if (metadata.length === 0) {
    console.warn("No portrait metadata generated. metadata.json not updated.");
    return;
  }

  await writeMetadata(metadata);

  console.log(
    `Wrote metadata for ${metadata.length} portraits to ${path.relative(
      ROOT,
      METADATA_PATH
    )}.`
  );
}

run().catch((error) => {
  console.error("Failed to read portrait metadata:", error);
  process.exitCode = 1;
});
