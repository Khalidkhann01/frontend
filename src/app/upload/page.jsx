// app/upload/page.jsx
"use client";

import { useInterview } from "../../hooks/UseInterview";
import { UploadStep } from "../components/UploadStep";
import { SetJobStep } from "../components/SetJobStep";
import { ReadyStep, MismatchStep } from "../components/MatchSteps";
import { InterviewStep } from "../components/InterviewSteps";
import { ReportStep } from "../components/ReportStep";
import { LoadingScreen } from "../components/LoadingScreen";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function UploadPage() {
  const { state, loading, uploadCV, setJob, startInterview, submitAnswer, reset } = useInterview();

  const steps = ["Upload", "CV Analysis", "Job Match", "Interview", "Report"];
  const stepMap = ["upload", "analyzing", "set_job", "matching", "mismatch", "ready", "interview", "generating_report", "done"];
  const currentStepIndex = stepMap.indexOf(state.step);
  const activeStep = currentStepIndex >= 4 ? 2 : currentStepIndex;

  return (
    <main className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="relative transition-opacity hover:opacity-80">
            <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur-xl" />
            <div className="relative w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
              AI
            </div>
          </Link>
          <span className="font-bold text-white/90">Webhook AI Interview</span>
          <Link 
            href="/" 
            className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>
        </div>

        {/* Step indicator */}
        {state.step !== "upload" && (
          <div className="relative mb-10 px-1">
            <div className="flex justify-between">
              {steps.map((s, i) => {
                const isActive = i <= activeStep;
                return (
                  <div key={s} className="flex-1 text-center relative">
                    <div className="relative z-10">
                      <div className={cn(
                        "w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500",
                        isActive 
                          ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
                          : "bg-gray-800 text-gray-600 border border-gray-700"
                      )}>
                        {i + 1}
                      </div>
                      <span className={cn(
                        "block text-[10px] mt-1.5 transition-colors duration-300",
                        isActive ? "text-purple-400" : "text-gray-600"
                      )}>
                        {s}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={cn(
                        "absolute top-4 left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] h-px transition-colors duration-500",
                        isActive ? "bg-purple-500/50" : "bg-gray-800"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error banner */}
        {state.error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-slide-up">
            ⚠ {state.error}
          </div>
        )}

        {/* Step router */}
        {state.step === "upload" && (
          <UploadStep onUpload={uploadCV} loading={loading} />
        )}

        {(state.step === "analyzing" || state.step === "generating_questions") && (
          <LoadingScreen step={state.step} />
        )}

        {state.step === "set_job" && state.cvResult && (
          <SetJobStep
            cv={state.cvResult}
            firstName={state.firstName}
            onSetJob={(title, desc) => setJob(title, desc)}
            loading={loading}
          />
        )}

        {state.step === "matching" && <LoadingScreen step="matching" />}

        {state.step === "mismatch" && state.mismatch && (
          <MismatchStep data={state.mismatch} onReset={reset} />
        )}

        {state.step === "ready" && state.jobMatch && (
          <ReadyStep
            match={state.jobMatch}
            onStart={startInterview}
            loading={loading}
          />
        )}

        {state.step === "interview" && state.currentQuestion && (
          <InterviewStep
            question={state.currentQuestion}
            feedback={state.lastFeedback}
            onSubmit={submitAnswer}
            loading={loading}
          />
        )}

        {state.step === "generating_report" && <LoadingScreen step="generating_report" />}

        {/* 🔥 Updated: Handle done state with error fallback */}
        {state.step === "done" && (
          state.report ? (
            <ReportStep report={state.report} onReset={reset} />
          ) : state.error ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⏳</div>
              <div className="text-red-400 text-lg mb-4">{state.error}</div>
              <p className="text-gray-400 text-sm mb-6">The report generation is taking longer than expected.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/60 py-12">
              <div className="animate-pulse">Loading report...</div>
            </div>
          )
        )}
      </div>
    </main>
  );
}