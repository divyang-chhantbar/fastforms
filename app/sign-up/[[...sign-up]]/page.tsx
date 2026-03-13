import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden font-sans flex items-center justify-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 via-amber-500/5 to-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-4 flex flex-col items-center">
        <SignUp
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: "border border-white/[0.08] shadow-2xl bg-black/40 backdrop-blur-3xl rounded-2xl p-8",
              headerTitle: "text-2xl font-semibold tracking-tight text-white",
              headerSubtitle: "text-zinc-400 text-sm",
              socialButtonsBlockButton: "border border-white/10 hover:bg-white/5 transition-colors text-white",
              socialButtonsBlockButtonText: "font-medium text-sm text-white",
              formFieldLabel: "text-zinc-300 font-medium",
              formFieldInput: "bg-white/5 border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-xl px-4 py-2 transition-all",
              formButtonPrimary: "bg-white text-black hover:bg-zinc-200 py-2.5 rounded-xl font-medium transition-colors",
              footerActionLink: "text-white hover:text-zinc-300 font-medium",
            }
          }}
        />
      </div>
    </div>
  );
}
