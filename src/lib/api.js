// lib/api.js
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function post(path, body) {
  console.log(`📤 [API] POST ${path}`, { sessionId: body.sessionId });
  
  try {
    const r = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    console.log(`📤 [API] Response status: ${r.status} for ${path}`);
    
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: r.statusText }));
      console.error(`❌ [API] Error response:`, err);
      throw new Error(err.error ?? `HTTP ${r.status}`);
    }
    
    const data = await r.json();
    console.log(`✅ [API] Success for ${path}`, { sessionId: data.sessionId });
    return data;
  } catch (error) {
    console.error(`❌ [API] Error in ${path}:`, error.message);
    throw error;
  }
}

export const api = {
  uploadCV: (payload) => post("/api/upload-cv", payload),
  setJob: (payload) => post("/api/set-job", payload),
  startInterview: (payload) => post("/api/start-interview", payload),
  submitAnswer: (payload) => post("/api/answer", payload),
};

export function createSSEConnection(sessionId, onEvent, onError) {
  console.log(`🔌 [SSE] Creating connection for session: ${sessionId}`);
  console.log(`🔌 [SSE] URL: ${API}/stream/${sessionId}`);
  
  const es = new EventSource(`${API}/stream/${sessionId}`);

  // 🔥 Log when connection opens
  es.onopen = () => {
    console.log(`✅ [SSE] Connection opened for session: ${sessionId}`);
  };

  // 🔥 Log when connection closes
  es.onclose = () => {
    console.log(`🔌 [SSE] Connection closed for session: ${sessionId}`);
  };

  const events = [
    "cv_result",
    "job_match",
    "mismatch_roles",
    "question",
    "score_feedback",
    "interview_done",
    "report_ready",  // ← This is the critical one!
    "error",
    "done",
  ];

  events.forEach((evt) => {
    es.addEventListener(evt, (e) => {
      console.log(`📨 [SSE] Event received: ${evt} for session: ${sessionId}`);
      console.log(`📨 [SSE] Event data preview:`, e.data.substring(0, 200) + '...');
      
      // 🔥 Special logging for report_ready
      if (evt === "report_ready") {
        console.log(`📊 [SSE] 🚀 REPORT_READY EVENT RECEIVED!`);
        console.log(`📊 [SSE] Full report data:`, e.data);
      }
      
      try {
        const data = JSON.parse(e.data);
        console.log(`✅ [SSE] Parsed ${evt} event successfully`);
        onEvent(evt, data);
      } catch (error) {
        console.error(`❌ [SSE] Failed to parse ${evt} event:`, error.message);
        console.error(`❌ [SSE] Raw data:`, e.data);
        onEvent(evt, e.data);
      }
    });
  });

  // 🔥 Log SSE errors
  if (onError) {
    es.onerror = (e) => {
      console.error(`❌ [SSE] Connection error for session: ${sessionId}`, e);
      console.error(`❌ [SSE] ReadyState: ${es.readyState}`);
      // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
      onError(e);
    };
  }

  return es;
}