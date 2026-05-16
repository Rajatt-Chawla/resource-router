"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const resources = [
  {
    id: "forage-internship",
    label: "Forage Virtual Internship",
    link: "https://www.theforage.com/virtual-internships",
  }
];

export function ResourceGating() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [step1Status, setStep1Status] = React.useState<"locked" | "verifying" | "completed">("locked");
  const [countdown, setCountdown] = React.useState(10);
  const [step2Status, setStep2Status] = React.useState<"locked" | "ready">("locked");

  const selectedResource = resources.find((r) => r.id === selectedId);

  const handleFollowClick = () => {
    // Open Instagram in new tab
    window.open("https://www.instagram.com/rajatchawla.ai", "_blank");
    
    // Start verification process
    setStep1Status("verifying");
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step1Status === "verifying" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setStep1Status("completed");
      setStep2Status("ready");
    }
    return () => clearInterval(timer);
  }, [step1Status, countdown]);

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in duration-1000">
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
          Select Deployment Target
        </label>
        {/* Explicitly cast value as string to fix Vercel TS build error */}
        <Select onValueChange={(value: string) => {
          setSelectedId(value);
          setStep1Status("locked");
          setCountdown(10);
          setStep2Status("locked");
        }}>
          <SelectTrigger className="w-full bg-zinc-900/50 border-white/5 h-14 rounded-none hover:bg-zinc-900 transition-colors focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="CHOOSE A TECHNICAL RESOURCE..." />
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-white/10 text-zinc-100 rounded-none">
            {resources.map((resource) => (
              <SelectItem key={resource.id} value={resource.id} className="focus:bg-zinc-900 rounded-none py-3 cursor-pointer">
                {resource.label.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedId && (
        <Card className="border-white/10 bg-zinc-950/50 backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-8 duration-700 hover:border-white/20 transition-all group relative rounded-none">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-900 blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-zinc-950 p-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] border-white/10 px-2 py-0.5 rounded-none font-bold">
                  Gated Access
                </Badge>
                <div className="text-[9px] text-zinc-500 uppercase font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  System: Online
                </div>
              </div>
              <CardTitle className="text-xl font-bold tracking-tighter mt-6 text-white uppercase italic">
                {selectedResource?.label || "Resource Access"}
              </CardTitle>
              <CardDescription className="text-zinc-500 text-[11px] uppercase tracking-wider font-medium leading-relaxed">
                Unlock exclusive technical resources. Verify your identity to decrypt the access link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pb-8">
              {/* STEP 1 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-black">
                  <span>Step 01 // Community Verification</span>
                  {step1Status === "completed" && <Check className="w-3 h-3 text-green-500" />}
                </div>
                
                <Button 
                  className={`w-full h-14 rounded-none transition-all duration-700 font-mono text-[10px] uppercase tracking-[0.2em] ${
                    step1Status === "verifying" ? "bg-zinc-900 border border-white/5 text-zinc-500" : 
                    step1Status === "completed" ? "border border-green-500/20 text-green-500 bg-green-500/5 hover:bg-green-500/10" : "bg-white text-black hover:bg-zinc-200"
                  }`}
                  disabled={step1Status === "verifying" || step1Status === "completed"}
                  onClick={handleFollowClick}
                >
                  {step1Status === "locked" && (
                    <div className="flex items-center gap-3">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Follow to Decrypt</span>
                    </div>
                  )}
                  {step1Status === "verifying" && (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying... {countdown}S</span>
                    </div>
                  )}
                  {step1Status === "completed" && (
                    <div className="flex items-center gap-3">
                      <Check className="w-3.5 h-3.5" />
                      <span>Identity Verified</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* STEP 2 */}
              <div className={`space-y-3 transition-all duration-1000 ${step1Status !== "completed" ? "opacity-20 grayscale pointer-events-none" : "opacity-100"}`}>
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-black">
                  <span>Step 02 // Resource Deployment</span>
                </div>
                
                <Button 
                  className="w-full h-14 rounded-none bg-zinc-100 text-black hover:bg-white transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.2em]"
                  disabled={step2Status === "locked"}
                  onClick={() => window.open(selectedResource?.link, "_blank")}
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Retrieve Resource</span>
                  </div>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 py-4 bg-zinc-900/20">
              <p className="text-[9px] text-zinc-600 text-center w-full uppercase tracking-[0.3em] font-mono font-bold">
                Deploy. Pipeline v1.0.4 // Build 2026.05
              </p>
            </CardFooter>
          </div>
        </Card>
      )}
    </div>
  );
}
