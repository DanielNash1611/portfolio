import clsx from "clsx";

type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-brand-teal text-white",
  error: "bg-brand-orange text-white"
};

const Toast = ({
  message,
  variant = "success",
  onDismiss
}: ToastProps): JSX.Element => {
  const role = variant === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      className={clsx(
        "pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange",
        variantStyles[variant]
      )}
    >
      <span className="text-sm font-medium">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-white/40 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Close
        </button>
      ) : null}
    </div>
  );
};

export default Toast;
