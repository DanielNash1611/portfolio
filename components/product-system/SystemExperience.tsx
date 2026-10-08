"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Check, Copy, ChevronDown, Users } from "lucide-react";
import {
  isSystemRole,
  systemChapters,
  systemHref,
  systemRoles,
  type SystemRole,
} from "@/content/product-system";

const RoleContext = createContext<{
  role: SystemRole;
  setRole: (role: SystemRole) => void;
}>({ role: "everyone", setRole: () => {} });

type JourneyPosition = {
  demo: { frame: number; elapsed: number };
  workspace: { step: number; view: "tree" | "definition" | "context" };
  projectWorkspace: { step: number; view: "brief" | "context" | "prompt" };
};
type JourneyStore = {
  read: () => JourneyPosition;
  update: (change: Partial<JourneyPosition>) => void;
};
const JourneyContext = createContext<JourneyStore | null>(null);

export function useJourneyPosition() {
  const position = useContext(JourneyContext);
  if (!position)
    throw new Error("Product System requires its shared provider.");
  return position;
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const position = useRef<JourneyPosition>({
    demo: { frame: 0, elapsed: 0 },
    workspace: { step: 0, view: "tree" },
    projectWorkspace: { step: 0, view: "brief" },
  });
  const readPosition = useCallback(() => position.current, []);
  const updatePosition = useCallback((change: Partial<JourneyPosition>) => {
    position.current = { ...position.current, ...change };
  }, []);
  const journey = useMemo(
    () => ({ read: readPosition, update: updatePosition }),
    [readPosition, updatePosition],
  );
  const [role, setRoleState] = useState<SystemRole>("everyone");
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const sync = () => {
      const value = new URLSearchParams(window.location.search).get("role");
      setRoleState(isSystemRole(value) ? value : "everyone");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [pathname]);
  function setRole(value: SystemRole) {
    setRoleState(value);
    const url = new URL(window.location.href);
    if (value === "everyone") url.searchParams.delete("role");
    else url.searchParams.set("role", value);
    router.replace(`${url.pathname}${url.search}${url.hash}`, {
      scroll: false,
    });
  }
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <JourneyContext.Provider value={journey}>
        {children}
      </JourneyContext.Provider>
    </RoleContext.Provider>
  );
}

export function SystemLink({
  chapter = "",
  children,
  className,
  ...props
}: {
  chapter?: string;
  children: ReactNode;
  className?: string;
  "aria-current"?: "page";
  onClick?: () => void;
}) {
  const { role } = useContext(RoleContext);
  return (
    <Link href={systemHref(chapter, role)} className={className} {...props}>
      {children}
    </Link>
  );
}

export function useSystemHref(chapter = "") {
  const { role } = useContext(RoleContext);
  return systemHref(chapter, role);
}

