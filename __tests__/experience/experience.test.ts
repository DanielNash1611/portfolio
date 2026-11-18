import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { ExperienceAudio, experienceAudioAssets } from "@/lib/experience/audio";
import {
  chapterProgress,
  isGravityActive,
  narrativeFrame,
} from "@/lib/experience/narrative";
import { createWorld } from "@/lib/experience/world";
import { specificEnergy } from "@/lib/experience/gravity-physics";
import {
  portfolioAssistantAvailable,
  portfolioWebMCPAvailable,
} from "@/lib/portfolio-agent/route-policy";
import { evidenceExample } from "@/content/experience";
import sitemap from "@/app/sitemap";
import type { SpatialFrame } from "@/lib/experience/types";
import { getExperienceHomeContent } from "@/content/experience-home";
import { homeContent, getProductEntry } from "@/content/portfolio";
import { testimonials } from "@/data/testimonials";

test("chapter links land inside stable scenes and Gravity’s arrival and dissipation are continuous and reversible", () => {
  for (const [chapter, progress] of Object.entries(chapterProgress))
    assert.equal(narrativeFrame(progress).chapter, chapter);
  for (const boundary of [0, 0.15, 0.62, 0.82, 0.86, 1]) {
    const before = narrativeFrame(boundary - 0.00001);
    const after = narrativeFrame(boundary + 0.00001);
    assert.ok(Math.abs(before.assembly - after.assembly) < 0.001);
    assert.ok(Math.abs(before.dissolve - after.dissolve) < 0.001);
  }
  const forward = Array.from({ length: 101 }, (_, i) =>
    narrativeFrame(i / 100),
  );
  assert.deepEqual(
    [...forward]
      .reverse()
      .map((frame) => narrativeFrame(frame.progress))
      .reverse(),
    forward,
  );
  assert.equal(isGravityActive(0.5), true);
  assert.equal(isGravityActive(0.82), false);
  assert.equal(narrativeFrame(-2).progress, 0);
  assert.equal(narrativeFrame(2).progress, 1);
});

test("force-driven performers remain stable across display cadence and pause without time catch-up", () => {
  const slow = createWorld(),
    fast = createWorld();
  const energies = fast.performers.map(specificEnergy);
  for (let i = 0; i < 3600; i++) fast.advance(1 / 60);
  for (let i = 0; i < 1800; i++) slow.advance(1 / 30);
  fast.performers.forEach((body, index) => {
    assert.ok(Math.abs(specificEnergy(body) - energies[index]) < 0.00001);
    assert.ok(
      Math.abs(body.position.x - slow.performers[index].position.x) < 0.00001,
    );
  });
  const positions = fast.sources();
  fast.advance(100, true);
  assert.deepEqual(fast.sources(), positions);
  assert.notDeepEqual(positions[1], positions[2]);
  assert.deepEqual(positions[0], [0, 0, 0]);
});

class Parameter {
  value = 0;
  setTargetAtTime(value: number) {
    this.value = value;
  }
}
class Node {
  refDistance = 1;
  rolloffFactor = 1;
  gain = new Parameter();
  threshold = new Parameter();
  ratio = new Parameter();
  positionX = new Parameter();
  positionY = new Parameter();
  positionZ = new Parameter();
  forwardX = new Parameter();
  forwardY = new Parameter();
  forwardZ = new Parameter();
  upX = new Parameter();
  upY = new Parameter();
  upZ = new Parameter();
  disconnected = false;
  connect(node: Node) {
    return node;
  }
  disconnect() {
    this.disconnected = true;
  }
}
class Source extends Node {
  loop = false;
  buffer: unknown;
  started: number[] = [];
  stopped: number[] = [];
  start(time: number) {
    this.started.push(time);
  }
  stop(time: number) {
    this.stopped.push(time);
  }
}
class Context {
  currentTime = 12;
  listener = new Node();
  destination = new Node();
  sources: Source[] = [];
  panners: Node[] = [];
  gains: Node[] = [];
  closed = false;
  resumed = false;
  async resume() {
    this.resumed = true;
  }
  async close() {
    this.closed = true;
  }
  async decodeAudioData(data: ArrayBuffer) {
    return data;
  }
  createGain() {
    const node = new Node();
    this.gains.push(node);
    return node;
  }
  createDynamicsCompressor() {
    return new Node();
  }
  createPanner() {
    const node = new Node();
    this.panners.push(node);
    return node;
  }
  createBufferSource() {
    const node = new Source();
    this.sources.push(node);
    return node;
  }
}
const frame: SpatialFrame = {
  sources: [
    [0, 0, 0],
    [1.6, 0.8, -0.3],
    [-2.1, 0, 1],
  ],
  listener: [0, 1, 7],
  forward: [0, 0, -1],
  up: [0, 1, 0],
};
const response = () => new Response(new Uint8Array(8));
const factory = (context: Context) => () => context as unknown as AudioContext;

