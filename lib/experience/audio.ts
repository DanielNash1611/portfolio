import type { SpatialFrame } from "./types";

export const experienceAudioAssets = [
  "/audio/gravity/cello-sustain-loop.m4a",
  "/audio/gravity/violin-pattern-1-variation-1.wav",
  "/audio/gravity/violin-pattern-5-variation-1.wav",
] as const;

/** Native Web Audio, deliberately independent of scroll position and scene morphs. */
export class ExperienceAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private voices: {
    source: AudioBufferSourceNode;
    panner: PannerNode;
    gain: GainNode;
  }[] = [];
  private request: AbortController | null = null;
  private revision = 0;
  private releaseTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingRelease: (() => void) | null = null;
  private volume = 0.65;
  private buffers: AudioBuffer[] | null = null;
  private muted = false;
  private disposed = false;
  private frame: SpatialFrame | null = null;

  constructor(
    private readonly createContext = () => new AudioContext(),
    private readonly fetchAsset: typeof fetch = (...args) => fetch(...args),
  ) {}

  async enable() {
    if (this.disposed) return false;
    this.stop(true);
    const revision = this.revision;
    const context = this.createContext();
    this.context = context;
    const request = new AbortController();
    this.request = request;
    try {
      // Called directly from the sound button, before network work loses activation.
      await context.resume();
      const buffers =
        this.buffers ??
        (await Promise.all(
          experienceAudioAssets.map(async (url) => {
            const response = await this.fetchAsset(url, {
              signal: request.signal,
            });
            if (!response.ok)
              throw new Error(
                "A music excerpt could not load. You can try again.",
              );
            return context.decodeAudioData(await response.arrayBuffer());
          }),
        ));
      if (this.disposed || revision !== this.revision || request.signal.aborted)
        return false;
      this.buffers = buffers;
      const master = context.createGain();
      master.gain.value = this.muted ? 0 : this.volume;
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -12;
      compressor.ratio.value = 4;
      master.connect(compressor).connect(context.destination);
      this.master = master;
      const starts = [0, 0.43, 1.17];
      this.voices = buffers.map((buffer, index) => {
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const gain = context.createGain();
        // Original recordings are quiet (roughly -22 / -29 dB RMS). Keep the
        // audience preview audible on phone speakers without flattening space.
        gain.gain.value = [0.85, 1.8, 1.2][index];
        const panner = context.createPanner();
        panner.panningModel = "HRTF";
        panner.distanceModel = "inverse";
        panner.refDistance = 3.5;
        panner.rolloffFactor = 0.4;
        panner.maxDistance = 30;
        source.connect(gain).connect(panner).connect(master);
        source.start(context.currentTime + starts[index]);
        return { source, panner, gain };
      });
      if (this.frame) this.update(this.frame);
      return true;
    } catch (error) {
      if (revision !== this.revision || request.signal.aborted) return false;
      this.stop(true);
      throw error;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.updateGain();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.updateGain();
  }

  private updateGain() {
    if (this.master && this.context)
      this.master.gain.setTargetAtTime(
        this.muted ? 0 : this.volume,
        this.context.currentTime,
        0.025,
      );
  }

  update(frame: SpatialFrame) {
    this.frame = frame;
    if (!this.context) return;
    const now = this.context.currentTime;
    const write = (parameters: AudioParam[], values: readonly number[]) =>
      parameters.forEach((parameter, i) =>
        parameter.setTargetAtTime(values[i], now, 0.025),
      );
    const listener = this.context.listener;
    write(
      [listener.positionX, listener.positionY, listener.positionZ],
      frame.listener,
    );
    write(
      [listener.forwardX, listener.forwardY, listener.forwardZ],
      frame.forward,
    );
    write([listener.upX, listener.upY, listener.upZ], frame.up);
    this.voices.forEach(({ panner }, i) =>
      write(
        [panner.positionX, panner.positionY, panner.positionZ],
        frame.sources[i],
      ),
    );
  }

  stop(immediate = false) {
    this.revision += 1;
    this.request?.abort();
    this.request = null;
    if (this.releaseTimer) clearTimeout(this.releaseTimer);
    this.releaseTimer = null;
    this.pendingRelease?.();
    this.pendingRelease = null;
    const context = this.context;
    const voices = this.voices;
    this.context = null;
    this.voices = [];
    if (!context) return;
    if (this.master)
      this.master.gain.setTargetAtTime(0, context.currentTime, 0.015);
    this.master = null;
    for (const voice of voices) {
      voice.source.stop(context.currentTime + (immediate ? 0 : 0.06));
    }
    const release = () => {
      voices.forEach(({ source, panner, gain }) => {
        source.disconnect();
        panner.disconnect();
        gain.disconnect();
      });
      void context.close().catch(() => {});
    };
    if (immediate) release();
    else {
      this.pendingRelease = release;
      this.releaseTimer = setTimeout(() => {
        release();
        this.releaseTimer = null;
        this.pendingRelease = null;
      }, 90);
    }
  }

  dispose() {
    this.disposed = true;
    this.stop(true);
    this.buffers = null;
  }
}
