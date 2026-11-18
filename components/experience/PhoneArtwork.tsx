import Image from "next/image";
import "./annotation-artwork.css";
export default function PhoneArtwork() {
  return (
    <figure className="experience-phone-artwork">
      <div className="experience-phone-device">
        <span aria-hidden="true" className="experience-phone-speaker" />
        <Image
          src="/images/tabletop-symphony/app-phone.webp"
          alt="Complete Tabletop Symphony mobile interface, with Ready to Listen, scene choices, and playback controls visible in a phone frame."
          width={430}
          height={932}
          sizes="(min-width:900px) 23vw, 65vw"
        />
      </div>
      <figcaption>Tabletop Symphony · Working alpha on mobile</figcaption>
    </figure>
  );
}
