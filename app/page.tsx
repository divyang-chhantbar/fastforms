import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Zap,
  Shield,
  Blocks,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden font-sans selection:bg-purple-500/30 w-full flex flex-col items-center scrollbar-hide">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-8 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5 text-xl font-medium tracking-tight text-white">
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
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-zinc-300">
          <Link href="#about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link href="#faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
          <Link
            href="https://divyang-chhantbar-fastforms-2.mintlify.app/"
            className="hover:text-white transition-colors"
          >
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-6 text-[13px] font-medium">
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2.5 rounded-[2rem] bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors mr-2"
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
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 w-full overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 -z-20 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(20,20,30,1)_0%,rgba(9,9,11,1)_100%)]"></div>

        <div className="relative z-20 flex flex-col items-center gap-6 mt-[-15vh]">
          <h1 className="text-5xl sm:text-[64px] md:text-[72px] font-medium tracking-tight text-center max-w-[800px] text-white leading-[1.05]">
            Elevate Your <br />
            Form Creation
          </h1>

          <p className="text-sm sm:text-[15px] text-zinc-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] max-w-[420px] font-light text-center leading-[1.6]">
            Unlock your productivity in a fully regulated{" "}
            <br className="hidden sm:block" />
            environment, powered by FastForms
          </p>

          <div className="mt-4 relative z-20">
            <Link
              href="/generate"
              className="px-7 py-3.5 bg-white text-black hover:bg-zinc-100 rounded-[2rem] font-medium transition-all shadow-[0_4px_30px_rgba(255,255,255,0.15)] flex items-center justify-center text-[13px]"
            >
              Start Generating
            </Link>
          </div>
        </div>

        {/* THE LIQUID ORB ANIMATION AT THE BOTTOM */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] sm:w-[1400px] sm:h-[1200px] z-0 pointer-events-none">
          <div
            className="absolute inset-0 w-full h-full animate-liquid-orb-bottom mx-auto"
            style={{
              background:
                "radial-gradient(circle at 50% 10%, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%)",
              boxShadow:
                "inset 0px 100px 200px -40px rgba(255, 230, 180, 0.45), inset -120px -100px 150px -30px rgba(0, 150, 255, 0.35), inset 120px -60px 150px -30px rgba(255,100,0,0.25)",
              borderTop: "2px solid rgba(255,255,255,0.85)",
            }}
          >
            {/* Inner glossy reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-[inherit] mix-blend-overlay"></div>
          </div>
        </div>

        {/* Floating Glassmorphic Cards */}
        <div className="hidden md:flex absolute bottom-[15%] left-[5%] lg:left-[15%] xl:left-[22%] flex-col gap-2 p-5 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl w-64 items-start z-20">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium tracking-wide w-full">
            <span>Form Types</span>
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
              <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col gap-1 pr-10 pt-1 w-full relative">
            <div className="text-sm font-medium text-white shadow-sm leading-snug tracking-tight">
              Unparalleled
              <br />
              Access
            </div>
            <div className="absolute right-0 bottom-0 text-[10px] text-zinc-500 font-mono">
              46%
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute bottom-[10%] right-[5%] lg:right-[15%] xl:right-[22%] flex-col gap-1 p-5 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl w-56 items-start z-20">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium tracking-wide w-full">
            <span>Success Rate</span>
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
              <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
            </div>
          </div>
          <div className="flex items-end gap-1 mt-2">
            <div className="text-4xl font-medium text-white leading-none tracking-tight">
              96%
            </div>
          </div>
          <div className="h-[2px] w-full bg-white/20 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-white w-[96%]" />
          </div>
        </div>
      </main>

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 mt-10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">
            Our Mission
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white max-w-3xl">
            Redefining web infrastructure through intelligent form generation.
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg font-light mt-6 leading-relaxed">
            We built FastForms to bridge the gap between complex data collection
            requirements and modern design aesthetics. Our infrastructure allows
            you to deploy high-converting, fully customized forms without
            writing a single line of tedious configuration code.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 mt-20"
      >
        <div className="flex flex-col items-center text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Intelligence at your fingertips
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg font-light">
            Building forms doesn't have to be tedious. Our AI engine understands
            your context and designs the perfect interface natively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-blue-400" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 mb-6 text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
              Lightning Fast
            </h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              Forms are generated in milliseconds. What used to take hours of
              dragging and dropping now happens instantly with a single prompt.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Blocks className="w-24 h-24 text-purple-400" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 mb-6 text-purple-400">
              <Blocks className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
              Highly Scalable
            </h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              Whether you need a simple contact form or a multi-step dynamic
              onboarding flow, our engine scales and adapts to your
              requirements.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="w-24 h-24 text-emerald-400" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-6 text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
              Enterprise Security
            </h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              Built with native security first. Submissions are encrypted, fully
              compliant, and routed directly to your secure dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 border-t border-white/[0.05]"
      >
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              How it works
            </h2>
            <p className="text-zinc-400 text-lg font-light mb-10">
              We've simplified the entire form building process into natural
              language. No more complex configuration dashboards.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm border border-white/20 shrink-0 text-white font-medium">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Describe what you want
                  </h4>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed">
                    Tell our AI exactly what kind of form you need using plain
                    English. E.g. "Lead capture for real estate."
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm border border-white/20 shrink-0 text-white font-medium">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Watch the engine build it
                  </h4>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed">
                    Our AI interprets requirements, sets up validation, schemas,
                    and instantly drafts the UI in real-time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm border border-indigo-500/30 shrink-0 text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Publish and collect data
                  </h4>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed">
                    Share the link or embed the custom portal and watch
                    responses flow into your secure dashboard instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/generate"
                className="text-white flex items-center gap-2 hover:gap-4 transition-all pb-1 border-b border-transparent hover:border-white w-fit font-medium"
              >
                Try it yourself <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual Panel for right side */}
          <div className="md:w-1/2 w-full">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[3rem] bg-white/[0.02] border border-white/[0.05] p-6 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>

              {/* Fake UI component showing form execution */}
              <div className="w-full max-w-sm bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                  <div className="h-4 w-4 rounded-full bg-green-500/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                  <div className="h-12 w-full bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center px-4">
                    <div className="h-3 w-20 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                  <div className="h-12 w-full bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center px-4">
                    <div className="w-[1px] h-5 bg-indigo-500/80 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-12 w-full bg-white text-black font-semibold text-sm flex items-center justify-center rounded-xl mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Submit Data
                </div>
              </div>

              {/* Aesthetic Floating blur */}
              <div className="absolute bottom-10 -right-10 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full"></div>
              <div className="absolute top-10 -left-10 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="relative z-10 w-full max-w-3xl mx-auto px-6 py-32 border-t border-white/[0.05]"
      >
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-lg font-light">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How fast is form generation?",
              a: "Forms are generated in milliseconds. Our AI model immediately drafts the schema and renders the UI natively.",
            },
            {
              q: "Is the data fully secure?",
              a: "Absolutely. We employ enterprise-grade encryption at rest and in transit, ensuring fully compliant data collection.",
            },
            {
              q: "How does the AI understand my requirements?",
              a: "We use advanced large language models trained specifically on web patterns to translate your natural language descriptions into functional, validated form structures.",
            },
            {
              q: "Can I export the responses?",
              a: "Yes, you can export the responses in CSV format",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
            >
              <h3 className="text-white font-medium mb-3 pr-6">{faq.q}</h3>
              <p className="text-zinc-400 font-light text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.05] py-12 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-medium text-white tracking-tight">
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
          </div>

          <div className="flex items-center justify-center text-[13px]">
            <p>
              Made with ❤️ by{" "}
              <a
                href="https://divyang-chhantbar.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition-colors font-medium"
              >
                Divyang
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/DChhantbar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/divyang-chhantbar/fastforms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/divyang-chhantbar-9828b91a5/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
