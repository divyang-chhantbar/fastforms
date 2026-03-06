import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden font-sans flex items-center justify-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 via-amber-500/5 to-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-4 flex flex-col items-center">
        <SignIn
          appearance={{
            variables: {
              colorBackground: "#000000",
              colorText: "#ffffff",
              colorPrimary: "#ffffff",
              colorTextOnPrimaryBackground: "#000000",
              colorInputBackground: "#09090b",
              colorInputText: "#ffffff",
              colorDanger: "#ef4444",
            },
            elements: {
              card: "border border-white/[0.08] shadow-2xl bg-black/60 backdrop-blur-3xl rounded-2xl p-8",
              headerTitle: "text-2xl font-semibold tracking-tight",
              headerSubtitle: "text-zinc-500 text-sm",
              socialButtonsBlockButton:
                "border border-white/10 hover:bg-white/5 transition-colors text-white",
              socialButtonsBlockButtonText: "font-medium text-sm text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-zinc-500 text-xs",
              formFieldLabel: "text-zinc-400 font-medium",
              formFieldInput:
                "bg-[#0a0a0c] border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-xl px-4 py-2 transition-all",
              formButtonPrimary:
                "bg-white text-black hover:bg-zinc-200 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]",
              footerActionText: "text-zinc-500",
              footerActionLink: "text-white hover:text-zinc-300 font-medium",
              identityPreview: "border border-white/10 bg-white/5",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-zinc-400 hover:text-white",
            },
          }}
        />
      </div>
    </div>
  );
}
