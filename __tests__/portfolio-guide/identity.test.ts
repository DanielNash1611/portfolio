import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import {
  ensureGuideInteractionSessionId,
  ensureGuideVisitorId,
  resetGuideIdentityForTests,
} from "@/lib/portfolio-guide/session";

function createMemoryStorage() {
  const store = new Map<string, string>();

  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

afterEach(() => {
  resetGuideIdentityForTests();
});

test("visitor id persists in local storage", () => {
  const storage = createMemoryStorage();

  const firstId = ensureGuideVisitorId(storage);
  const secondId = ensureGuideVisitorId(storage);

  assert.match(firstId, /^pgv_/);
  assert.equal(secondId, firstId);
});

test("interaction session id persists in session storage", () => {
  const storage = createMemoryStorage();

  const firstId = ensureGuideInteractionSessionId(storage);
  const secondId = ensureGuideInteractionSessionId(storage);

  assert.match(firstId, /^pgs_/);
  assert.equal(secondId, firstId);
});

test("identity helpers fall back to in-memory values when storage is unavailable", () => {
  const visitorId = ensureGuideVisitorId(null);
  const sessionId = ensureGuideInteractionSessionId(null);

  assert.equal(ensureGuideVisitorId(null), visitorId);
  assert.equal(ensureGuideInteractionSessionId(null), sessionId);
});

