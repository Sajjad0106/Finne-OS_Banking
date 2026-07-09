"use client";

import React, { useState } from "react";
import { useSecurityStore, PolicyRule } from "../../store/useSecurityStore";
import { ShieldAlert } from "lucide-react";

export default function PolicyEngineTab() {
  const { policies, togglePolicy } = useSecurityStore();
  const [activeRule, setActiveRule] = useState<PolicyRule | null>(policies[0] || null);

  const getActionColor = (action: PolicyRule["action"]) => {
    switch (action) {
      case "Allow":
        return "text-[#00FF9D] bg-[#00FF9D]/10 border-[#00FF9D]/30";
      case "Block":
        return "text-[#FF4D4D] bg-[#FF4D4D]/10 border-[#FF4D4D]/30";
      case "Isolate":
        return "text-[#FF4D4D] bg-[#FF4D4D]/20 border-[#FF4D4D]/50 font-bold";
      case "Require Approval":
        return "text-[#FFB020] bg-[#FFB020]/10 border-[#FFB020]/30";
      default:
        return "text-white bg-white/5 border-white/10";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wider">Policy Enforcement Engine</h2>
        <p className="text-xs text-mutedText">Rule boundaries, guardrails, and runtime mitigation triggers for autonomous swarms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-3">
          {policies.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveRule(p)}
              className={`glass-panel p-4 bg-[#080808]/50 flex items-center justify-between gap-4 cursor-pointer hover:border-gold/30 border transition-all ${
                activeRule?.id === p.id ? "border-gold/60 shadow-[0_0_15px_rgba(212,175,55,0.08)] bg-white/[0.01]" : "border-white/5"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-gold/80">{p.id}</span>
                  <h3 className="text-sm font-semibold text-white tracking-wide">{p.name}</h3>
                </div>
                <p className="text-[11px] text-mutedText leading-relaxed max-w-xl">
                  {p.description}
                </p>
              </div>

              <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <span className={`px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider font-bold ${getActionColor(p.action)}`}>
                  {p.action}
                </span>

                {/* iOS Style Toggle Switch */}
                <button
                  onClick={() => togglePolicy(p.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${
                    p.status ? "bg-gold" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 ${
                      p.status ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rule Details Inspector */}
        <div className="lg:col-span-1">
          {activeRule ? (
            <div className="glass-card-gold p-5 bg-[#080808]/70 flex flex-col justify-between h-full border border-gold/10">
              <div className="scanline" />
              <div>
                <div className="border-b border-white/5 pb-3.5 mb-4">
                  <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block mb-1">
                    Enforcement Policy Schema
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">{activeRule.name}</h3>
                </div>

                <div className="space-y-4 text-xs leading-relaxed">
                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Rule Description</span>
                    <p className="text-white/90">{activeRule.description}</p>
                  </div>

                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Target Boundary Vector</span>
                    <span className="font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-white block">
                      {activeRule.target}
                    </span>
                  </div>

                  <div>
                    <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-1">Active Action Directive</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded border text-[9px] uppercase tracking-wider font-bold ${getActionColor(activeRule.action)}`}>
                        {activeRule.action}
                      </span>
                      <p className="text-[10px] text-mutedText">
                        {activeRule.action === "Block" && "Rejects operations and returns safety exceptions."}
                        {activeRule.action === "Isolate" && "Locks down all environment credentials and networks."}
                        {activeRule.action === "Require Approval" && "Halts execution and pushes to Admin Approval Center."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[9px] text-mutedText text-center leading-relaxed">
                Rules are evaluated locally at runtime inside agent hooks, compiling telemetry telemetry directly via SDK connectors.
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 bg-[#080808]/30 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
              <ShieldAlert className="h-8 w-8 text-gold/35 mb-3" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Rules Schema</h3>
              <p className="text-[10px] text-mutedText max-w-[200px] mt-1">Select a rule schema on the left to view enforcement details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
