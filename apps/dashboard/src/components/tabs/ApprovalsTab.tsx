"use client";

import React from "react";
import { useSecurityStore } from "../../store/useSecurityStore";
import { Inbox } from "lucide-react";
import AgentInvader from "../AgentInvader";

export default function ApprovalsTab() {
  const { approvals, approveRequest, denyRequest } = useSecurityStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wider">Approval Operations Center</h2>
        <p className="text-xs text-mutedText">Human-in-the-loop validation checkpoints for elevated agent actions</p>
      </div>

      {approvals.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center bg-[#080808]/20 min-h-[350px]">
          <Inbox className="h-10 w-10 text-gold/30 mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">No Action Items</h3>
          <p className="text-xs text-mutedText max-w-sm mt-1">
            No agent actions are awaiting manual authorization. Trigger the simulation scenario to test approval queues.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvals.map((appr) => {
            const isPending = appr.status === "Pending";
            const isApproved = appr.status === "Approved";
            const isDenied = appr.status === "Denied";

            return (
              <div
                key={appr.id}
                className={`glass-panel p-6 bg-[#080808]/65 flex flex-col justify-between relative overflow-hidden border ${
                  isPending
                    ? "border-warning/35 shadow-[0_0_15px_rgba(255,176,32,0.05)]"
                    : isApproved
                    ? "border-success/20 opacity-70"
                    : "border-critical/20 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#080808] border border-white/10 flex items-center justify-center">
                        <AgentInvader status="Warning" agentId={appr.agentId} size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{appr.agentName}</h4>
                        <span className="text-[8px] text-mutedText font-mono">{appr.timestamp}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${
                      isPending
                        ? "bg-warning/10 border border-warning/20 text-warning animate-pulse"
                        : isApproved
                        ? "bg-success/10 border border-success/20 text-[#00FF9D]"
                        : "bg-critical/10 border border-critical/20 text-[#FF4D4D]"
                    }`}>
                      {appr.status}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs leading-relaxed mb-6">
                    <div>
                      <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-0.5">Proposed Operation</span>
                      <span className="font-semibold text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10 block text-center">
                        {appr.action}
                      </span>
                    </div>

                    <div>
                      <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-0.5">Target Resource</span>
                      <span className="font-semibold text-white/90 font-mono break-all bg-[#0A0A0A] p-2 rounded-lg border border-white/5 block">
                        {appr.resource}
                      </span>
                    </div>

                    <div>
                      <span className="text-mutedText uppercase text-[9px] tracking-wider block mb-0.5">Agent Rationale (Prompt Input)</span>
                      <p className="text-white/80 bg-white/[0.01] border border-white/5 p-2.5 rounded-xl italic">
                        "{appr.reason}"
                      </p>
                    </div>
                  </div>
                </div>

                {isPending && (
                  <div className="flex gap-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => denyRequest(appr.id)}
                      className="flex-1 py-2 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/35 hover:bg-[#FF4D4D] hover:text-white text-[10px] uppercase font-bold tracking-wider transition-all text-center"
                    >
                      Deny Request
                    </button>
                    <button
                      onClick={() => approveRequest(appr.id)}
                      className="flex-1 py-2 rounded-xl bg-[#00FF9D]/15 border border-[#00FF9D]/35 hover:bg-[#00FF9D] hover:text-[#050505] text-[10px] uppercase font-bold tracking-wider transition-all text-center"
                    >
                      Approve Action
                    </button>
                  </div>
                )}

                {!isPending && (
                  <div className="text-[10px] font-bold text-center py-2.5 bg-white/5 border border-white/5 rounded-xl text-mutedText uppercase tracking-wider">
                    Closed by Admin ({appr.status})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