test("audio stays silent until activation, starts independent voices, and uses rendered spatial coordinates", async () => {
  const context = new Context();
  let fetches = 0;
  const audio = new ExperienceAudio(factory(context), async () => {
    fetches++;
    return response();
  });
  try {
    audio.update(frame);
    assert.equal(fetches, 0);
    assert.equal(context.resumed, false);
    assert.equal(await audio.enable(), true);
    assert.equal(fetches, experienceAudioAssets.length);
    assert.equal(
      new Set(context.sources.flatMap((source) => source.started)).size,
      3,
    );
    assert.ok(context.sources.every((source) => source.loop));
    assert.deepEqual(
      context.panners.map((node) => [
        node.positionX.value,
        node.positionY.value,
        node.positionZ.value,
      ]),
      frame.sources,
    );
    assert.equal(context.listener.positionZ.value, 7);
    // The phone-speaker regression was a quiet source combined with about
    // 34 dB of downstream attenuation at the default Audience viewpoint.
    // Keep the cello within 12 dB of the original recording there.
    const panner = context.panners[0];
    const distance = Math.hypot(...frame.listener);
    const attenuation =
      panner.refDistance /
      (panner.refDistance +
        panner.rolloffFactor * (distance - panner.refDistance));
    const outputGain =
      context.gains[0].gain.value * context.gains[1].gain.value * attenuation;
    assert.ok(outputGain >= 0.25, `Audience cello gain fell to ${outputGain}`);
    const mobileDistance = 12.5;
    const mobileAttenuation =
      panner.refDistance /
      (panner.refDistance +
        panner.rolloffFactor * (mobileDistance - panner.refDistance));
    assert.ok(
      context.gains[0].gain.value *
        context.gains[1].gain.value *
        mobileAttenuation >=
        0.25,
      "Wider mobile audience camera must retain an audible cello",
    );
    audio.update({ ...frame, listener: [0.7, 0.3, 3.5] });
    assert.equal(context.listener.positionZ.value, 3.5);
    assert.ok(context.sources.every((source) => source.started.length === 1));
    audio.setVolume(0.2);
    assert.equal(context.gains[0].gain.value, 0.2);
    audio.setMuted(true);
    assert.equal(context.gains[0].gain.value, 0);
    audio.setMuted(false);
    assert.equal(context.gains[0].gain.value, 0.2);
  } finally {
    audio.dispose();
  }
  assert.ok(
    context.sources.every(
      (source) => source.disconnected && source.stopped.length === 1,
    ),
  );
  assert.equal(context.closed, true);
});

test("leaving while audio loads cancels activation and late downloads cannot create voices", async () => {
  const context = new Context();
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const signals: AbortSignal[] = [];
  const audio = new ExperienceAudio(factory(context), async (_url, options) => {
    signals.push(options?.signal as AbortSignal);
    await pending;
    return response();
  });
  const activation = audio.enable();
  await Promise.resolve();
  audio.stop();
  release();
  assert.equal(await activation, false);
  audio.dispose();
  assert.ok(signals.every((signal) => signal.aborted));
  assert.equal(context.sources.length, 0);
  assert.equal(context.closed, true);
});

test("rapid stop and restart releases the previous graph as well as the current one", async () => {
  const contexts: Context[] = [];
  const audio = new ExperienceAudio(
    () => {
      const context = new Context();
      contexts.push(context);
      return context as unknown as AudioContext;
    },
    async () => response(),
  );
  await audio.enable();
  audio.stop();
  await audio.enable();
  assert.equal(contexts[0].closed, true);
  audio.dispose();
  assert.equal(contexts[1].closed, true);
});

