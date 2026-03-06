"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  ChevronLeft,
  ChevronDown,
  Download,
  FileText,
  Inbox,
} from "lucide-react";
import Link from "next/link";

type Response = {
  id: string;
  formId: string;
  data: Record<string, any>;
  createdAt: string;
};

export default function ResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [formTitle, setFormTitle] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        if (!formId) return;
        const response = await axios.get<{
          success: boolean;
          formTitle: string;
          totalResponses: number;
          responses: Response[];
        }>(`/api/forms/${formId}/responses`);
        setFormTitle(response.data.formTitle);
        setResponses(response.data.responses);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error ?? err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchResponses();
  }, [formId]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`/api/forms/${formId}/export`);
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      // create a link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formTitle}-responses.csv`;

      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedResponseId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="text-sm text-red-300 hover:text-white transition-colors underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-purple-500/30 relative py-12 px-6 overflow-hidden">
      {/* Background Radiance */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
              {formTitle}
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                {responses.length}{" "}
                {responses.length === 1 ? "Response" : "Responses"}
              </span>
              <Link
                href={`/forms/${formId}`}
                className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> View Form Settings
              </Link>
            </div>
          </div>

          {responses.length > 0 && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2.5 bg-white text-black rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "Exporting..." : "Export to CSV"}
            </button>
          )}
        </div>

        {/* Responses Content */}
        {responses.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 rounded-[2rem] bg-black/40 border border-white/[0.05] backdrop-blur-md text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
              <Inbox className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No responses yet
            </h3>
            <p className="text-zinc-400 max-w-sm">
              Share your form link to start collecting data. Responses will
              appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {responses.map((response, index) => {
              const isExpanded = expandedResponseId === response.id;
              const firstKey = Object.keys(response.data)[0];
              const firstValue = firstKey ? response.data[firstKey] : null;

              return (
                <div
                  key={response.id}
                  className="flex flex-col rounded-[1.25rem] bg-black/40 border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.02] hover:border-white/[0.15] transition-all shadow-xl group overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(response.id)}
                    className="flex justify-between items-center p-5 sm:p-6 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-white group-hover:text-indigo-200 transition-colors">
                        Submission #{responses.length - index}
                      </span>
                      <span className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md hidden sm:block font-mono">
                        {new Date(response.createdAt).toLocaleString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {!isExpanded && firstKey && (
                        <span className="text-sm text-zinc-500 max-w-[150px] sm:max-w-[200px] truncate hidden md:block">
                          <span className="text-zinc-600 mr-1">
                            {firstKey}:
                          </span>
                          {Array.isArray(firstValue)
                            ? firstValue.join(", ")
                            : String(firstValue || "—")}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isExpanded ? "rotate-180 text-white" : ""}`}
                      />
                    </div>
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 pt-0 sm:p-6 sm:pt-0 border-t border-white/[0.05] mt-2">
                        <div className="space-y-4 pt-6">
                          {Object.entries(response.data).map(([key, value]) => (
                            <div key={key} className="flex flex-col space-y-1">
                              <span className="text-xs font-medium uppercase tracking-wider text-indigo-400/80">
                                {key}
                              </span>
                              <span className="text-sm text-zinc-200 bg-white/[0.03] border border-white/[0.05] px-4 py-3 rounded-xl break-words whitespace-pre-wrap">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : String(value || "—")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
