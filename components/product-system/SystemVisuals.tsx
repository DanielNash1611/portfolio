import Image from "next/image";

const scenes = {
  discovery: {
    src: "/images/product-system/discovery-workshop.webp",
    alt: "Hands compare rough interface sketches and research notes during an illustrative product discovery workshop.",
    caption: "Explore possibilities together.",
  },
  context: {
    src: "/images/product-system/shared-product-context.webp",
    alt: "An annotated product brief and user flow sit beside a laptop editor, illustrating shared context between product and engineering.",
    caption: "Keep the intent close to the work.",
  },
  evidence: {
    src: "/images/product-system/prototype-testing.webp",
    alt: "One person tries a tablet prototype while another records observations beside revised sketches.",
    caption: "Observe. Learn. Change the next version.",
  },
  gravity: {
    src: "/images/gravity/app/gravity-atomic-field.png",
    alt: "The working Gravity app shows independent performers orbiting a luminous cello in its Atomic view.",
    caption: "Gravity / actual app capture.",
  },
} as const;
type Scene = keyof typeof scenes;

export function chapterScene(chapter: string): Scene {
  if (chapter === "case-studies") return "gravity";
  if (chapter === "testing-evidence") return "evidence";
  if (["development-loop", "ai-native-building", "playbook"].includes(chapter))
    return "context";
  return "discovery";
}

export function SystemScene({
  scene,
  panoramic = false,
}: {
  scene: Scene;
  panoramic?: boolean;
}) {
  const image = scenes[scene];
  return (
    <figure
      className={`system-scene ${panoramic ? "system-scene-panoramic" : ""}`}
    >
      <div className="system-scene-image">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            panoramic
              ? "(max-width: 650px) 100vw, 1200px"
              : "(max-width: 900px) 100vw, 550px"
          }
        />
      </div>
      <figcaption>
        <span>{image.caption}</span>
        {scene !== "gravity" && <span>AI-generated illustration</span>}
      </figcaption>
    </figure>
  );
}
