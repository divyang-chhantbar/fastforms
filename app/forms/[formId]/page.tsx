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
} from "lucide-react";
import Link from "next/link";

interface Field {
  id: string;
  type: string;
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
      const response = await axios.patch(`/api/forms/${formId}`);
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Navigation / Back */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Generator
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Global Preview Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg shadow-indigo-500/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400">
              👁️
            </span>
            <div>
              <p className="text-sm font-medium text-indigo-300">
                Preview Mode
              </p>
              <p className="text-xs text-indigo-400/70 mt-0.5">
                This is a read-only view of your generated form.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${formData.isPublished ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]"}`}
            />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              {formData.isPublished ? "Live" : "Draft"}
            </span>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="rounded-[2rem] bg-black/40 border border-white/[0.08] backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Inner Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center">
            {formData.title}
          </h1>

          <form className="space-y-8">
            {formData.fields.map((field: Field) => (
              <div key={field.id} className="space-y-2 group">
                <label className="block text-sm font-medium text-zinc-300 tracking-wide">
                  {field.label}
                  {field.required && (
                    <span className="text-indigo-400 ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </form>
        </div>

        {/* Publishing / Share Actions Card */}
        <div className="mt-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-6 sm:p-8 backdrop-blur-md">
          {formData.isPublished ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
                  <Share2 className="w-5 h-5 text-indigo-400" /> Share your form
                </h3>
                <p className="text-sm text-zinc-400">
                  Your form is live and ready to collect responses.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/f/${formData.slug}`}
                    readOnly
                    className="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 text-sm font-mono focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    "Copy Link"
                  )}
                </button>
              </div>

              <div className="pt-6 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={handlePublishToggle}
                  disabled={isToggling}
                  className="text-sm text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isToggling
                    ? "Unpublishing..."
                    : "Take form offline (Unpublish)"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left p-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  Ready to go live?
                </h3>
                <p className="text-sm text-zinc-400">
                  Publish this form to generate a public link and start
                  collecting responses.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePublishToggle}
                disabled={isToggling}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 whitespace-nowrap"
              >
                {isToggling ? "Publishing..." : "Publish Form"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