/** One navigation surface, mounted once by the shared route layout. */
export function SystemNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useContext(RoleContext);
  const audience = systemRoles.find((item) => item.id === role)!;
  const [panel, setPanel] = useState<"guide" | "role" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const guideButton = useRef<HTMLButtonElement>(null);
  const roleButton = useRef<HTMLButtonElement>(null);
  const isReference =
    pathname !== "/product-system" && !pathname.endsWith("/playbook");

  useEffect(() => {
    const syncHash = () => {
      setPanel(window.location.hash === "#your-perspective" ? "role" : null);
      // Keep previously shared inline-workspace links useful after consolidation.
      if (
        window.location.hash === "#your-idea" &&
        !pathname.endsWith("/playbook")
      ) {
        const value = new URLSearchParams(window.location.search).get("role");
        router.replace(
          systemHref("playbook", isSystemRole(value) ? value : "everyone"),
        );
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname, router]);

  useEffect(() => {
    if (!panel) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setPanel(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanel(null);
      (panel === "guide" ? guideButton : roleButton).current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [panel]);

  return (
    <div className="system-navigation">
      <div className="system-navigation-inner system-wrap" ref={root}>
        <nav
          aria-label="Product system navigation"
          className="system-primary-nav"
        >
          <SystemLink
            onClick={() => setPanel(null)}
            aria-current={pathname === "/product-system" ? "page" : undefined}
          >
            Watch
          </SystemLink>
          <SystemLink
            onClick={() => setPanel(null)}
            chapter="playbook"
            aria-current={pathname.endsWith("/playbook") ? "page" : undefined}
          >
            Workspace
          </SystemLink>
          <button
            ref={guideButton}
            type="button"
            aria-expanded={panel === "guide"}
            aria-controls="system-field-guide"
            data-active={isReference}
            onClick={() => setPanel(panel === "guide" ? null : "guide")}
          >
            Field guide <ChevronDown size={13} aria-hidden="true" />
          </button>
        </nav>
        <button
          ref={roleButton}
          type="button"
          className="system-perspective-toggle"
          aria-label={`Why should I care? Current perspective: ${audience.label}`}
          aria-expanded={panel === "role"}
          aria-controls="your-perspective"
          onClick={() => setPanel(panel === "role" ? null : "role")}
        >
          <Users size={16} aria-hidden="true" />
          <span className="system-perspective-full">
            Why should I care? <strong>{audience.label}</strong>
          </span>
          <span className="system-perspective-short">Role</span>
          <ChevronDown size={13} aria-hidden="true" />
        </button>
        {panel === "guide" && (
          <div
            className="system-navigation-panel system-field-guide"
            id="system-field-guide"
          >
            <p className="system-eyebrow">Field guide / explore a question</p>
            {systemChapters
              .filter((chapter) => chapter.slug !== "playbook")
              .map((chapter) => (
                <SystemLink
                  key={chapter.slug}
                  onClick={() => setPanel(null)}
                  chapter={chapter.slug}
                  aria-current={
                    pathname.endsWith(`/${chapter.slug}`) ? "page" : undefined
                  }
                >
                  <span>
                    {chapter.title}
                    <small>{chapter.question}</small>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </SystemLink>
              ))}
          </div>
        )}
        {panel === "role" && (
          <div className="system-navigation-panel system-perspective-panel">
            <AudienceLens />
          </div>
        )}
      </div>
    </div>
  );
}

function AudienceLens() {
  const { role, setRole } = useContext(RoleContext);
  const audience = systemRoles.find((item) => item.id === role)!;
  const [shareStatus, setShareStatus] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareStatus("");
    setShareUrl("");
  }, [role]);
  async function copyLink() {
    const url = new URL(window.location.href);
    if (role === "everyone") url.searchParams.delete("role");
    else url.searchParams.set("role", role);
    url.hash = "your-perspective";
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus("Link copied");
      setShareUrl("");
    } catch {
      setShareUrl(url.toString());
      setShareStatus("Select and copy the link below");
    }
  }
  return (
    <section
      id="your-perspective"
      className="system-audience system-audience-compact system-audience-expanded"
      aria-labelledby="audience-title"
    >
      <div className="system-audience-heading">
        <div>
          <p className="system-eyebrow">Make it relevant</p>
          <h2 id="audience-title">Your perspective</h2>
        </div>
      </div>
      <div className="system-role-controls">
        <label htmlFor="system-role">I’m here as a</label>
        <select
          id="system-role"
          value={role}
          onChange={(event) => setRole(event.target.value as SystemRole)}
        >
          {systemRoles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <button type="button" className="system-share" onClick={copyLink}>
          {shareStatus === "Link copied" ? (
            <Check size={15} />
          ) : (
            <Copy size={15} />
          )}{" "}
          Share this perspective
        </button>
        <span className="system-share-status" role="status">
          {shareStatus}
        </span>
      </div>
      {shareUrl && (
        <input
          className="system-share-url"
          aria-label="Link to this perspective"
          readOnly
          value={shareUrl}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
      <div
        className="system-role-content"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <p className="system-eyebrow">What you gain</p>
          <p key={role} className="system-role-why system-panel-enter">
            {audience.why}
          </p>
          <p className="system-eyebrow system-contribution-label">
            What you bring
          </p>
          <p className="system-role-contribution">{audience.contribution}</p>
        </div>
      </div>
    </section>
  );
}
