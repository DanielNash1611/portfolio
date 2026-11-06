import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { POST, OPTIONS } from "../app/api/analytics/events/route";
import { getDatabaseClient } from "../lib/db";

test("isolated Shadow collector persists newsletter camera/summon events once and drops content", {skip: !process.env.ANALYTICS_TEST_HOST}, async () => {
  assert.equal(new URL(process.env.DATABASE_URL!).hostname,process.env.ANALYTICS_TEST_HOST);
  assert.equal(process.env.DATABASE_BRANCH_NAME,"shadow-analytics-validation-20261105");
  const origin="https://shadowcast.shadowcasterseries.com";
  const visitorId="visitor_"+randomUUID(),sessionId="session_"+randomUUID();
  const occurredAt=new Date().toISOString(),start=new Date(Date.now()-1000).toISOString(),end=new Date(Date.now()+60000).toISOString();
  const events=["camera_start_clicked","casting_started","creature_summoned","camera_creature_summoned","button_creature_summoned","operator_demo_summoned"].map(eventName=>({
    app:"shadow-casters",eventName,occurredAt,visitorId,sessionId,clientEventId:randomUUID(),pagePath:"/",validation:true,
    properties:{landmarks:[1],message:"Synthetic private field must be dropped"},
  }));
  const request=(body:unknown,headers:Record<string,string>={})=>new NextRequest("http://localhost:3000/api/analytics/events",{
    method:"POST",headers:{origin,"content-type":"text/plain",...headers},body:JSON.stringify(body),
  });
  const preflight=OPTIONS(new NextRequest("http://localhost:3000/api/analytics/events",{method:"OPTIONS",headers:{origin}}));
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get("access-control-allow-origin"),origin);
  assert.equal((await POST(request(events))).status,200);
  assert.equal((await POST(request(events))).status,200);
  const ignored={...events[0],clientEventId:randomUUID()};
  assert.equal((await POST(request(ignored,{dnt:"1"}))).status,200);
  assert.equal((await POST(request(ignored,{"sec-gpc":"1"}))).status,200);
  assert.equal((await POST(request(ignored,{origin:origin+".evil.example"}))).status,403);
  const sql=getDatabaseClient();
  const result=await sql.query(`SELECT count(*)::int AS events,
    count(*) FILTER (WHERE properties <> '{}'::jsonb)::int AS content,
    count(DISTINCT session_id)::int AS sessions
    FROM analytics_events WHERE app='shadow-casters' AND app_env='validation'
      AND occurred_at >= $1::timestamptz AND occurred_at < $2::timestamptz
      AND client_event_id=ANY($3::uuid[])`,[start,end,[...events.map(e=>e.clientEventId),ignored.clientEventId]]);
  assert.deepEqual(result[0],{events:6,content:0,sessions:1});
});
