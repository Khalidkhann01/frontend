// hooks/useInterview.js
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, createSSEConnection } from "@/lib/api";

const initial = {
  step: "upload",
  sessionId: null,
  firstName: "",
  cvResult: null,
  jobMatch: null,
  mismatch: null,
  currentQuestion: null,
  lastFeedback: null,
  interviewDone: null,
  report: null,
  error: null,
};

export function useInterview() {
  const [state, setState] = useState(initial);
  const esRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const set = useCallback((patch) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  // ── SSE connection ──────────────────────────────────────────────────────────
  const connectSSE = useCallback(
    (sessionId) => {
      if (esRef.current) esRef.current.close();
      esRef.current = createSSEConnection(
        sessionId,
        (event, data) => {
          const d = data;
          switch (event) {
            case "cv_result":
              set({ step: "set_job", cvResult: d, error: null });
              break;
            case "job_match":
              set({ step: "ready", jobMatch: d, error: null });
              break;
            case "mismatch_roles":
              set({ step: "mismatch", mismatch: d, error: null });
              break;
            case "question":
              set({ step: "interview", currentQuestion: d, lastFeedback: null, error: null });
              break;
            case "score_feedback": {
              const sf = d;
              set({
                lastFeedback: sf,
                currentQuestion: sf.nextQuestion,
                error: null,
              });
              break;
            }
            case "interview_done":
              set({
                step: "generating_report",
                interviewDone: d,
                currentQuestion: null,
                error: null,
              });
              break;
            case "report_ready":
              set({ step: "done", report: d, error: null });
              esRef.current?.close();
              break;
            case "error":
              set({ error: d.message ?? "Unknown error" });
              break;
          }
        },
        () => {
          // SSE error — attempt reconnect after 3s
          setTimeout(() => {
            if (state.sessionId) connectSSE(state.sessionId);
          }, 3000);
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [set]
  );

  useEffect(() => {
    return () => esRef.current?.close();
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const uploadCV = useCallback(
    async (file, firstName) => {
      setLoading(true);
      set({ error: null, firstName });
      try {
        const base64 = await fileToBase64(file);
        const { sessionId } = await api.uploadCV({
          firstName,
          fileBase64: base64,
          fileName: file.name,
        });
        set({ sessionId, step: "analyzing" });
        connectSSE(sessionId);
      } catch (e) {
        set({ error: e.message, step: "upload" });
      } finally {
        setLoading(false);
      }
    },
    [set, connectSSE]
  );

  const setJob = useCallback(
    async (jobTitle, jobDescription, email) => {
      if (!state.sessionId) return;
      setLoading(true);
      set({ error: null, step: "matching" });
      try {
        await api.setJob({ sessionId: state.sessionId, jobTitle, jobDescription, email });
      } catch (e) {
        set({ error: e.message, step: "set_job" });
      } finally {
        setLoading(false);
      }
    },
    [state.sessionId, set]
  );

  const startInterview = useCallback(
    async (email) => {
      if (!state.sessionId) return;
      setLoading(true);
      set({ error: null });
      try {
        await api.startInterview({ sessionId: state.sessionId, email });
      } catch (e) {
        set({ error: e.message });
      } finally {
        setLoading(false);
      }
    },
    [state.sessionId, set]
  );

  const submitAnswer = useCallback(
    async (answer) => {
      if (!state.sessionId) return;
      setLoading(true);
      set({ error: null });
      try {
        await api.submitAnswer({ sessionId: state.sessionId, answer });
      } catch (e) {
        set({ error: e.message });
      } finally {
        setLoading(false);
      }
    },
    [state.sessionId, set]
  );

  const reset = useCallback(() => {
    esRef.current?.close();
    setState(initial);
  }, []);

  return { state, loading, uploadCV, setJob, startInterview, submitAnswer, reset };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      resolve(result.split(",")[1]); // strip data:...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}