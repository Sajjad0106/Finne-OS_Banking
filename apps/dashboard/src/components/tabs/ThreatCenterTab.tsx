"use client";

import React from "react";
import { useSecurityStore, Threat } from "../../store/useSecurityStore";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function ThreatCenterTab() {
  const { threats, isolateAgent } = useSecurityStore();

  const getSeverityBadge = (severity: Threat["severity"]) => {
    switch (severity) {
      case "Low":
        return "bg-info/10 border-info/30 text-info";
      case "Medium":
        return "bg-warning/10 border-warning/30 text-warning";
      case "High":
        return "bg-critical/10 border-critical/30 text-critical";
      case "Critical":
        return "bg-critical/20 border-critical/50 text-critical font-bold animate-pulse shadow-[0_0_10px_rgba(255,77,77,0.2)]";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wider">Threat Intelligence Center</h2>
        <p className="text-xs text-mutedText">Mitigation log and Azure OpenAI threat explainability engine</p>
      </div>

      {threats.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center bg-[#080808]/20 min-h-[400px]">
          <div className="w-16 h-16 rounded-full border border-success/30 bg-success/5 flex items-center justify-center mb-4 text-[#00FF9D] shadow-[0_0_20px_rgba(0,255,157,0.1)]">
            <ShieldCheck className="h-7 w-7 text-[#00FF9D]" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Posture Fully Compliant</h3>
          <p className="text-xs text-mutedText max-w-sm mt-1">
            No threat detections or anomalous behavioral deviations recorded. Trigger the simulator on the Overview page to generate logs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Detections */}
          <div className="lg:col-span-2 space-y-4">
            {threats.map((thr) => (
              <div
                key={thr.id}
                className="glass-card-gold p-6 bg-[#080808]/75 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="scanline" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`px-2 py-0.5 border rounded text-[8px] uppercase tracking-widest font-bold ${getSeverityBadge(thr.severity)}`}>
                        {thr.severity} Severity
                      </span>
                      <span className="text-[10px] text-mutedText font-mono">{thr.timestamp}</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-wide">{thr.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-mutedText font-mono">
                    ID: {thr.id.slice(0, 11)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-white/5 text-[11px] leading-tight">
                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Target Entity</span>
                    <span className="font-semibold text-white">{thr.agentName}</span>
                  </div>
                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Mitigation Applied</span>
                    <span className="font-semibold text-[#00FF9D]">{thr.mitigation}</span>
                  </div>
                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Detection Layer</span>
                    <span className="font-semibold text-gold-secondary">{thr.detectedBy}</span>
                  </div>
                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Status</span>
                    <span className="font-semibold text-white/90">{thr.status}</span>
                  </div>
                </div>

                {/* Explainability Section */}
                <div className="bg-black/50 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    <span>Explainability Diagnosis (Azure OpenAI)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/80 whitespace-pre-line font-sans">
                    {thr.explanation}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => isolateAgent(thr.agentId)}
                    className="px-3 py-1.5 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 hover:bg-[#FF4D4D] hover:text-white transition-all text-[10px] uppercase font-bold tracking-wider"
                  >
                    Force Sandbox Isolation
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Security Metrics Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-5 bg-[#080808]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 mb-3">
                Security Event Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-mutedText">Critical Alerts</span>
                  <span className="font-bold text-[#FF4D4D] font-mono">
                    {threats.filter((t) => t.severity === "Critical").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-mutedText">High Alerts</span>
                  <span className="font-bold text-[#FF4D4D] font-mono">
                    {threats.filter((t) => t.severity === "High").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-mutedText">Medium Alerts</span>
                  <span className="font-bold text-[#FFB020] font-mono">
                    {threats.filter((t) => t.severity === "Medium").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-mutedText">Auto-Contained Events</span>
                  <span className="font-bold text-[#00FF9D] font-mono">
                    {threats.filter((t) => t.status === "Contained").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 bg-[#080808]/60 border border-success/10 shadow-[0_0_15px_rgba(0,255,157,0.02)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#00FF9D] border-b border-[#00FF9D]/10 pb-2.5 mb-3">
                Containment Status
              </h3>
              <p className="text-[11px] leading-relaxed text-mutedText">
                Mitigation engine operates in **Auto-Enforcement mode**. All critical severity alerts trigger immediate process sandbox isolation within **12ms** of threat signature confirmation.
              </p>
              <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-2.5 text-[10px] text-center font-mono">
                Mitigation Latency: <span className="text-[#00FF9D] font-bold">12 ms</span> (Avg)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
