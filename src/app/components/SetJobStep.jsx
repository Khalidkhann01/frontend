// components/SetJobStep.jsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function SetJobStep({ cv, firstName, onSetJob, loading }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");

  const riskColorMap = {
    Low: "green",
    Medium: "amber",
    High: "red",
  };

  const getBadgeColor = (riskLevel) => {
    const color = riskColorMap[riskLevel] || "gray";
    const colors = {
      green: "bg-green-500/10 text-green-400 border-green-500/20",
      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      red: "bg-red-500/10 text-red-400 border-red-500/20",
      gray: "bg-white/5 text-gray-400 border-white/10",
    };
    return colors[color];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* CV result */}
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📄</span>
          <h2 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
            CV Analysis — {firstName}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getBadgeColor(cv.riskLevel)
          )}>
            {cv.overallVerdict}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-white/5 text-gray-400 border-white/10">
            AI probability: {cv.aiGeneratedProbability}%
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
            {cv.seniorityLevel}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-400 border-purple-500/20">
            {cv.industryDomain}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{cv.keyFindings}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Overall</span>
              <span className="font-medium text-white">{cv.scores.overall}/10</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${(cv.scores.overall / 10) * 100}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Content</span>
              <span className="font-medium text-white">{cv.scores.content}/10</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${(cv.scores.content / 10) * 100}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Formatting</span>
              <span className="font-medium text-white">{cv.scores.formatting}/10</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${(cv.scores.formatting / 10) * 100}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ATS Score</span>
              <span className="font-medium text-white">{cv.scores.ats}/10</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${(cv.scores.ats / 10) * 100}%` }} />
            </div>
          </div>
        </div>

        {cv.redFlags && cv.redFlags.length > 0 && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 mb-3">
            <p className="text-xs font-semibold text-red-400 mb-1">⚠ Red flags</p>
            <ul className="text-xs text-red-400/80 space-y-0.5 list-disc list-inside">
              {cv.redFlags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {cv.topSkills && cv.topSkills.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Set job */}
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎯</span>
          <h2 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
            Target Job
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Job title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Data Engineer"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={5}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Your email (for the report)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
            onClick={() => onSetJob(jobTitle, jobDescription, email)}
            disabled={!jobTitle.trim() || !jobDescription.trim() || !email.trim() || loading}
            className={cn(
              "relative w-full px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2",
              (!jobTitle.trim() || !jobDescription.trim() || !email.trim() || loading)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-700 hover:shadow-[0_4px_30px_rgba(139,92,246,0.3)] active:scale-[0.98]"
            )}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Check Match & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}