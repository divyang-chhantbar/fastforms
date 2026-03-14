"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AiPrompt() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/forms/generate", { prompt });
      const { formId } = response.data;
      router.push(`/forms/${formId}`);
    } catch (error) {
      console.error("Form generation failed:", error);
      setError("Form generation failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden font-sans flex flex-col items-center">
      {/* Top Navigation / Header */}
      <nav className="relative z-20 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-medium tracking-tight hover:opacity-80 transition-opacity text-white"
        >
          <svg
            width="26"
            height="26"
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
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-8 h-8 rounded-full border border-white/20 hover:border-white/40 transition-colors",
                userButtonPopoverCard:
                  "bg-black/90 border border-white/10 backdrop-blur-xl text-white shadow-2xl rounded-2xl",
                userButtonPopoverActionButtonText: "text-zinc-300",
                userButtonPopoverActionButtonIcon: "text-zinc-400",
              },
            }}
          />
        </div>
      </nav>

      {/* Glowing Center Ambient Shape */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none transition-all duration-[3000ms] ease-in-out ${isLoading ? "bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-blue-500/30 blur-[130px] scale-125 animate-pulse" : "bg-gradient-to-tr from-white/5 via-white/5 to-blue-500/10 blur-[100px] scale-100"}`}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 mt-[-10vh]">
        <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8">
          {/* Header specific to the form generator */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
              {isLoading
                ? "Crafting your form..."
                : "What do you want to build?"}
            </h1>
            <p className="text-lg text-zinc-400 font-light max-w-xl mx-auto">
              {isLoading
                ? "Our highly trained models are interpreting your request and designing the perfect interface."
                : "Describe the exact flow, inputs, and purpose of your form. Our AI will do the heavy lifting."}
            </p>
          </div>

          {/* Premium Input Glass Card */}
          <div
            className={`w-full relative transition-all duration-700 ease-in-out ${isLoading ? "opacity-0 scale-95 pointer-events-none absolute" : "opacity-100 scale-100"}`}
          >
            <div className="absolute inset-[-1px] bg-gradient-to-b from-white/[0.15] to-transparent rounded-3xl pointer-events-none"></div>
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-2xl rounded-3xl p-3 flex flex-col">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (prompt.trim()) {
                      handleGenerate();
                    }
                  }
                }}
                placeholder="E.g. 'Create a beautiful multi-step onboarding form for a real estate agency with name, email, budget, and location preferences...'"
                className="w-full h-40 sm:h-48 p-5 bg-transparent text-white placeholder:text-zinc-600 outline-none resize-none font-light text-lg sm:text-xl leading-relaxed"
              />

              <div className="flex items-center justify-between px-4 pb-2 pt-4 border-t border-white/[0.05]">
                <div className="text-xs text-zinc-500 font-medium tracking-wide flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
                  AI ACTIVE
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white rounded-full font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2"
                >
                  Generate
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm max-w-md mx-auto">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
