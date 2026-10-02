import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeProductEvent, resolveProductOrigin } from "../lib/product-analytics";
const payload = {
  app:"gravity",eventName:"experience_started",
  clientEventId:"22222222-2222-4222-8222-222222222222",
  visitorId:"visitor_11111111-1111-4111-8111-111111111111",
  sessionId:"session_33333333-3333-4333-8333-333333333333",
  occurredAt:"2026-10-02T00:00:00Z",pagePath:"/",
};
const now=Date.parse(payload.occurredAt);
describe("shared product collector",()=>{
  it("binds app to its exact production and owner-scoped preview origins",()=>{
    assert.equal(resolveProductOrigin("gravity","https://gravity.danielnash.co"), "production");
    assert.equal(resolveProductOrigin("gravity","https://gravity-123-danash1611-3756s-projects.vercel.app"), "preview");
    assert.equal(resolveProductOrigin("gravity","https://gravity-123-other-projects.vercel.app"), null);
    assert.equal(resolveProductOrigin("temple-ride","https://gravity.danielnash.co"), null);
    assert.equal(resolveProductOrigin("gravity","https://gravity.danielnash.co.evil.example"), null);
  });
  it("drops private data, URLs, identities and content properties",()=>{
    const event=normalizeProductEvent({...payload,pagePath:"/private/user@example.com",properties:{query:"secret",email:"private",landmarks:[1]}},
      "https://gravity.danielnash.co","production",now);
    assert.deepEqual(event?.properties, {});
    assert.equal(event?.pagePath, null);
    assert.equal(normalizeProductEvent({...payload,visitorId:"visitor_email@example.com"},"https://gravity.danielnash.co","production",now), null);
    assert.equal(normalizeProductEvent({...payload,eventName:"contact_completed"},"https://gravity.danielnash.co","production",now), null);
  });
  it("prevents preview collectors and validation events from entering production analysis",()=>{
    assert.equal(normalizeProductEvent(payload,"https://gravity.danielnash.co","preview",now)?.environment, "preview");
    assert.equal(normalizeProductEvent({...payload,validation:true},"https://gravity.danielnash.co","production",now)?.environment, "validation");
    assert.equal(normalizeProductEvent(payload,"https://gravity-123-danash1611-3756s-projects.vercel.app","production",now)?.environment, "preview");
  });
  it("allows only static route templates and rejects stale or unknown input",()=>{
    assert.equal(normalizeProductEvent(null,"https://gravity.danielnash.co","production",now), null);
    assert.equal(normalizeProductEvent({...payload,app:"newapp"},"https://gravity.danielnash.co","production",now), null);
    assert.equal(normalizeProductEvent({...payload,occurredAt:"2020-01-01"},"https://gravity.danielnash.co","production",now), null);
    assert.equal(normalizeProductEvent({...payload,app:"immunologyscout",eventName:"research_started",pagePath:"/threads/:id"},
      "https://immunologyscout.danielnash.co","production",now)?.pagePath, "/threads/:id");
  });
});
