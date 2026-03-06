"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  PlusCircle,
  Trash2,
  FileText,
  ChevronRight,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface Form {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  _count: {
    responses: number;
  };
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("/api/getAllForms");
        setForms(response.data.forms);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Failed to fetch forms");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleDelete = async (formId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete this form? This action cannot be undone.",
      )
    ) {
      return;
    }
    setDeletingFormId(formId);
    try {
      const response = await axios.delete(`/api/forms/${formId}`);
      if (response.data.success) {
        setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
      } else {
        alert(
          "Failed to delete form: " + (response.data.error || "Unknown error"),
        );
      }
    } catch (error) {
      alert("An error occurred while deleting the form.");
    } finally {
      setDeletingFormId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans flex overflow-hidden selection:bg-purple-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/[0.05] bg-black/40 backdrop-blur-xl flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-white/[0.05]">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-medium tracking-tight hover:opacity-80 transition-opacity text-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                <path
                  d="M6 6C6 4.89543 6.89543 4 8 4H24C27.3137 4 30 6.68629 30 10C30 13.3137 27.3137 16 24 16H6V6Z"
                  fill="white"
                />
                <path
                  d="M6 14C6 12.8954 6.89543 12 8 12H20C22.7614 12 25 14.2386 25 17C25 19.7614 22.7614 22 20 22H6V14Z"
                  fill="white"
                  fillOpacity="0.75"
                />
                <path
                  d="M6 22C6 20.8954 6.89543 20 8 20H14C16.2091 20 18 21.7909 18 24C18 26.2091 16.2091 28 14 28H8C6.89543 28 6 27.1046 6 26V22Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
              FastForms
            </Link>
          </div>
          <nav className="p-4 space-y-1.5 mt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-medium text-sm border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              Dashboard
            </Link>
            <Link
              href="/generate"
              className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-all border border-transparent"
            >
              <PlusCircle className="w-4 h-4" />
              Create New
            </Link>
          </nav>
        </div>

        {/* User Profile Section in Sidebar */}
        <div className="p-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "w-8 h-8 rounded-full border border-white/20",
                  userButtonPopoverCard:
                    "bg-black/90 border border-white/10 backdrop-blur-xl text-white shadow-2xl rounded-2xl",
                  userButtonPopoverActionButtonText: "text-zinc-300",
                  userButtonPopoverActionButtonIcon: "text-zinc-400",
                },
              }}
            />
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-sm font-medium text-white leading-none">
                Account
              </span>
              <span className="text-xs text-zinc-500 mt-1">Manage profile</span>
            </div>
            <Settings className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto w-full">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 py-10 sm:px-10 sm:py-16">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
                My Forms
              </h1>
              <p className="text-zinc-400 text-sm">
                Manage and track responses for your generated forms.
              </p>
            </div>
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <PlusCircle className="w-4 h-4" /> New Form
            </Link>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-red-300 hover:text-white transition-colors underline"
              >
                Try Again
              </button>
            </div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 rounded-[2rem] bg-black/40 border border-white/[0.05] backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-zinc-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No forms created yet
              </h3>
              <p className="text-zinc-400 max-w-sm mb-8">
                Get started by generating your first AI-powered form in seconds.
              </p>
              <Link
                href="/generate"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium text-sm hover:from-indigo-600 hover:to-purple-600 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                Create First Form
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div
                  key={form.id}
                  onClick={() => router.push(`/forms/${form.id}/responses`)}
                  className="group relative flex flex-col bg-black/40 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 hover:bg-white/[0.02] hover:border-white/[0.15] transition-all cursor-pointer overflow-hidden shadow-2xl shadow-black/50"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex-1">
                    <h2 className="text-xl font-medium text-white mb-2 line-clamp-1 group-hover:text-indigo-200 transition-colors">
                      {form.title}
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono mb-6">
                      Created{" "}
                      {new Date(form.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-between pt-5 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                        {form._count.responses} Responses
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(form.id, e)}
                        disabled={deletingFormId === form.id}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-2 text-zinc-500 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
