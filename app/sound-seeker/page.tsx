import { SoundSeekerWidget } from "@/components/sound-seeker/SoundSeekerWidget";

export default function SoundSeekerPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Prototype</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Sound Seeker</h1>
          <p className="text-lg leading-relaxed text-slate-300">
            An AI-powered gear consultant that helps you recreate iconic tones.
          </p>
        </div>
        <div className="mt-10">
          <SoundSeekerWidget />
        </div>
      </div>
    </div>
  );
}
