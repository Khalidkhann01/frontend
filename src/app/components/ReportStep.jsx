// components/ReportStep.jsx
"use client";

import { cn } from "@/lib/utils";
import { RefreshCw, Award, BarChart3, TrendingUp } from "lucide-react";

export function ReportStep({ report, onReset }) {
  const avgNum = parseFloat(String(report.avgScore));
  const scoreColor = avgNum >= 8.5 ? "text-green-400" : avgNum >= 6 ? "text-amber-400" : "text-red-400";
  const recColor = avgNum >= 8.5 
    ? "bg-green-500/10 text-green-400 border-green-500/20" 
    : avgNum >= 5.5 
    ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
    : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Hero */}
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5 text-center">
        <div className="relative">
          <div className="absolute -inset-8 bg-purple-500/5 rounded-full blur-2xl" />
          <div className="text-6xl mb-3 relative">🎉</div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Interview Complete!</h1>
        <p className="text-gray-400 text-sm mb-4">
          {report.totalQuestions} questions · {report.totalTimeMinutes} min · {report.jobTitle}
        </p>

        <div className={cn("text-6xl font-bold mb-2", scoreColor)}>
          {report.avgScore}
          <span className="text-2xl text-gray-500">/10</span>
        </div>
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          recColor
        )}>
          {report.recommendation}
        </span>

        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-purple-400" />
            {report.totalQuestions} Questions
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
            {report.totalTimeMinutes} Minutes
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
            {report.avgScore}/10 Avg
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-4">{report.message}</p>
      </div>

      {/* Category breakdown */}
      {report.catAvgs && Object.keys(report.catAvgs).length > 0 && (
        <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📊</span>
            <h2 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
              Performance by Category
            </h2>
          </div>
          <div className="space-y-3">
            {Object.entries(report.catAvgs).map(([cat, avg]) => (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{cat}</span>
                  <span className="font-medium text-white">{avg}/10</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    parseFloat(avg) >= 7.5 
                      ? "bg-gradient-to-r from-purple-500 to-purple-400"
                      : parseFloat(avg) >= 5.5
                      ? "bg-gradient-to-r from-amber-500 to-amber-400"
                      : "bg-gradient-to-r from-red-500 to-red-400"
                  )} style={{ width: `${(parseFloat(avg) / 10) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 */}
      {report.top3 && report.top3.length > 0 && (
        <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏆</span>
            <h2 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
              Strongest Answers
            </h2>
          </div>
          <div className="space-y-3">
            {report.top3.map((s, i) => (
              <div key={i} className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 hover:bg-green-500/15 transition-all">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-green-400 truncate mr-2">{s.question}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                    {s.score}/10
                  </span>
                </div>
                {s.strengths && <p className="text-xs text-green-400/80">{s.strengths}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom 3 */}
      {report.bottom3 && report.bottom3.length > 0 && (
        <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📈</span>
            <h2 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
              Areas to Improve
            </h2>
          </div>
          <div className="space-y-3">
            {report.bottom3.map((s, i) => (
              <div key={i} className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 hover:bg-red-500/15 transition-all">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-red-400 truncate mr-2">{s.question}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                    {s.score}/10
                  </span>
                </div>
                {s.weaknesses && <p className="text-xs text-red-400/80">{s.weaknesses}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-400">
          Full HTML report sent to <span className="text-white">{report.candidateEmail}</span>
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white text-sm font-medium rounded-full border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Start a New Interview</span>
        </button>
      </div>
    </div>
  );
}