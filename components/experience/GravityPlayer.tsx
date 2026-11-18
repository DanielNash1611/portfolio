"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";

/** Mount the actual Gravity app only after explicit entry. Removing the iframe
 * on close/backgrounding also removes its audio and rendering resources. */
export default function GravityPlayer({ onClose }: { onClose(): void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    const hide = () => {
      if (document.hidden) onClose();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      document.removeEventListener("visibilitychange", hide);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose]);
  return (
    <dialog
      ref={dialog}
      className="experience-gravity-player"
      aria-labelledby="gravity-player-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header>
        <div>
          <h2 id="gravity-player-title">Gravity</h2>
          <p>
            The complete spatial composition · Tap “Enter the field” to begin.
          </p>
        </div>
        <a
          href="https://gravity.danielnash.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open separately <ArrowUpRight size={14} />
        </a>
        <button ref={closeButton} onClick={onClose} aria-label="Close Gravity">
          <X size={22} />
        </button>
      </header>
      <iframe
        src="https://gravity.danielnash.co"
        title="Gravity interactive spatial composition"
        allow="autoplay; fullscreen"
        referrerPolicy="strict-origin"
      />
    </dialog>
  );
}
