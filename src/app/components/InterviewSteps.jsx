// components/InterviewStep.jsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";

const DIFFICULTY_COLOR = {
  Easy: "green",
  Medium: "amber",
  Hard: "red",
};

export function InterviewStep({ question, feedback, onSubmit, loading }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;
    setSubmitted(true);
    await onSubmit(answer.trim());
    setAnswer("");
    setSubmitted(false);
  };

  const progress = ((question.questionNumber - 1) / question.totalQuestions) * 100;

  const getScoreColor = (score) => {
    if (score >= 8.5) return "text-green-400";
    if (score >= 6) return "text-amber-400";
    return "text-red-400";
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      green: "bg-green-500/10 text-green-400 border-green-500/20",
      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      red: "bg-red-500/10 text-red-400 border-red-500/20",
      gray: "bg-white/5 text-gray-400 border-white/10",
    };
    return colors[DIFFICULTY_COLOR[difficulty]] || colors.gray;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Question {question.questionNumber} of {question.totalQuestions}</span>
          <span className="text-purple-400">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Previous feedback */}
      {feedback && (
        <div className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-purple-500/20 border-l-4 border-l-purple-400">
          <div className="flex items-center gap-4 mb-3">
            <span className={cn("text-3xl font-bold", getScoreColor(feedback.score))}>
              {feedback.score}/10
            </span>
            <span className="text-sm text-gray-400">{feedback.feedbackMessage}</span>
          </div>

          {feedback.strengths && (
            <p className="text-xs text-green-400 bg-green-500/10 rounded-lg px-3 py-2 mb-2 border border-green-500/20">
              ✓ {feedback.strengths}
            </p>
          )}
          {feedback.weaknesses && (
            <p className="text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 mb-2 border border-amber-500/20">
              △ {feedback.weaknesses}
            </p>
          )}
          {feedback.idealAnswerHint && (
            <p className="text-xs text-purple-400 bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20">
              💡 {feedback.idealAnswerHint}
            </p>
          )}
        </div>
      )}

      {/* Current question */}
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="flex gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-400 border-purple-500/20">
            {question.category}
          </span>
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getDifficultyColor(question.difficulty)
          )}>
            {question.difficulty}
          </span>
        </div>

        <p className="text-white font-medium text-base mb-1 leading-relaxed">{question.question}</p>

        {question.followUp && (
          <p className="text-xs text-gray-400 italic mb-4">Follow-up: {question.followUp}</p>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Your answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here… be as detailed as you would in a real interview."
            rows={6}
            disabled={loading}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 resize-none disabled:opacity-60"
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            {answer.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || submitted || loading}
            className={cn(
              "relative px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2",
              (!answer.trim() || submitted || loading)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-700 hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] active:scale-[0.98]"
            )}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI coaching tip */}
      <div className="text-center text-xs text-gray-500">
        <Sparkles className="h-3 w-3 inline mr-1 text-purple-400" />
        AI evaluates your answer in real-time with detailed feedback
      </div>
    </div>
  );
}