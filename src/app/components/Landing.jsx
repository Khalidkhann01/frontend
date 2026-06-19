// components/Landing.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Landing = () => {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      id: 1,
      title: 'Upload CV',
      description: 'Upload your CV for AI-powered analysis and authentication check',
      icon: '📄',
      status: 'active'
    },
    {
      id: 2,
      title: 'Job Match',
      description: 'AI evaluates your skills, experience, and role compatibility',
      icon: '🎯',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Interview',
      description: 'Answer 20 tailored questions with real-time AI feedback',
      icon: '🧠',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Report',
      description: 'Get a comprehensive report with coaching and improvement insights',
      icon: '📊',
      status: 'pending'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-black">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur-xl" />
            <div className="relative w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
              AI
            </div>
          </div>
          <span className="font-bold text-white/90">Webhook AI Interview</span>
          <span className="ml-auto text-xs text-gray-500 border border-gray-800 px-2 py-0.5 rounded-full">
            Personal Project
          </span>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs text-purple-300">
              <span className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
              AI Interview Orchestration
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              <span className="text-white">Practice </span>
              <span className="text-purple-400">AI Interviews</span>
              <br />
              <span className="text-white/70">with Real-Time Feedback</span>
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              A personal project that simulates the complete hiring process. Upload your CV, 
              get matched to a role, practice interview questions, and receive detailed 
              performance reports with coaching insights.
            </p>

            <Link href="/upload">
              <button
                className="relative px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Start Practice
              </button>
            </Link>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['n8n', 'Groq', 'Llama', 'Gmail API', 'SSE', 'React', 'Next.js', 'Tailwind'].map((tech) => (
                <span key={tech} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/5 rounded-full text-gray-500">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Animated Workflow */}
          <div className="relative">
            <div className="space-y-3">
              {workflowSteps.map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                const isNext = index === activeStep + 1;

                return (
                  <div key={step.id} className="relative">
                    <div 
                      className={`
                        relative flex items-center gap-4 p-3 rounded-xl transition-all duration-500 cursor-default
                        ${isActive ? 'bg-purple-500/10 border border-purple-500/30' : ''}
                        ${isCompleted ? 'bg-white/5 border border-white/5' : ''}
                        ${!isActive && !isCompleted ? 'bg-transparent border border-transparent' : ''}
                      `}
                    >
                      {/* Step number with animated ring */}
                      <div className="relative flex-shrink-0">
                        <div 
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500
                            ${isActive ? 'bg-purple-600 text-white' : ''}
                            ${isCompleted ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : ''}
                            ${!isActive && !isCompleted ? 'bg-gray-800 text-gray-600 border border-gray-700' : ''}
                          `}
                        >
                          {isCompleted ? '✓' : step.id}
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{step.icon}</span>
                          <h3 className={`
                            text-sm font-medium transition-colors duration-300
                            ${isActive ? 'text-white' : ''}
                            ${isCompleted ? 'text-white/70' : ''}
                            ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                          `}>
                            {step.title}
                          </h3>
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full animate-pulse">
                              Processing
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                              Done
                            </span>
                          )}
                          {isNext && !isCompleted && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full animate-pulse">
                              Up next
                            </span>
                          )}
                        </div>
                        <p className={`
                          text-xs transition-colors duration-300
                          ${isActive ? 'text-gray-300' : ''}
                          ${isCompleted ? 'text-gray-400' : ''}
                          ${!isActive && !isCompleted ? 'text-gray-600' : ''}
                        `}>
                          {step.description}
                        </p>
                      </div>

                      {isActive && (
                        <div className="flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workflow indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[10px] text-gray-500">Step {activeStep + 1} of {workflowSteps.length}</span>
              <div className="flex gap-1">
                {workflowSteps.map((_, index) => (
                  <div 
                    key={index}
                    className={`
                      w-1.5 h-1.5 rounded-full transition-all duration-300
                      ${index === activeStep ? 'bg-purple-400 w-3' : ''}
                      ${index < activeStep ? 'bg-purple-500/30' : ''}
                      ${index > activeStep ? 'bg-gray-700' : ''}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-3 text-[11px] text-gray-600">
          <span>© 2026 Webhook AI Interview — Personal Project</span>
          <div className="flex gap-4">
            <span className="hover:text-white/80 transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-white/80 transition-colors cursor-pointer">Documentation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;