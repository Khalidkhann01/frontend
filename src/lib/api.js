// lib/api.js
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error ?? `HTTP ${r.status}`);
  }
  return r.json();
}

export const api = {
  uploadCV: (payload) => post("/api/upload-cv", payload),
  setJob: (payload) => post("/api/set-job", payload),
  startInterview: (payload) => post("/api/start-interview", payload),
  submitAnswer: (payload) => post("/api/answer", payload),
};

export function createSSEConnection(sessionId, onEvent, onError) {
  const es = new EventSource(`${API}/stream/${sessionId}`);

  const events = [
    "cv_result",
    "job_match",
    "mismatch_roles",
    "question",
    "score_feedback",
    "interview_done",
    "report_ready",
    "error",
    "done",
  ];

  events.forEach((evt) => {
    es.addEventListener(evt, (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent(evt, data);
      } catch {
        onEvent(evt, e.data);
      }
    });
  });

  if (onError) es.onerror = onError;
  return es;
}