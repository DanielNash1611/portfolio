type ResponsiveVideoPlayerProps = {
  title: string;
  src: string;
  poster?: string;
  aspectClassName?: string;
};

export default function ResponsiveVideoPlayer({
  title,
  src,
  poster,
  aspectClassName = "aspect-video",
}: ResponsiveVideoPlayerProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/6 bg-[color:var(--color-slate)] shadow-[0_24px_60px_rgba(58,61,64,0.18)]">
      <div className={`relative w-full ${aspectClassName}`}>
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster}
          title={title}
          className="absolute inset-0 h-full w-full bg-black object-contain"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
