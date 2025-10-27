"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/Button";

type Status = "idle" | "loading" | "success" | "error";

const ContactForm = (): JSX.Element => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      setStatus("success");
      setMessage("Thanks for reaching out! I’ll be in touch soon.");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Sorry, there was an issue sending your message. Try again?");
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      aria-describedby={message ? "form-status" : undefined}
    >
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
