"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, Lock, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const resources = [
  {
    id: "forage-internship",
    label: "Forage Virtual Internship",
    link: "https://www.theforage.com/virtual-internships",
  }
];

export function ResourceGating() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [countdown, setCountdown] = React.useState(10);
  const [completed, setCompleted] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = React.useState(false);

  const selectedResource = resources.find((r) => r.id === selectedId);

  // Load state on mount (avoids Next.js SSR hydration mismatch)
  React.useEffect(() => {
    setIsMounted(true);
    
    try {
      // 1. Check if user already followed (completed verification once)
      const isFollowed = localStorage.getItem("gated_is_followed") === "true";
      if (isFollowed) {
        setCompleted(true);
      }

      // 2. Check for active/interrupted verification sessions
      const savedSelectedId = localStorage.getItem("gated_selected_resource_id");
      const verifyingStart = localStorage.getItem("gated_verifying_start_time");

      if (savedSelectedId) {
        setSelectedId(savedSelectedId);
        
        if (!isFollowed && verifyingStart) {
          const startTime = parseInt(verifyingStart, 10);
          if (!isNaN(startTime)) {
            const elapsed = Date.now() - startTime;
            if (elapsed >= 10000) {
              // The 10s timer has completed while they were away!
              setCompleted(true);
              setVerifying(false);
              setCountdown(0);
              localStorage.setItem("gated_is_followed", "true");
              localStorage.removeItem("gated_verifying_start_time");
            } else {
              // Timer is still running, calculate remaining seconds and resume
              const remaining = Math.ceil((10000 - elapsed) / 1000);
              setCountdown(remaining);
              setVerifying(true);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
  }, []);

  // Timer effect
  React.useEffect(() => {
    let timer: any;
    if (verifying && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            setCompleted(true);
            setVerifying(false);
            try {
              localStorage.setItem("gated_is_followed", "true");
              localStorage.removeItem("gated_verifying_start_time");
            } catch (e) {
              console.error(e);
            }
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [verifying, countdown]);

  const handleResourceChange = (value: string | null) => {
    setSelectedId(value);
    setVerifying(false);
    
    try {
      if (value) {
        localStorage.setItem("gated_selected_resource_id", value);
      } else {
        localStorage.removeItem("gated_selected_resource_id");
      }

      const isFollowed = localStorage.getItem("gated_is_followed") === "true";
      if (isFollowed) {
        setCompleted(true);
        setCountdown(0);
      } else {
        setCompleted(false);
        setCountdown(10);
        localStorage.removeItem("gated_verifying_start_time");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollow = () => {
    if (!selectedId) return;

    try {
      localStorage.setItem("gated_verifying_start_time", Date.now().toString());
      localStorage.setItem("gated_selected_resource_id", selectedId);
    } catch (e) {
      console.error(e);
    }

    setVerifying(true);
    setCountdown(10);

    // Open Instagram in a new tab
    const instagramUrl = "https://www.instagram.com/rajatchawla.ai";
    window.open(instagramUrl, "_blank");
  };

  const resetAllProgress = () => {
    try {
      localStorage.removeItem("gated_is_followed");
      localStorage.removeItem("gated_selected_resource_id");
      localStorage.removeItem("gated_verifying_start_time");
    } catch (e) {
      console.error(e);
    }
    setSelectedId(null);
    setVerifying(false);
    setCountdown(10);
    setCompleted(false);
    setShowTroubleshoot(false);
  };

  if (!isMounted) {
    return (
      <div className="w-full max-w-sm space-y-6 animate-pulse">
        <div className="space-y-2 text-center">
          <div className="h-6 w-32 bg-zinc-800 rounded mx-auto" />
          <div className="h-3 w-48 bg-zinc-800 rounded mx-auto" />
        </div>
        <div className="h-12 w-full bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">Resource Router</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Select a resource to unlock</p>
      </div>

      <Select value={selectedId || ""} onValueChange={handleResourceChange}>
        <SelectTrigger className="w-full bg-zinc-900 border-white/10 h-12 rounded-lg focus:ring-0 text-white">
          <SelectValue placeholder="CHOOSE RESOURCE..." />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white">
          {resources.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedId && (
        <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3">
            {/* Step 1: Follow Button */}
            <Button
              className={`w-full h-12 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-350 ${
                completed
                  ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                  : verifying
                  ? "bg-zinc-900 text-white border border-white/10 cursor-not-allowed"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
              disabled={verifying || completed}
              onClick={handleFollow}
            >
              {verifying ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Verifying Follow ({countdown}s)
                </span>
              ) : completed ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Step 1: Follow Verified
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Step 1: Follow to Unlock
                </span>
              )}
            </Button>

            {/* Instruction Overlay for Mobile Users */}
            {verifying && (
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 text-left">
                <div className="flex gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    <strong className="text-white">Instagram is opening!</strong> Please follow{" "}
                    <span className="text-white font-semibold">@rajatchawla.ai</span>. Once done, simply{" "}
                    <strong className="text-white">switch back or press back</strong> to this screen.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                  <a
                    href="https://www.instagram.com/rajatchawla.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1.5 underline decoration-zinc-600 underline-offset-4"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 animate-pulse" />
                    Not redirected? Click here to open Instagram
                  </a>
                  <p className="text-[9px] text-zinc-500 italic">
                    Tip: If you are on mobile and got stuck, just follow and click the bio link again—it will be automatically unlocked!
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Get Resource Button */}
            <Button
              className={`w-full h-12 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-350 ${
                completed
                  ? "bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-700 hover:to-zinc-800 border border-white/10"
                  : "bg-zinc-950 text-zinc-500 border border-white/5 cursor-not-allowed"
              }`}
              disabled={!completed}
              onClick={() => {
                if (selectedResource?.link) {
                  window.open(selectedResource.link, "_blank");
                }
              }}
            >
              <span className="flex items-center gap-2">
                <ExternalLink className={`w-4 h-4 ${completed ? "text-white" : "text-zinc-500"}`} />
                Step 2: Get Resource
              </span>
            </Button>
          </div>

          {/* Help & Troubleshoot Accordion */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mx-auto transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              {showTroubleshoot ? "Hide troubleshooting" : "Trouble unlocking?"}
            </button>

            {showTroubleshoot && (
              <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-white/5 text-left text-[10px] text-zinc-400 space-y-2 animate-in fade-in duration-200">
                <p>
                  1. <strong className="text-zinc-300">Stuck in App?</strong> If Instagram opened and closed this window, just follow and click the bio link again—your state is saved and it will unlock automatically!
                </p>
                <p>
                  2. <strong className="text-zinc-300">Not Loading?</strong> Open this page in Safari or Chrome instead of Instagram's built-in browser by clicking the three dots in the top-right corner.
                </p>
                <button
                  onClick={resetAllProgress}
                  className="w-full mt-2 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all font-semibold uppercase text-[9px] tracking-wider"
                >
                  Reset Verification State
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
