import type { NextRequest } from "next/server";

export const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const minFormFillTimeMs = 1500;
export const maxNameLength = 120;
export const maxEmailLength = 320;
export const maxSubjectLength = 200;
export const maxMessageLength = 5000;
export const unknownRequestValue = "unknown";

export type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

export function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip")?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    unknownRequestValue
  );
}

export function getUserAgent(request: NextRequest): string | null {
  const userAgent = request.headers.get("user-agent")?.trim();
  return userAgent ? userAgent : null;
}

function getAllowedOrigins(request: NextRequest): Set<string> {
  const allowedOrigins = new Set<string>([request.nextUrl.origin]);
  const siteBaseUrl = process.env.SITE_BASE_URL?.trim();

  if (siteBaseUrl) {
    try {
      allowedOrigins.add(new URL(siteBaseUrl).origin);
    } catch {
      // Ignore malformed deployment configuration and fall back to request origin.
    }
  }

  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.add("http://localhost:3000");
    allowedOrigins.add("http://127.0.0.1:3000");
  }

  return allowedOrigins;
}

export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  return getAllowedOrigins(request).has(origin);
}
