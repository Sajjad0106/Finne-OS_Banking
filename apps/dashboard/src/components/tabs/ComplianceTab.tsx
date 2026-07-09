"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

interface EvidenceItem {
  id: string;
  name: string;
  category: "Access Control" | "Audit Trails" | "Incident Response";
  timestamp: string;
  status: "Compliant" | "Flagged";
}

export default function ComplianceTab() {
  const [activeReport, setActiveReport] = useState<"soc2" | "gdpr" | "iso27001">("soc2");

  const evidenceList: EvidenceItem[] = [
    { id: "EVD-01", name: "Decoy Canary Honeypot access isolation triggered", category: "Incident Response", timestamp: "12:12:30", status: "Compliant" },
    { id: "EVD-02", name: "Finance Agent database bounds policy enforced", category: "Access Control", timestamp: "12:12:20", status: "Compliant" },
    { id: "EVD-03", name: "VS Code extension blocked secret push commit", category: "Access Control", timestamp: "12:05:12", status: "Compliant" },
    { id: "EVD-04", name: "Cryptographic logging of all agent shell operations", category: "Audit Trails", timestamp: "Ongoing", status: "Compliant" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wider">Compliance Registry</h2>
          <p className="text-xs text-mutedText">Automatic mapping of AI agent behaviors to industry compliance standards</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 rounded-xl bg-gold text-[#050505] text-[10px] uppercase font-bold tracking-widest hover:bg-gold-secondary transition-all">
            Export JSON Evidence
          </button>
          <button className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-gold/50 text-[10px] uppercase font-bold tracking-widest text-white/95 transition-all">
            Download PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Selector */}
        <div className="lg:col-span-1 space-y-2.5">
          <span className="text-[10px] text-mutedText uppercase tracking-widest font-mono font-bold block mb-1">Select Standards</span>
          {[
            { id: "soc2", name: "SOC 2 Type II", desc: "Trust Services Criteria for security, integrity, and privacy" },
            { id: "gdpr", name: "GDPR Section V", desc: "Data transfer security and automated decisions accountability" },
            { id: "iso27001", name: "ISO/IEC 27001:2022", desc: "Information security management systems control mappings" },
          ].map((rep) => (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id as any)}
              className={`w-full text-left p-4 rounded-xl border flex flex-col gap-1.5 transition-all ${
                activeReport === rep.id
                  ? "bg-gold/5 border-gold/40 text-white shadow-[0_0_12px_rgba(212,175,55,0.06)]"
                  : "bg-[#080808]/40 border-white/5 text-mutedText hover:text-white"
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider">{rep.name}</h4>
              <p className="text-[9.5px] leading-relaxed opacity-70">{rep.desc}</p>
            </button>
          ))}
        </div>

        {/* Compliance details + Evidence Previewer */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audit Checklist & Policy Preview */}
          <div className="glass-panel p-6 bg-[#080808]/70 flex flex-col justify-between border border-white/5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 mb-4">
                Audit Checklist Indicators
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Agent Activity Log Integrity</span>
                    <p className="text-[9.5px] text-mutedText leading-relaxed">Cryptographic hash chains on all workspace operations.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Privileged Command Gatekeeping</span>
                    <p className="text-[9.5px] text-mutedText leading-relaxed">Enforcement of manual approvals on bulk data changes.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Autonomous Sandbox Failsafes</span>
                    <p className="text-[9.5px] text-mutedText leading-relaxed">Automated socket severance on honeypot decoy trigger.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-3 text-[10px] text-center font-mono mt-6">
              Evaluation Code: <span className="text-[#00FF9D] font-bold">PASSING (100.0%)</span>
            </div>
          </div>

          {/* Compliance Evidence Timeline (Audit trail logs) */}
          <div className="glass-panel p-6 bg-[#080808]/70 flex flex-col justify-between border border-white/5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 mb-3">
                Evidence Collection Vault
              </h3>
              <div className="space-y-3">
                {evidenceList.map((ev) => (
                  <div key={ev.id} className="flex justify-between items-start gap-2 border-b border-white/5 pb-2 last:border-b-0">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[8px] font-mono text-gold-secondary font-bold">{ev.id}</span>
                        <span className="text-[8.5px] text-mutedText uppercase tracking-wider">{ev.category}</span>
                      </div>
                      <p className="text-[10px] text-white/90 leading-tight">{ev.name}</p>
                    </div>
                    <span className="text-[9px] text-success font-semibold whitespace-nowrap">{ev.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[9px] text-mutedText leading-relaxed mt-4">
              * Evidence is signed automatically via hardware-locked HSM key modules to guarantee legal validity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
