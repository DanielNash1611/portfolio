type ResponsiveVideoEmbedProps = {
  title: string;
  src: string;
};

export default function ResponsiveVideoEmbed({
  title,
  src,
}: ResponsiveVideoEmbedProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/6 bg-[color:var(--color-slate)] shadow-[0_24px_60px_rgba(58,61,64,0.18)]">
      <div className="relative aspect-video w-full">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
