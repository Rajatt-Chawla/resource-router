"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const selectedResource = resources.find((r) => r.id === selectedId);

  const handleFollow = () => {
    window.open("https://www.instagram.com/rajatchawla.ai", "_blank");
    setVerifying(true);
  };

  React.useEffect(() => {
    if (verifying && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setCompleted(true);
      setVerifying(false);
    }
  }, [verifying, countdown]);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">Resource Router</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Select a resource to unlock</p>
      </div>

      <Select onValueChange={(v: string) => {
        setSelectedId(v);
        setVerifying(false);
        setCountdown(10);
        setCompleted(false);
      }}>
        <SelectTrigger className="w-full bg-zinc-900 border-white/10 h-12 rounded-lg focus:ring-0">
          <SelectValue placeholder="CHOOSE RESOURCE..." />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white">
          {resources.map(r => (
            <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedId && (
        <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3">
            <Button 
              className={`w-full h-12 rounded-lg font-bold text-[11px] uppercase tracking-wider ${
                completed ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-white text-black hover:bg-zinc-200"
              }`}
              disabled={verifying || completed}
              onClick={handleFollow}
            >
              {verifying ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Verifying ({countdown}s)</span>
              ) : completed ? (
                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Identity Verified</span>
              ) : (
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Step 1: Follow to Unlock</span>
              )}
            </Button>

            <Button 
              className="w-full h-12 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-30 font-bold text-[11px] uppercase tracking-wider"
              disabled={!completed}
              onClick={() => window.open(selectedResource?.link, "_blank")}
            >
              <span className="flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Step 2: Get Resource</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
