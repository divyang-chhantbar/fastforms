"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
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

function renderField(
  field: Field,
  value: any,
  onChange: (fieldId: string, value: any) => void,
) {
  const commonClasses =
    "w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-70";

  switch (field.type) {
    case "text":
    case "email":
      return (
        <input
          type={field.type}
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={commonClasses}
        />
      );

    case "textarea":
      return (
        <textarea
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${commonClasses} min-h-[120px] resize-y`}
        />
      );

    case "select":
      return (
        <select
          name={field.id}
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={commonClasses}
        >
          <option value="" className="bg-zinc-900 text-zinc-400">
            Select an option
          </option>
          {field.options?.map((option: string) => (
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
          {field.options?.map((option: string) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name={field.id}
                value={option}
                required={field.required}
                checked={value === option}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-4 h-4 text-indigo-500 bg-white/5 border-white/20 focus:ring-indigo-500/50 focus:ring-2 cursor-pointer"
              />
              <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-3 mt-2">
          {field.options?.map((option: string) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={option}
                checked={value?.includes(option) || false}
                onChange={(e) => {
                  const currentValues = value || [];
                  const newValues = e.target.checked
                    ? [...currentValues, option]
                    : currentValues.filter((v: string) => v !== option);
                  onChange(field.id, newValues);
                }}
                className="w-4 h-4 rounded text-indigo-500 bg-white/5 border-white/20 focus:ring-indigo-500/50 focus:ring-2 cursor-pointer"
              />
              <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                {option}
              </span>
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
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
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

export default function PublicFormPage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/forms/${slug}`);
        setFormData(response.data.data);
      } catch (error: any) {
        setError(error.message || "Failed to load form details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, [slug]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/forms/submit", {
        formId: formData?.id,
        data: formValues,
      });

      setSubmitSuccess(true);
      setFormValues({});
    } catch (error: any) {
      console.error("Form submission failed:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-light">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-medium text-white mb-2">Unavailable</h2>
        <p className="text-zinc-400 max-w-sm mx-auto">
          {error || "This form does not exist or has been taken offline."}
        </p>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
          Thank you!
        </h2>
        <p className="text-zinc-400 mb-8 max-w-sm">
          Your response has been submitted successfully.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-purple-500/30 flex flex-col items-center relative py-12 px-4 sm:px-6">
      {/* Background Radiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Form Container Card */}
        <div className="rounded-[2rem] bg-black/40 border border-white/[0.08] backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Inner Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center">
            {formData.title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {formData.fields.map((field: Field) => (
              <div key={field.id} className="space-y-2 group">
                <label className="block text-sm font-medium text-zinc-300 tracking-wide">
                  {field.label}
                  {field.required && (
                    <span className="text-indigo-400 ml-1">*</span>
                  )}
                </label>
                {renderField(field, formValues[field.id], handleFieldChange)}
              </div>
            ))}

            <div className="pt-6 border-t border-white/[0.05]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Response"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Simple Footer Attribution */}
        <div className="mt-8 text-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Powered by
            <span className="flex items-center gap-1.5 text-white">
              <svg
                width="14"
                height="14"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6C6 4.89543 6.89543 4 8 4H24C27.3137 4 30 6.68629 30 10C30 13.3137 27.3137 16 24 16H6V6Z"
                  fill="currentColor"
                />
                <path
                  d="M6 14C6 12.8954 6.89543 12 8 12H20C22.7614 12 25 14.2386 25 17C25 19.7614 22.7614 22 20 22H6V14Z"
                  fill="currentColor"
                  fillOpacity="0.75"
                />
                <path
                  d="M6 22C6 20.8954 6.89543 20 8 20H14C16.2091 20 18 21.7909 18 24C18 26.2091 16.2091 28 14 28H8C6.89543 28 6 27.1046 6 26V22Z"
                  fill="currentColor"
                  fillOpacity="0.5"
                />
              </svg>
              FastForms
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
