"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  createResumeJob,
  pollResumeJob,
  requestEmailDelivery,
  resumeDownloadUrl,
  ResumeClientError,
} from "@/lib/resume-generator/client";
import {
  RESUME_FILE_MAX_BYTES,
  RESUME_JD_MAX_CHARS,
  RESUME_PROGRESS_ORDER,
  RESUME_STATUS_LABELS,
  type JobStatusResponse,
  type ResumeJobStatus,
} from "@/lib/resume-generator/types";
import { siteConfig } from "@/content/portfolio";

type DeliveryMode = "download" | "email";

type FormError = { title: string; message: string };

const TEXT_FILE_TYPES = [".txt", ".md", ".text"];

function errorTitleForCode(code: string): string {
  switch (code) {
    case "unavailable":
      return "Service unavailable";
    case "payload_too_large":
    case "invalid_jd":
      return "Job description issue";
    case "rate_limited":
      return "Too many requests";
    case "expired":
      return "Download expired";
    case "network":
      return "Connection problem";
    default:
      return "Generation failed";
  }
}

function formatExpiry(expiresAt: string): string {
  try {
    return new Date(expiresAt).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "about an hour from now";
  }
}

export default function ResumeGenerator(): JSX.Element {
  const [jdText, setJdText] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [company, setCompany] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("download");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [ccDaniel, setCcDaniel] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);
  const [fileNote, setFileNote] = useState<string | null>(null);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatusResponse | null>(null);

  const [emailState, setEmailState] = useState<
    "idle" | "sending" | "done" | "error"
  >("idle");
  const [emailMessage, setEmailMessage] = useState<string>("");

  const abortRef = useRef<AbortController | null>(null);

  // Drive polling whenever we have an active, non-terminal job.
  useEffect(() => {
    if (!jobId) {
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;

    pollResumeJob(jobId, {
      onUpdate: setStatus,
      signal: controller.signal,
    })
      .then(setStatus)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const code =
          error instanceof ResumeClientError ? error.code : "engine_failed";
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while generating your resume.";
        setFormError({ title: errorTitleForCode(code), message });
        setJobId(null);
      });

    return () => controller.abort();
  }, [jobId]);

  function resetToForm(): void {
    abortRef.current?.abort();
    setJobId(null);
    setStatus(null);
    setEmailState("idle");
    setEmailMessage("");
  }

  async function handleFile(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    setFileNote(null);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > RESUME_FILE_MAX_BYTES) {
      setFormError({
        title: "File too large",
        message: `That file is larger than ${(RESUME_FILE_MAX_BYTES / (1024 * 1024)).toFixed(0)} MB. Please upload a smaller file or paste the text instead.`,
      });
      event.target.value = "";
      return;
    }

    const isTextFile =
      file.type.startsWith("text/") ||
      TEXT_FILE_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isTextFile) {
      // TODO: server-side extraction for PDF/DOCX uploads is owned by the
      // engine integration. For now, only plain-text files are read in-browser.
      setFileNote(
        "We can read .txt and .md files directly. For PDF or Word files, please paste the job description text below.",
      );
      event.target.value = "";
      return;
    }

    const text = await file.text();
    setJdText(text.slice(0, RESUME_JD_MAX_CHARS));
    setFileNote(`Loaded ${file.name}. You can edit the text before generating.`);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const trimmed = jdText.trim();
    if (!trimmed) {
      setFormError({
        title: "Job description required",
        message: "Please paste a job description to generate a tailored resume.",
      });
      return;
    }
    if (trimmed.length > RESUME_JD_MAX_CHARS) {
      setFormError({
        title: "Job description too long",
        message: `Please keep the job description under ${RESUME_JD_MAX_CHARS.toLocaleString()} characters.`,
      });
      return;
    }
    if (deliveryMode === "email") {
      const email = recipientEmail.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormError({
          title: "Email required",
          message: "Please enter a valid email address for delivery.",
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const created = await createResumeJob({
        jobDescription: {
          text: trimmed,
          company: company.trim() || undefined,
          roleTitle: roleTitle.trim() || undefined,
        },
      });
      setStatus({
        jobId: created.jobId,
        status: created.status,
        progress: { phase: created.status, percent: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: created.expiresAt,
        result: null,
        error: null,
      });
      setJobId(created.jobId);
    } catch (error) {
      const code =
        error instanceof ResumeClientError ? error.code : "engine_failed";
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't start generation right now. Please try again.";
      setFormError({ title: errorTitleForCode(code), message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailDelivery(): Promise<void> {
    if (!jobId) {
      return;
    }
    setEmailState("sending");
    setEmailMessage("");
    try {
      const result = await requestEmailDelivery(jobId, {
        recipientEmail: recipientEmail.trim(),
        ccDaniel,
      });
      setEmailState("done");
      setEmailMessage(
        result.message ??
          (result.emailed
            ? "Sent. Check your inbox."
            : "Request received."),
      );
    } catch (error) {
      setEmailState("error");
      setEmailMessage(
        error instanceof Error
          ? error.message
          : "We couldn't send the email. Your download is still available.",
      );
    }
  }

  const currentStatus = status?.status;
  const isTracking =
    Boolean(jobId) &&
    currentStatus !== "ready" &&
    currentStatus !== "failed" &&
    currentStatus !== "expired";

  // ---- Render: form ----
  if (!jobId && currentStatus !== "ready") {
    return (
      <div className="space-y-6">
        {formError ? <ErrorBanner error={formError} /> : null}
        <ResumeForm
          jdText={jdText}
          setJdText={setJdText}
          roleTitle={roleTitle}
          setRoleTitle={setRoleTitle}
          company={company}
          setCompany={setCompany}
          deliveryMode={deliveryMode}
          setDeliveryMode={setDeliveryMode}
          recipientEmail={recipientEmail}
          setRecipientEmail={setRecipientEmail}
          ccDaniel={ccDaniel}
          setCcDaniel={setCcDaniel}
          fileNote={fileNote}
          onFile={handleFile}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  // ---- Render: ready ----
  if (currentStatus === "ready" && status?.result) {
    return (
      <ReadyPanel
        status={status}
        deliveryMode={deliveryMode}
        recipientEmail={recipientEmail}
        ccDaniel={ccDaniel}
        emailState={emailState}
        emailMessage={emailMessage}
        onEmail={handleEmailDelivery}
        onRestart={resetToForm}
      />
    );
  }

  // ---- Render: failed ----
  if (currentStatus === "failed") {
    return (
      <TerminalPanel
        title="Generation failed"
        tone="error"
        body={
          status?.error?.message ??
          "The resume couldn't be generated. Please try again."
        }
        onRestart={resetToForm}
      />
    );
  }

  // ---- Render: expired ----
  if (currentStatus === "expired") {
    return (
      <TerminalPanel
        title="Download expired"
        tone="warning"
        body="This resume's temporary download window has passed. Generate a fresh one — it only takes a few minutes."
        onRestart={resetToForm}
      />
    );
  }

  // ---- Render: tracking ----
  return (
    <StatusTracker
      status={status}
      isTracking={isTracking}
      onCancel={resetToForm}
    />
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[color:var(--color-slate)] shadow-sm outline-none transition focus:border-[color:var(--color-teal)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)]";

const labelClass =
  "block text-sm font-semibold text-[color:var(--color-slate)]";

function ErrorBanner({ error }: { error: FormError }): JSX.Element {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-[color:var(--color-orange)]/30 bg-[color:var(--color-orange)]/8 px-4 py-3 text-sm text-[color:var(--color-slate)]"
    >
      <p className="font-semibold text-[color:var(--color-orange)]">
        {error.title}
      </p>
      <p className="mt-1 text-[color:var(--color-slate)]/80">{error.message}</p>
    </div>
  );
}

type ResumeFormProps = {
  jdText: string;
  setJdText: (v: string) => void;
  roleTitle: string;
  setRoleTitle: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  deliveryMode: DeliveryMode;
  setDeliveryMode: (v: DeliveryMode) => void;
  recipientEmail: string;
  setRecipientEmail: (v: string) => void;
  ccDaniel: boolean;
  setCcDaniel: (v: boolean) => void;
  fileNote: string | null;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function ResumeForm(props: ResumeFormProps): JSX.Element {
  const remaining = RESUME_JD_MAX_CHARS - props.jdText.length;

  return (
    <form
      onSubmit={props.onSubmit}
      className="space-y-6 rounded-[1.75rem] border border-black/6 bg-white/84 p-6 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:p-8"
    >
      <div className="space-y-2">
        <label htmlFor="jd" className={labelClass}>
          Job description
        </label>
        <p className="text-sm text-[color:var(--color-slate)]/70">
          Paste the full job description. It is sent securely and is never placed
          in a URL.
        </p>
        <textarea
          id="jd"
          name="jd"
          required
          rows={12}
          value={props.jdText}
          onChange={(e) => props.setJdText(e.target.value)}
          placeholder="Paste the job description here…"
          className={`${inputClass} resize-y font-[inherit]`}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[color:var(--color-slate)]/60">
          <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-[color:var(--color-teal)]">
            <span>Upload a .txt or .md file</span>
            <input
              type="file"
              accept=".txt,.md,.text,text/plain,text/markdown"
              onChange={props.onFile}
              className="sr-only"
            />
            <span className="rounded-full border border-[color:var(--color-teal)]/20 bg-white px-3 py-1">
              Choose file
            </span>
          </label>
          <span className={remaining < 0 ? "text-[color:var(--color-orange)]" : ""}>
            {remaining.toLocaleString()} characters left
          </span>
        </div>
        {props.fileNote ? (
          <p className="text-xs text-[color:var(--color-slate)]/70">
            {props.fileNote}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="roleTitle" className={labelClass}>
            Role title <span className="font-normal text-[color:var(--color-slate)]/55">(optional)</span>
          </label>
          <input
            id="roleTitle"
            name="roleTitle"
            value={props.roleTitle}
            onChange={(e) => props.setRoleTitle(e.target.value)}
            placeholder="e.g. Senior Product Manager"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="company" className={labelClass}>
            Company <span className="font-normal text-[color:var(--color-slate)]/55">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            value={props.company}
            onChange={(e) => props.setCompany(e.target.value)}
            placeholder="e.g. Acme"
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className={labelClass}>How would you like to receive it?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <DeliveryOption
            active={props.deliveryMode === "download"}
            title="Download here"
            description="Keep this page open and download the PDF when it's ready. No email required."
            onSelect={() => props.setDeliveryMode("download")}
          />
          <DeliveryOption
            active={props.deliveryMode === "email"}
            title="Email me when ready"
            description="We'll send the PDF to your inbox so you don't have to wait on this page."
            onSelect={() => props.setDeliveryMode("email")}
          />
        </div>

        {props.deliveryMode === "email" ? (
          <div className="space-y-3 rounded-2xl border border-[color:var(--color-teal)]/14 bg-[color:var(--color-cream)]/60 p-4">
            <div className="space-y-2">
              <label htmlFor="recipientEmail" className={labelClass}>
                Your email
              </label>
              <input
                id="recipientEmail"
                name="recipientEmail"
                type="email"
                value={props.recipientEmail}
                onChange={(e) => props.setRecipientEmail(e.target.value)}
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[color:var(--color-slate)]/80">
              <input
                type="checkbox"
                checked={props.ccDaniel}
                onChange={(e) => props.setCcDaniel(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-black/20 text-[color:var(--color-teal)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)]"
              />
              <span>
                Include Daniel on the email thread for easy follow-up.
                <span className="block text-xs text-[color:var(--color-slate)]/55">
                  Off by default. If unchecked, the email still includes contact
                  links so you can reach Daniel in one click.
                </span>
              </span>
            </label>
          </div>
        ) : null}
      </fieldset>

      <div className="rounded-2xl border border-dashed border-[color:var(--color-teal)]/20 bg-[color:var(--color-cream)]/55 px-4 py-3 text-sm text-[color:var(--color-slate)]/75">
        Generation usually takes <strong>about 10 minutes</strong>. The resume is
        built only from Daniel&apos;s verified experience — it never invents
        employers, titles, dates, or outcomes.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={props.submitting}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-teal)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {props.submitting ? "Starting…" : "Generate tailored resume"}
        </button>
        <Link
          href={siteConfig.contactHref}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-teal)]/16 bg-white px-6 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2"
        >
          Contact Daniel directly
        </Link>
      </div>
    </form>
  );
}

function DeliveryOption({
  active,
  title,
  description,
  onSelect,
}: {
  active: boolean;
  title: string;
  description: string;
  onSelect: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] ${
        active
          ? "border-[color:var(--color-teal)] bg-[color:var(--color-teal)]/6"
          : "border-black/10 bg-white hover:border-[color:var(--color-teal)]/40"
      }`}
    >
      <span className="block text-sm font-semibold text-[color:var(--color-slate)]">
        {title}
      </span>
      <span className="mt-1 block text-xs leading-5 text-[color:var(--color-slate)]/70">
        {description}
      </span>
    </button>
  );
}

function StatusTracker({
  status,
  isTracking,
  onCancel,
}: {
  status: JobStatusResponse | null;
  isTracking: boolean;
  onCancel: () => void;
}): JSX.Element {
  const current = status?.status ?? "queued";
  const percent = status?.progress?.percent ?? 0;
  const detail = status?.progress?.detail;

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-black/6 bg-white/84 p-6 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-teal)]/68">
          Generating
        </p>
        <h2 className="text-2xl font-semibold text-[color:var(--color-slate)]">
          {RESUME_STATUS_LABELS[current]}
        </h2>
        <p className="text-sm text-[color:var(--color-slate)]/70">
          {detail ??
            "This usually takes about 10 minutes. You can keep this page open, or choose email delivery next time to step away."}
        </p>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-cream)]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[color:var(--color-teal)] transition-all duration-700"
          style={{ width: `${Math.max(4, percent)}%` }}
        />
      </div>

      <ol className="space-y-2">
        {RESUME_PROGRESS_ORDER.filter((s) => s !== "ready").map((step) => {
          const state = stepState(step, current);
          return (
            <li
              key={step}
              className="flex items-center gap-3 text-sm"
              aria-current={state === "active" ? "step" : undefined}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  state === "done"
                    ? "border-[color:var(--color-teal)] bg-[color:var(--color-teal)] text-[color:var(--color-cream)]"
                    : state === "active"
                      ? "border-[color:var(--color-teal)] text-[color:var(--color-teal)]"
                      : "border-black/15 text-transparent"
                }`}
              >
                {state === "done" ? "✓" : "•"}
              </span>
              <span
                className={
                  state === "pending"
                    ? "text-[color:var(--color-slate)]/45"
                    : "text-[color:var(--color-slate)]"
                }
              >
                {RESUME_STATUS_LABELS[step]}
              </span>
              {state === "active" ? (
                <span className="ml-auto text-xs text-[color:var(--color-teal)]/70">
                  in progress
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {isTracking ? (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-[color:var(--color-slate)]/60 underline-offset-2 hover:underline"
        >
          Cancel and start over
        </button>
      ) : null}
    </div>
  );
}

function stepState(
  step: ResumeJobStatus,
  current: ResumeJobStatus,
): "done" | "active" | "pending" {
  const order = RESUME_PROGRESS_ORDER;
  const stepIndex = order.indexOf(step);
  const currentIndex = order.indexOf(current);
  if (currentIndex < 0) {
    return "pending";
  }
  if (stepIndex < currentIndex) {
    return "done";
  }
  if (stepIndex === currentIndex) {
    return "active";
  }
  return "pending";
}

function ReadyPanel({
  status,
  deliveryMode,
  recipientEmail,
  ccDaniel,
  emailState,
  emailMessage,
  onEmail,
  onRestart,
}: {
  status: JobStatusResponse;
  deliveryMode: DeliveryMode;
  recipientEmail: string;
  ccDaniel: boolean;
  emailState: "idle" | "sending" | "done" | "error";
  emailMessage: string;
  onEmail: () => void;
  onRestart: () => void;
}): JSX.Element {
  const result = status.result!;
  const downloadHref = result.downloadUrl || resumeDownloadUrl(status.jobId);

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-black/6 bg-white/84 p-6 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-teal)]/68">
          Ready
        </p>
        <h2 className="text-2xl font-semibold text-[color:var(--color-slate)]">
          Your tailored resume is ready
        </h2>
        {result.fitSummary ? (
          <p className="text-sm text-[color:var(--color-slate)]/72">
            {result.fitSummary}
          </p>
        ) : null}
        <p className="text-xs text-[color:var(--color-slate)]/55">
          Available to download until about {formatExpiry(status.expiresAt)}.
          After that, generate a fresh copy.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={downloadHref}
          download={result.filename}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-teal)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2"
        >
          Download PDF
        </a>
        <span className="font-mono text-xs text-[color:var(--color-slate)]/55">
          {result.filename}
        </span>
      </div>

      {deliveryMode === "email" ? (
        <div className="space-y-3 rounded-2xl border border-[color:var(--color-teal)]/14 bg-[color:var(--color-cream)]/60 p-4">
          <p className="text-sm text-[color:var(--color-slate)]/80">
            Send a copy to <strong>{recipientEmail}</strong>
            {ccDaniel ? " and CC Daniel" : ""}.
          </p>
          <button
            type="button"
            onClick={onEmail}
            disabled={emailState === "sending" || emailState === "done"}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-teal)]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] disabled:opacity-60"
          >
            {emailState === "sending"
              ? "Sending…"
              : emailState === "done"
                ? "Request sent"
                : "Email me this resume"}
          </button>
          {emailMessage ? (
            <p
              className={`text-xs ${
                emailState === "error"
                  ? "text-[color:var(--color-orange)]"
                  : "text-[color:var(--color-slate)]/70"
              }`}
            >
              {emailMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
        <button
          type="button"
          onClick={onRestart}
          className="font-medium text-[color:var(--color-teal)] underline-offset-2 hover:underline"
        >
          Generate another
        </button>
        <Link
          href={siteConfig.contactHref}
          className="font-medium text-[color:var(--color-slate)]/70 underline-offset-2 hover:underline"
        >
          Contact Daniel directly
        </Link>
      </div>
    </div>
  );
}

function TerminalPanel({
  title,
  body,
  tone,
  onRestart,
}: {
  title: string;
  body: string;
  tone: "error" | "warning";
  onRestart: () => void;
}): JSX.Element {
  return (
    <div className="space-y-5 rounded-[1.75rem] border border-black/6 bg-white/84 p-6 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:p-8">
      <div className="space-y-2">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.26em] ${
            tone === "error"
              ? "text-[color:var(--color-orange)]"
              : "text-[color:var(--color-teal)]/68"
          }`}
        >
          {tone === "error" ? "Something went wrong" : "Heads up"}
        </p>
        <h2 className="text-2xl font-semibold text-[color:var(--color-slate)]">
          {title}
        </h2>
        <p className="text-sm text-[color:var(--color-slate)]/72">{body}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-teal)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href={siteConfig.contactHref}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-teal)]/16 bg-white px-6 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)]"
        >
          Contact Daniel directly
        </Link>
      </div>
    </div>
  );
}
