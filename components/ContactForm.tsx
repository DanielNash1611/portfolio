"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";

type Status = "idle" | "loading" | "success" | "error";

const ContactForm = (): JSX.Element => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");

  useEffect(() => {
    setStartedAt(Date.now().toString());
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error ?? "Sorry, there was an issue sending your message.",
        );
      }

      setStatus("success");
      setMessage("Thanks for reaching out! I’ll be in touch soon.");
      form.reset();
      setStartedAt(Date.now().toString());
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Sorry, there was an issue sending your message. Try again?",
      );
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      aria-describedby={message ? "form-status" : undefined}
    >
      <input type="hidden" name="startedAt" value={startedAt} />
      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-brand-teal" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={120}
          className="w-full rounded-2xl border border-brand-slate/20 bg-white px-4 py-3 text-brand-slate shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-brand-teal" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={320}
          className="w-full rounded-2xl border border-brand-slate/20 bg-white px-4 py-3 text-brand-slate shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-brand-teal"
          htmlFor="subject"
        >
          Subject
          <span className="ml-2 text-xs font-normal text-brand-slate/60">
            Optional
          </span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={200}
          className="w-full rounded-2xl border border-brand-slate/20 bg-white px-4 py-3 text-brand-slate shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-brand-teal"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          className="w-full rounded-2xl border border-brand-slate/20 bg-white px-4 py-3 text-brand-slate shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send message"}
        </Button>
        {message ? (
          <p
            id="form-status"
            className={`text-sm ${
              status === "success"
                ? "text-brand-teal"
                : status === "error"
                  ? "text-brand-orange"
                  : "text-brand-slate/80"
            }`}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
};

export default ContactForm;