test("repeat play reuses decoded recordings while keeping each activation's voices independent", async () => {
  const contexts: Context[] = [];
  let fetches = 0;
  const audio = new ExperienceAudio(
    () => {
      const context = new Context();
      contexts.push(context);
      return context as unknown as AudioContext;
    },
    async () => {
      fetches++;
      return response();
    },
  );
  await audio.enable();
  audio.stop(true);
  await audio.enable();
  assert.equal(fetches, experienceAudioAssets.length);
  assert.equal(contexts.length, 2);
  assert.equal(contexts[0].sources.length, 3);
  assert.equal(contexts[1].sources.length, 3);
  assert.notEqual(contexts[0].sources[0], contexts[1].sources[0]);
  audio.dispose();
});

test("the leadership selection retains the existing work previews and status qualifications", () => {
  const content = getExperienceHomeContent();
  assert.deepEqual(content.hero, homeContent.hero);
  assert.deepEqual(content.metrics, homeContent.metrics);
  assert.deepEqual(content.positioning, homeContent.positioning);
  assert.deepEqual(
    content.work.map((entry) => entry.slug),
    ["product-practice", "chatgpt-enterprise", "cresta-coaching"],
  );
  const retained = new Set(
    [...content.work, ...content.supportingWork].map((entry) => entry.slug),
  );
  for (const slug of homeContent.featuredWork) assert.ok(retained.has(slug));
  assert.deepEqual(
    content.products.map((entry) => entry.slug),
    homeContent.featuredProducts,
  );
  assert.deepEqual(
    content.thinking.map((entry) => entry.slug),
    homeContent.featuredThinking,
  );
  assert.deepEqual(
    content.creative.map((entry) => entry.slug),
    ["jumping-on-coals", "tabletop-symphony", "gravity-astra"],
  );
  for (const product of content.products)
    assert.equal(product.status, getProductEntry(product.slug)?.status);
  assert.ok(content.recommendations.every((group) => group.people.length > 0));
});

test("an unavailable audio file fails closed and leaves no graph running", async () => {
  const context = new Context();
  const audio = new ExperienceAudio(
    factory(context),
    async () => new Response(null, { status: 404 }),
  );
  await assert.rejects(audio.enable(), /music excerpt/);
  assert.equal(context.closed, true);
  assert.equal(context.sources.length, 0);
  audio.dispose();
});

test("the preview supports the human assistant while remaining excluded from agent tools and discovery", () => {
  assert.equal(portfolioAssistantAvailable("/experience/"), true);
  assert.equal(portfolioWebMCPAvailable("/experience/"), false);
  assert.equal(
    portfolioWebMCPAvailable("/experience/cases/cresta-coaching"),
    false,
  );
  assert.equal(
    portfolioAssistantAvailable("/experience/cases/cresta-coaching"),
    true,
  );
  for (const path of [
    "/",
    "/creative/gravity/astra",
    "/products/ai-career-operating-system",
  ]) {
    assert.equal(portfolioAssistantAvailable(path), true);
    assert.equal(portfolioWebMCPAvailable(path), true);
  }
  assert.ok(sitemap().every((entry) => !entry.url.endsWith("/experience")));
});

test("the illustrative evidence excerpt is present in the authored public source", async () => {
  const source = await readFile(
    new URL(
      "../../components/ai-career-system/CaseStudyOverview.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(source.replace(/\s+/g, " ").includes(evidenceExample.quote));
});

test("recommendations represent every existing collaborator once, preserving quotes and relationship evidence", () => {
  const groups = getExperienceHomeContent().recommendations;
  const people = groups.flatMap((group) => group.people);
  assert.equal(new Set(people.map((person) => person.id)).size, people.length);
  assert.deepEqual(
    people.map((person) => person.id).sort(),
    testimonials.map((person) => person.id).sort(),
  );
  assert.deepEqual(
    groups.map((group) => group.label),
    [
      "Leadership & strategy",
      "Engineering & security",
      "Product & design",
      "Business & insights",
      "Creative collaboration",
    ],
  );
  for (const person of people) {
    const source = testimonials.find((item) => item.id === person.id)!;
    assert.equal(person.quote, source.short);
    assert.equal(person.title, source.title);
    assert.equal(person.relationship, source.roleLabel);
    assert.equal(person.capacity, source.relationshipCapacity);
    assert.equal(person.href, source.profileUrl);
  }
});
