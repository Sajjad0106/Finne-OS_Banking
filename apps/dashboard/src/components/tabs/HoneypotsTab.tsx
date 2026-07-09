"use client";

import React from "react";
import { useSecurityStore } from "../../store/useSecurityStore";
import { FileText, Database, Key } from "lucide-react";

export default function HoneypotsTab() {
  const { honeypots } = useSecurityStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wider">Bait & Honeypot Decoy Assets</h2>
        <p className="text-xs text-mutedText">Decoy databases, files, and credentials designed to trigger containment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decoys Table */}
        <div className="lg:col-span-2 glass-panel p-5 bg-[#080808]/50">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Decoy Asset Name</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Network/Path Context</th>
                <th className="pb-3 font-semibold text-center">Telemetry Accesses</th>
                <th className="pb-3 font-semibold text-right">Integrity Posture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {honeypots.map((hp) => {
                const isTriggered = hp.status === "Triggered";
                return (
                  <tr key={hp.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pr-3 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          {hp.type === "File" ? (
                            <FileText className="h-4 w-4 text-gold-secondary" />
                          ) : hp.type === "Database" ? (
                            <Database className="h-4 w-4 text-[#5DA9FF]" />
                          ) : (
                            <Key className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        <span>{hp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-mutedText">{hp.type}</td>
                    <td className="py-4 font-mono text-white/70 text-[10.5px] max-w-[200px] truncate" title={hp.path}>
                      {hp.path}
                    </td>
                    <td className="py-4 text-center font-mono font-semibold text-white">
                      <span className={isTriggered ? "text-critical animate-pulse font-bold" : ""}>
                        {hp.accessCount}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                        isTriggered
                          ? "bg-critical/20 border border-critical/40 text-[#FF4D4D] animate-pulse shadow-[0_0_8px_#FF4D4D]"
                          : "bg-success/10 border border-success/30 text-[#00FF9D]"
                      }`}>
                        {hp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Honey pot configuration rules */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card-gold p-5 bg-[#080808]/75 relative overflow-hidden">
            <div className="scanline" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold border-b border-white/5 pb-2.5 mb-3">
              Containment Directive
            </h3>
            <p className="text-[11px] leading-relaxed text-mutedText">
              Honeypots are high-interaction canary assets. As AI agents have no legitimate business requirement to query or read these records, **any file open or metadata query** acts as a high-confidence indicator of adversarial compromise.
            </p>
            <div className="mt-4 space-y-2 text-[10px] font-mono leading-relaxed">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-mutedText">Alert Severity:</span>
                <span className="text-[#FF4D4D] font-bold">CRITICAL</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-mutedText">Agent Quarantine:</span>
                <span className="text-[#00FF9D] font-bold">IMMEDIATE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mutedText">Authentication Revoke:</span>
                <span className="text-[#00FF9D] font-bold">REVOKED (12ms)</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 bg-[#080808]/60 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 mb-3">
              Deployment Info
            </h3>
            <p className="text-[11px] text-mutedText leading-relaxed">
              Canary credentials are automatically refreshed inside Git workspaces, ERP folders, and environment caches every 24 hours to evade static analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
