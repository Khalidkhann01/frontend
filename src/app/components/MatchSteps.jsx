// components/MatchSteps.jsx
"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, RefreshCw } from "lucide-react";

export function ReadyStep({ match, onStart, loading }) {  // Remove email prop
  const rec = match.hiringRecommendation?.toLowerCase() || '';
  const color = rec.includes("caution") ? "amber" : "green";

  const getBadgeColor = (color) => {
    const colors = {
      green: "bg-green-500/10 text-green-400 border-green-500/20",
      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up">
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎯</span>
          <h2 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
            Job Match Result
          </h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-5xl font-bold text-white">
              {match.matchScore || 0}
              <span className="text-2xl text-gray-500">%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
                style={{ width: `${match.matchScore || 0}%` }}
              />
            </div>
          </div>
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getBadgeColor(color)
          )}>
            {match.hiringRecommendation || 'Analyzing...'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Hard skills</span>
              <span className="font-medium text-white">{match.hardSkillsMatch || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${match.hardSkillsMatch || 0}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Soft skills</span>
              <span className="font-medium text-white">{match.softSkillsMatch || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${match.softSkillsMatch || 0}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Experience</span>
              <span className="font-medium text-white">{match.experienceMatch || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${match.experienceMatch || 0}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Education</span>
              <span className="font-medium text-white">{match.educationMatch || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${match.educationMatch || 0}%` }} />
            </div>
          </div>
        </div>

        {match.strongMatches && match.strongMatches.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-green-400 mb-1">✓ Strong matches</p>
            <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
              {match.strongMatches.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        )}

        {match.skillGaps && match.skillGaps.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-amber-400 mb-1">△ Skill gaps to probe</p>
            <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
              {match.skillGaps.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
        )}

        {match.overallAssessment && (
          <p className="text-sm text-gray-400 mb-5 leading-relaxed">{match.overallAssessment}</p>
        )}

        <button
          onClick={onStart}  // Remove email parameter
          disabled={loading}
          className={cn(
            "relative w-full px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2",
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-700 hover:shadow-[0_4px_30px_rgba(139,92,246,0.3)] active:scale-[0.98]"
          )}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Starting...</span>
            </>
          ) : (
            <>
              <span>Start Interview (20 Questions)</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function MismatchStep({ data, onReset }) {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up">
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3 animate-float">😕</div>
          <h2 className="text-xl font-bold text-white">Not the Right Fit — Yet</h2>
          <p className="text-sm text-gray-400 mt-1">{data?.mismatchSummary || 'Your skills don\'t align with this role.'}</p>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mb-4 text-center">
          <p className="text-xs font-semibold text-amber-400">Match score: {data?.matchScore || 0}%</p>
        </div>

        {data?.suggestedRoles && data.suggestedRoles.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💡</span>
              <h3 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
                Better-Fit Roles for You
              </h3>
            </div>

            <div className="space-y-3 mb-5">
              {data.suggestedRoles.map((role, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{role.title}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                      {role.match_pct}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{role.match_reason}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {data?.upskillRecommendations && data.upskillRecommendations.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📚</span>
              <h3 className="text-lg font-semibold text-white border-l-2 border-purple-500 pl-3">
                Upskill Roadmap
              </h3>
            </div>
            <div className="space-y-2 mb-5">
              {data.upskillRecommendations.map((u, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-gray-400">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    u.priority === "High" 
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : u.priority === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-white/5 text-gray-400 border-white/10"
                  )}>
                    {u.priority}
                  </span>
                  <span><strong className="text-white">{u.skill}</strong> — {u.resource}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {data?.encouragement && (
          <p className="text-sm text-purple-400 font-medium text-center mb-4">{data.encouragement}</p>
        )}

        <button
          onClick={onReset}
          className="relative w-full px-6 py-3 bg-white/5 text-white text-sm font-medium rounded-full border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try a Different Job</span>
        </button>
      </div>
    </div>
  );
}