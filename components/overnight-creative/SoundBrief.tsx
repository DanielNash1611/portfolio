"use client";

import { useState } from "react";
import styles from "./sound-seeker.module.css";

export default function SoundBrief() {
  const [reference, setReference] = useState(""),
    [detail, setDetail] = useState(""),
    [gear, setGear] = useState(""),
    [budget, setBudget] = useState(""),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  const prompt = [
    reference.trim()
      ? `I'm exploring the sound of ${reference.trim()}.`
      : "I'm exploring [song or artist].",
    detail.trim()
      ? `Focus on ${detail.trim()}.`
      : "Focus on [the part or sonic detail].",
    gear.trim() ? `I have ${gear.trim()}.` : "",
    budget.trim() ? `My budget is ${budget.trim()}.` : "",
    "Suggest a practical starting setup and playing techniques. Separate documented recording facts from suggested ways to approximate the sound.",
  ]
    .filter(Boolean)
    .join(" ");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  const resetStatus = () => {
    setCopied(false);
    setCopyError(false);
  };
  return (
    <section
      className={styles.brief}
      aria-labelledby="brief-title"
      id="sound-brief"
    >
      <div className={styles.briefIntro}>
        <p className={styles.eyebrow}>02 / Shape the question</p>
        <h2 id="brief-title">
          A better brief.
          <br />A useful starting point.
        </h2>
        <p>
          Pick out what matters in the reference, then add the instrument and
          gear you have. Build a question here before using the prototype.
        </p>
        <p className={styles.localLabel}>Local writing aid · no AI request</p>
      </div>
      <div className={styles.briefFields} onChange={resetStatus}>
        <div className={styles.inputPair}>
          <label>
            Song or artist
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Just Like Heaven — The Cure"
            />
          </label>
          <label>
            The detail you hear
            <input
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g. the bright, moving guitar in the chorus"
            />
          </label>
        </div>
        <div className={styles.inputPair}>
          <label>
            Your instrument and gear
            <input
              value={gear}
              onChange={(e) => setGear(e.target.value)}
              placeholder="e.g. electric guitar, clean amp, chorus pedal"
            />
          </label>
          <label>
            Budget, if relevant
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. use what I have, no purchases"
            />
          </label>
        </div>
        <div className={styles.draft}>
          <p className={styles.eyebrow}>
            Your question / editable inputs above
          </p>
          <p>{prompt}</p>
          <div>
            <button onClick={copy}>
              {copied ? "Question copied" : "Copy this question"}
            </button>
            <a href="#tone-workspace">Back to the prototype ↑</a>
          </div>
          <p role="status" className={styles.copyStatus}>
            {copyError
              ? "Copy unavailable. Select the question text above and copy it manually."
              : copied
                ? "Copied. Paste it into “What sound are you chasing?” above when you’re ready."
                : "Copying does not submit a prompt or generate a recommendation."}
          </p>
        </div>
      </div>
    </section>
  );
}
