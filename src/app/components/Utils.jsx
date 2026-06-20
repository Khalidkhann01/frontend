// components/LoadingScreen.jsx
"use client";

const MESSAGES = {
  analyzing: {
    icon: "🔬",
    title: "Analysing Your CV",
    subtitle: "Running forensic authenticity checks, scoring quality, and extracting your skills.",
  },
  matching: {
    icon: "🎯",
    title: "Matching You to the Role",
    subtitle: "Comparing your experience to the job requirements. This takes ~20 seconds.",
  },
  generating_questions: {
    icon: "🧠",
    title: "Generating 20 Tailored Questions",
    subtitle: "Crafting questions based on your specific CV and the job description.",
  },
  generating_report: {
    icon: "📊",
    title: "Generating Your Report",
    subtitle: "Compiling all answers, scores, and coaching recommendations into your full report.",
  },
};

export function LoadingScreen({ step }) {
  const msg = MESSAGES[step] || { 
    icon: "⏳", 
    title: "Processing…", 
    subtitle: "Please wait while we prepare your interview." 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center animate-slide-up">
      <div className="relative">
        <div className="text-6xl animate-float">{msg.icon}</div>
        <div className="absolute -inset-4 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">{msg.title}</h2>
        <p className="text-gray-400 text-sm max-w-xs">{msg.subtitle}</p>
      </div>

      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-purple-500" />
        <div className="absolute inset-0 animate-pulse rounded-full border-2 border-purple-500/20" />
      </div>
      
      <p className="text-xs text-gray-500">Results will appear automatically via live stream</p>
    </div>
  );
}