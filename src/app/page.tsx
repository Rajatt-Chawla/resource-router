import { ResourceGating } from "@/components/ResourceGating";
import { Briefcase, Globe, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white p-6">
      <main className="w-full max-w-md flex flex-col items-center">
        {/* Core Logic */}
        <ResourceGating />

        {/* Minimal Footer */}
        <footer className="mt-12 w-full pt-8 border-t border-white/5 opacity-40">
          <p className="text-center text-[8px] text-zinc-600 uppercase tracking-[0.4em] font-mono">
            &copy; 2026 RAJAT CHAWLA. AI PIPELINE.
          </p>
        </footer>
      </main>
    </div>
  );
}
