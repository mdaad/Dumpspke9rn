#!/usr/bin/env node
/**
 * PW Signed Cookie API Tester
 * 
 * Usage:
 *   1. Neeche TOKEN, BATCH_ID, CHILD_ID fill karo (ya env vars se do)
 *   2. node pw.js
 *
 * Env vars se chalane ke liye:
 *   TOKEN=xxx BATCH_ID=yyy CHILD_ID=zzz node pw.js
 */

const TOKEN = process.env.TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3OTE0OTU3MjgsImV4cCI6MTc5MjEwMDUyOC4xNjIsImRhdGEiOnsiX2lkIjoiNmFhN2ZjMTAwM2FkNDFhNjYzMjYxNWM4IiwidXNlcm5hbWUiOiI3MDcwNzYyMjgyIiwiZmlyc3ROYW1lIjoiS3Jpc2giLCJsYXN0TmFtZSI6Ikt1bWFyIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sInJvbGVzIjpbIjViMjdiZDk2NTg0MmY5NTBhNzc4YzZlZiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsIm9uZVJvbGVzIjpbXSwidHlwZSI6IlVTRVIifSwianRpIjoiNGpCSXJIem9RR2lFMTFDbExkcGFpZ182YWE3ZmMxMDAzYWQ0MWE2NjMyNjE1YzgifQ.POhAEfKxkjAl7QrCdgiNXzkKX57DF-W1AatETE2C2uo";
const BATCH_ID = process.env.BATCH_ID || "698ad3519549b300a5e1cc6a";
const CHILD_ID = process.env.CHILD_ID || "69f9a5047723585488e1b20c";
const BASE = "https://api.penpencil.co";

// Node 19+ me global crypto.randomUUID() available hai
const randomUUID =
  globalThis.crypto?.randomUUID?.() ||
  require("crypto").randomUUID();

const COMMON_HEADERS = {
  accept: "application/json, text/plain, */*",
  authorization: `Bearer ${TOKEN}`,
  "client-id": "5eb393ee95fab7468a79d189",
  "client-type": "WEB",
  "client-version": "2.1.1",
  randomid: randomUUID,
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
};

async function tryGet() {
  console.log("════ TRY 1: GET (query params) ════");
  const url = new URL(`${BASE}/v1/files/get-signed-cookie`);
  url.searchParams.set("reqType", "query");
  url.searchParams.set("type", "BATCHES");
  url.searchParams.set("parentId", BATCH_ID);
  url.searchParams.set("childId", CHILD_ID);
  url.searchParams.set("videoContainerType", "DASH");
  url.searchParams.set("offline", "false");

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: COMMON_HEADERS,
    });
    const text = await res.text();
    console.log(text);
    console.log(`\n[HTTP ${res.status}]\n`);
    return { status: res.status, body: safeParse(text) };
  } catch (err) {
    console.error("GET failed:", err.message);
    return null;
  }
}

async function tryPost() {
  console.log("════ TRY 2: POST (JSON body) ════");
  const body = {
    reqType: "query",
    type: "BATCHES",
    parentId: BATCH_ID,
    childId: CHILD_ID,
    videoContainerType: "DASH",
    offline: false,
  };

  try {
    const res = await fetch(`${BASE}/v1/files/get-signed-cookie`, {
      method: "POST",
      headers: {
        ...COMMON_HEADERS,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log(text);
    console.log(`\n[HTTP ${res.status}]\n`);
    return { status: res.status, body: safeParse(text) };
  } catch (err) {
    console.error("POST failed:", err.message);
    return null;
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

(async () => {
  // Validation
  const missing = [];
  if (!TOKEN || TOKEN.includes("YAHAN")) missing.push("TOKEN");
  if (!BATCH_ID || BATCH_ID.includes("YAHAN")) missing.push("BATCH_ID");
  if (!CHILD_ID || CHILD_ID.includes("YAHAN")) missing.push("CHILD_ID");
  if (missing.length) {
    console.error(`❌ Missing: ${missing.join(", ")}`);
    console.error("   File me values edit karo ya env vars se do:");
    console.error("   TOKEN=xxx BATCH_ID=yyy CHILD_ID=zzz node pw.js");
    process.exit(1);
  }

  console.log(`UUID (randomid): ${randomUUID}\n`);

  const getRes = await tryGet();
  const postRes = await tryPost();

  console.log("════ SUMMARY ════");
  console.log("GET :", getRes ? getRes.status : "ERR");
  console.log("POST:", postRes ? postRes.status : "ERR");
})();
