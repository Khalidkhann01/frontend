// components/UploadStep.jsx
"use client";

import { useCallback, useState } from "react";
import { Upload, File, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadStep({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  const handleSubmit = () => {
    if (!file || !firstName.trim()) return;
    onUpload(file, firstName.trim());
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs text-purple-300">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
          Step 1 of 4
        </div>
        <h1 className="text-3xl font-bold text-white">
          Upload Your <span className="text-purple-400">CV</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          Upload your CV for AI-powered analysis and authentication check. 
          We'll extract your skills, experience, and qualifications.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
        <div className="space-y-5">
          {/* First name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Your first name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              CV (PDF)
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById("cv-input")?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 h-44 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
                dragging 
                  ? "border-purple-500 bg-purple-500/10" 
                  : "border-white/10 hover:border-purple-500/50 hover:bg-white/5"
              )}
            >
              <input
                id="cv-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <File className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-white">{file.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB — click to change</span>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-400">Drag & drop or click to upload PDF</span>
                  <span className="text-xs text-gray-500">Maximum file size: 10MB</span>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!file || !firstName.trim() || loading}
            className={cn(
              "relative w-full px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2",
              (!file || !firstName.trim() || loading)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-700 hover:shadow-[0_4px_30px_rgba(139,92,246,0.3)] active:scale-[0.98]"
            )}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>Analyse My CV</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          AI-Powered Analysis
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          Real-time Feedback
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          Secure & Private
        </span>
      </div>
    </div>
  );
}