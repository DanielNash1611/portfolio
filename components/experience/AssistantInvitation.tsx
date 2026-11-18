"use client";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useState, type FormEvent } from "react";
import { usePortfolioAssistant } from "@/components/portfolio/PortfolioAssistantProvider";

export default function AssistantInvitation() {
  const assistant = usePortfolioAssistant();
  const [question, setQuestion] = useState("");
  function open(input?: string) {
    if (input?.trim()) assistant?.setDraft(input.trim());
    assistant?.open();
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    open(question);
  }
  if (!assistant?.enabled) return null;
  return (
    <div className="experience-assistant-invitation">
      <p className="experience-home-eyebrow">
        <MessageSquare size={17} aria-hidden="true" /> Portfolio assistant
      </p>
      <h3>Bring your questions.</h3>
      <p>
        Explore my responsibility, the decisions behind the work, and the
        evidence that supports it.
      </p>
      <form onSubmit={submit}>
        <label htmlFor="experience-assistant-question">
          What would you like to know?
        </label>
        <textarea
          id="experience-assistant-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={4000}
          rows={2}
          placeholder="I’m hiring an AI product leader. Where should I start?"
        />
        <button type="submit">
          Open the assistant <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </form>
      <div
        className="experience-assistant-examples"
        aria-label="Example questions"
      >
        {[
          "What was Daniel responsible for?",
          "Which work fits an AI product leadership role?",
          "How does the creative work connect?",
        ].map((prompt) => (
          <button key={prompt} type="button" onClick={() => open(prompt)}>
            {prompt}
            <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        ))}
      </div>
      <small>
        Ask here while you explore. Answers link back to their sources.
      </small>
    </div>
  );
}
