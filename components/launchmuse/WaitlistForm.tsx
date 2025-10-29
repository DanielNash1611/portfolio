"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import Toast from "@/components/launchmuse/Toast";

type RoleOption = "Artist" | "Manager" | "Label" | "Other" | "";

interface FormState {
  email: string;
  name: string;
  role: RoleOption;
  consent: boolean;
  company: string;
}

type FormErrors = Partial<Record<keyof FormState, string>> & {
  general?: string;
};

const emailRegex =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const roleOptions: Exclude<RoleOption, "">[] = [
  "Artist",
  "Manager",
  "Label",
  "Other"
];

const WaitlistForm = (): JSX.Element => {
  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    role: "",
    consent: false,
    company: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fieldIds = useMemo(
    () => ({
      email: "launchmuse-email",
      name: "launchmuse-name",
      role: "launchmuse-role",
      consent: "launchmuse-consent",
      company: "launchmuse-company",
      emailHint: "launchmuse-email-hint",
      roleHint: "launchmuse-role-hint",
      consentHint: "launchmuse-consent-hint"
    }),
    []
  );

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.company.trim().length > 0) {
      nextErrors.company = "Invalid submission.";
    }

    return nextErrors;
  };

  const handleChange =
    <Field extends keyof FormState>(field: Field) =>
    (
      value:
        | FormState[Field]
        | ((previous: FormState[Field]) => FormState[Field])
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]:
          typeof value === "function"
            ? (value as (prev: FormState[Field]) => FormState[Field])(
                previous[field]
              )
            : value
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrors({});

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setToast({
        message: "Please fix the highlighted fields.",
        variant: "error"
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/launchmuse/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email.trim(),
          name: form.name.trim(),
          role: form.role,
          consent: form.consent,
          company: form.company
        })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        const errorMessage =
          result?.error ??
          "We couldn’t add you right now. Please try again shortly.";
        setErrors((prev) => ({ ...prev, general: errorMessage }));
        setToast({ message: errorMessage, variant: "error" });
        return;
      }

      setSuccessMessage("Thanks! You’re on the early access list.");
      setToast({
        message: "Success! You’re on the LaunchMuse waitlist.",
        variant: "success"
      });
      setForm({
        email: "",
        name: "",
        role: "",
        consent: false,
        company: ""
      });
    } catch (error) {
      console.error(error);
      const message =
        "Unexpected error. Please try again or email hello@danielnash.com.";
      setErrors((prev) => ({ ...prev, general: message }));
      setToast({ message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
        aria-describedby={errors.general ? "launchmuse-form-error" : undefined}
      >
        <div className="space-y-2">
          <label
            htmlFor={fieldIds.email}
            className="text-sm font-medium text-brand-teal"
          >
            Email
          </label>
          <p
            id={fieldIds.emailHint}
            className="text-xs text-brand-slate/70"
          >
            Required — we’ll send your invite here.
          </p>
          <input
            id={fieldIds.email}
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => handleChange("email")(event.target.value)}
            required
            className="w-full rounded-xl border border-brand-tan bg-brand-cream px-4 py-3 text-brand-teal shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            aria-describedby={`${fieldIds.emailHint}${
              errors.email ? ` launchmuse-error-email` : ""
            }`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email ? (
            <p
              id="launchmuse-error-email"
              className="text-sm text-brand-orange"
              role="alert"
            >
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor={fieldIds.name}
            className="text-sm font-medium text-brand-teal"
          >
            Name (optional)
          </label>
          <input
            id={fieldIds.name}
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => handleChange("name")(event.target.value)}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream px-4 py-3 text-brand-teal shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name ? (
            <p className="text-sm text-brand-orange" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor={fieldIds.role}
            className="text-sm font-medium text-brand-teal"
          >
            Role
          </label>
          <p id={fieldIds.roleHint} className="text-xs text-brand-slate/70">
            Helps tailor campaigns to the right starting point.
          </p>
          <select
            id={fieldIds.role}
            name="role"
            value={form.role}
            onChange={(event) =>
              handleChange("role")(event.target.value as RoleOption)
            }
            className="w-full rounded-xl border border-brand-tan bg-brand-cream px-4 py-3 text-brand-teal shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            aria-describedby={fieldIds.roleHint}
          >
            <option value="">Select role</option>
            {roleOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              id={fieldIds.consent}
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={(event) => handleChange("consent")(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border border-brand-tan bg-brand-cream accent-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              aria-describedby={fieldIds.consentHint}
            />
            <div>
              <label
                htmlFor={fieldIds.consent}
                className="text-sm font-medium text-brand-teal"
              >
                I agree to receive LaunchMuse updates and early access invites.
              </label>
              <p
                id={fieldIds.consentHint}
                className="text-xs text-brand-slate/70"
              >
                You can unsubscribe any time.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden">
          <label htmlFor={fieldIds.company}>Company</label>
          <input
            id={fieldIds.company}
            type="text"
            name="company"
            autoComplete="off"
            value={form.company}
            onChange={(event) => handleChange("company")(event.target.value)}
            tabIndex={-1}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={submitting} className="rounded-full">
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Joining waitlist…
              </span>
            ) : (
              "Join waitlist"
            )}
          </Button>
          {successMessage ? (
            <p
              className="text-sm text-brand-teal"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </p>
          ) : null}
          {errors.general ? (
            <p
              id="launchmuse-form-error"
              className="text-sm text-brand-orange"
              role="alert"
            >
              {errors.general}
            </p>
          ) : null}
        </div>
      </form>
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <Toast
            message={toast.message}
            variant={toast.variant}
            onDismiss={() => setToast(null)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default WaitlistForm;
