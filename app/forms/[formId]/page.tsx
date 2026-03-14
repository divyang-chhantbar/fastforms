"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ChevronLeft,
  Link as LinkIcon,
  Share2,
  Check,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { SmartForm } from "@/components/SmartForm";
import {
  useTambo,
  useTamboThreadInput,
  TamboThreadInputProvider,
} from "@tambo-ai/react";
import { FormAssistant } from "@/components/FormAssistant";

interface Field {
  id: string;
  type:
    | "text"
    | "email"
    | "date"
    | "number"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "file";
  label: string;
  required: boolean;
  placeholder: string;
  options: string[];
}

interface FormData {
  id: string;
  userId: string;
  title: string;
  fields: Field[];
  createdAt: string;
  slug: string;
  isPublished: boolean;
}

function renderField(field: Field) {
  const commonClasses =
    "w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-70 disabled:cursor-not-allowed";

  switch (field.type) {
    case "text":
    case "email":
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className={commonClasses}
        />
      );

    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className={`${commonClasses} min-h-[120px] resize-y`}
        />
      );

    case "select":
      return (
        <select required={field.required} disabled className={commonClasses}>
          <option value="" className="bg-zinc-900 text-zinc-400">
            Select an option
          </option>
          {field.options.map((option: string) => (
            <option
              key={option}
              value={option}
              className="bg-zinc-900 text-white"
            >
              {option}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-3 mt-2">
          {field.options.map((option: string) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-not-allowed opacity-70"
            >
              <input
                type="radio"
                name={field.id}
                value={option}
                disabled
                required={field.required}
                className="w-4 h-4 text-indigo-500 bg-white/5 border-white/20 focus:ring-indigo-500/50 focus:ring-2"
              />
              <span className="text-zinc-300 text-sm">{option}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-3 mt-2">
          {field.options.map((option: string) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-not-allowed opacity-70"
            >
              <input
                type="checkbox"
                value={option}
                disabled
                className="w-4 h-4 rounded text-indigo-500 bg-white/5 border-white/20 focus:ring-indigo-500/50 focus:ring-2"
              />
              <span className="text-zinc-300 text-sm">{option}</span>
            </label>
          ))}
        </div>
      );

    case "number":
      return (
        <input
          type="number"
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className={commonClasses}
        />
      );

    case "date":
      return (
        <input
          type="date"
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className={commonClasses}
        />
      );

    case "file":
      return (
        <input
          type="file"
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className={commonClasses}
        />
      );

    default:
      return (
        <div className="text-zinc-500 text-sm italic">
          Unsupported field type
        </div>
      );
  }
}

export default function FormGenerationPage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const params = useParams();
  const formId = params.formId as string;

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/forms/${formId}`);
        setFormData(response.data.data);
      } catch (error: any) {
        setError(error.message || "Failed to load form details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, [formId]);

  const handleCopyLink = async () => {
    try {
      if (!formData) return;
      const formLink = `${window.location.origin}/f/${formData.slug}`;
      await navigator.clipboard.writeText(formLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link: ", error);
    }
  };

  const handlePublishToggle = async () => {
    setIsToggling(true);
    try {
      const response = await axios.patch(`/api/forms/${formId}`, {
        togglePublish: true,
      });
      const updatedForm = response.data.data;
      setFormData(updatedForm);

      // Fire confetti only if we just published it!
      if (updatedForm.isPublished) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#4f46e5", "#a855f7", "#ec4899", "#ffffff"],
        });
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const [isAiSyncing, setIsAiSyncing] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleAiUpdate = React.useCallback(
    async (newProps: any) => {
      // Clear previous timeout to debounce the sync
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      setIsAiSyncing(true);

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await axios.patch(`/api/forms/${formId}`, {
            title: newProps.title,
            fields: newProps.fields,
          });
          // console.log("✅ AI Changes Synced to Database:", response.data.data);
        } catch (err: any) {
          console.error("AI Sync failed:", err.response?.data || err.message);
        } finally {
          setIsAiSyncing(false);
        }
      }, 800); // 800ms debounce
    },
    [formId],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-light">
            Loading interface...
          </p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <div className="w-8 h-8 text-red-500 font-bold text-xl">!</div>
        </div>
        <h2 className="text-2xl font-medium text-white mb-2">Form Not Found</h2>
        <p className="text-zinc-400 mb-8">
          {error || "This form doesn't exist or you lack access."}
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-purple-500/30 flex flex-col items-center relative py-12 px-4 sm:px-6">
      {/* Background Radiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-6xl relative z-10 flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: The Canvas (Form Editor) */}
        <div className="flex-1 w-full space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Navigation / Back */}
          <div className="flex items-center justify-between">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Generator
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Dashboard
            </Link>
          </div>

          {/* Global Preview Banner */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg shadow-indigo-500/5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
                👁️
              </span>
              <div>
                <p className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                  Studio Mode
                  {isAiSyncing && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-[9px] text-white uppercase tracking-widest animate-pulse border border-indigo-400/30">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      Saving
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-indigo-400/70 mt-0.5">
                  AI-Powered Real-time Form Editor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${formData.isPublished ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]"}`}
              />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                {formData.isPublished ? "Live" : "Draft"}
              </span>
            </div>
          </div>

          <div className="relative group">
            <SmartForm
              title={formData.title}
              fields={formData.fields}
              onUpdate={handleAiUpdate}
            />
          </div>

          {/* Publishing / Share Actions Card */}
          <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-md transition-all hover:bg-white/[0.03] hover:border-white/[0.1]">
            {formData.isPublished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
                      <Share2 className="w-5 h-5 text-indigo-400" /> Share your
                      form
                    </h3>
                    <p className="text-xs text-zinc-400 font-light">
                      Your form is live and actively collecting responses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePublishToggle}
                    disabled={isToggling}
                    className="text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-tighter transition-colors disabled:opacity-50"
                  >
                    {isToggling ? "Taking Offline..." : "Go Offline"}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <LinkIcon className="w-4 h-4 text-indigo-400/50" />
                    </div>
                    <input
                      type="text"
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/f/${formData.slug}`}
                      readOnly
                      className="w-full pl-11 pr-4 py-4 bg-black/60 border border-white/10 rounded-2xl text-zinc-300 text-[13px] font-mono focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-medium text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/10 active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-2">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-medium text-white">
                    Publish to Public
                  </h3>
                  <p className="text-sm text-zinc-500 font-light max-w-sm">
                    Make your form available to the world and start collecting
                    real-time submissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePublishToggle}
                  disabled={isToggling}
                  className="px-10 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-sm transition-all shadow-2xl active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  {isToggling ? "Publishing..." : "Launch Form Now"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The AI Copilot (Sticky Sidebar on Desktop, Modal on Mobile) */}
        <div
          className={`
          w-full lg:w-[420px] lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-700
          ${isMobileChatOpen ? "fixed inset-0 z-50 p-4 bg-[#09090b]/95 backdrop-blur-3xl flex" : "hidden lg:flex"}
        `}
        >
          <div className="flex-1 rounded-[2.5rem] bg-black/40 border border-white/[0.08] backdrop-blur-3xl overflow-hidden shadow-3xl flex flex-col ring-1 ring-white/10 group h-full">
            {/* Assistant Header */}
            <div className="px-8 py-5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                  <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                </div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase">
                  AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-400 font-mono">
                  Studio v2.0
                </div>
                {/* Mobile Close Button */}
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Close Chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />
              <TamboThreadInputProvider>
                <FormAssistant />
              </TamboThreadInputProvider>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
            </div>
          </div>

          {/* Quick Tips Tooltip */}
          <div className="px-6 py-5 bg-white/[0.02] rounded-[2rem] border border-white/[0.05] flex items-center gap-4 transition-all hover:border-indigo-500/30">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Quick Command
              </p>
              <p className="text-[12px] text-zinc-300 leading-tight italic">
                "Make the title more catchy and add a phone field"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Toggle Button (Visible only when chat is closed on mobile) */}
      {!isMobileChatOpen && (
        <button
          onClick={() => setIsMobileChatOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-[0_4px_30px_rgba(99,102,241,0.5)] flex items-center justify-center transition-all active:scale-95 border border-indigo-400/50"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      )}
    </div>
  );
}
