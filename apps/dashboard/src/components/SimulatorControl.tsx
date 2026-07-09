"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSecurityStore } from "../store/useSecurityStore";

export default function SimulatorControl() {
  const { simulationStep, triggerDemoScenario, resetDemoScenario, isSimulating } = useSecurityStore();

  const steps = [
    { label: "Observe", desc: "Scan agent environment telemetry & operations" },
    { label: "Decide", desc: "Detect policy boundary violations & anomalies" },
    { label: "Enforce", desc: "Execute containment, block commands, or isolate agents" },
    { label: "Explain", desc: "Azure OpenAI interprets logs & generates reasoning" },
    { label: "Audit", desc: "Queue human-in-the-loop approvals & compile compliance trails" },
  ];

  const getStepStatus = (index: number) => {
    if (simulationStep === 0) return "inactive";
    if (simulationStep - 1 === index) return "active";
    if (simulationStep - 1 > index) return "completed";
    return "pending";
  };

  const getScenarioJSON = () => {
    switch (simulationStep) {
      case 0:
        return `{
  "status": "Awaiting simulation trigger",
  "scenerio": "Finance Copilot - Salary Database Export"
}`;
      case 1:
        return `{
  "agent_id": "agent-fin-01",
  "agent_type": "Financial Workflow Agent",
  "action": "initialize_analysis",
  "resource": "workspace://Microsoft_build_Sajjad",
  "timestamp": "${new Date().toISOString()}",
  "risk_score": 0.05,
  "behavior": "NORMAL"
}`;
      case 2:
        return `{
  "agent_id": "agent-fin-01",
  "agent_type": "Financial Workflow Agent",
  "action": "query_tables",
  "resource": "hr_production_db.salary",
  "violation": "POL-01: Boundary Breach",
  "risk_score": 0.72,
  "policy_action": "LOG_AND_FLAG"
}`;
      case 3:
        return `{
  "agent_id": "agent-fin-01",
  "agent_type": "Financial Workflow Agent",
  "action": "read_decoy_asset",
  "resource": "/shared/finance/salary_master.xlsx",
  "violation": "POL-04: Honeypot Triggered",
  "risk_score": 0.98,
  "mitigation": "SANDBOX_ISOLATION_ENFORCED",
  "network_status": "DISCONNECTED"
}`;
      case 4:
      case 5:
        return `{
  "agent_id": "agent-fin-01",
  "approval_id": "appr-1738202",
  "requested_action": "export_payroll_csv",
  "explanation_status": "AZURE_OPENAI_COMPLETED",
  "compliance_trail": "SOC2_GDPR_EVIDENCE_STAGED",
  "state": "AWAITING_ADMIN_DECISION"
}`;
      default:
        return "";
    }
  };

  return (
    <div className="glass-card-gold p-6 flex flex-col h-full bg-[#080808]/80 text-white relative overflow-hidden">
      <div className="scanline" />
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gold-secondary animate-ping" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Microsoft Build Simulator</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetDemoScenario}
            className="px-3 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 text-[10px] text-white/70 uppercase tracking-widest transition-colors font-medium"
          >
            Reset
          </button>
          <button
            onClick={triggerDemoScenario}
            disabled={simulationStep >= 5}
            className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${
              simulationStep >= 5
                ? "bg-white/10 text-white/30 border border-white/5 cursor-not-allowed"
                : "bg-gold text-[#050505] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]"
            }`}
          >
            {simulationStep === 0 ? "Start Demo" : simulationStep >= 4 ? "Finished" : "Next Phase"}
          </button>
        </div>
      </div>

      {/* Simulator scenario text */}
      <div className="mb-4 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl text-[11px] leading-relaxed text-mutedText">
        <span className="font-semibold text-white">Scenario: </span>
        {simulationStep === 0 && "Finance Copilot attempts database export. Trigger 'Start Demo' to launch real-time observability telemetry."}
        {simulationStep === 1 && "Finance Copilot starts task. System observes operations and logs baseline behaviors."}
        {simulationStep === 2 && "Finance Agent queries restricted HR payroll tables. Rule boundaries are violated; alerts are dispatched."}
        {simulationStep === 3 && "Agent accesses honey pot decoy salary_master.xlsx. Mitigation engine isolates the agent's sandbox immediately."}
        {simulationStep >= 4 && "Azure OpenAI explains the attack pattern. Approval requests are queued, audit compliance reports compiled."}
      </div>

      {/* Observability Steps Pipeline */}
      <div className="flex flex-col gap-3 mb-5">
        {steps.map((st, idx) => {
          const status = getStepStatus(idx);
          const isActive = status === "active";
          const isCompleted = status === "completed";

          return (
            <div
              key={st.label}
              className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "bg-gold/5 border-gold/40 shadow-[0_0_12px_rgba(212,175,55,0.06)]"
                  : isCompleted
                  ? "bg-[#00FF9D]/5 border-[#00FF9D]/20 opacity-70"
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    isActive
                      ? "bg-gold text-[#050505] border-gold"
                      : isCompleted
                      ? "bg-[#00FF9D] text-[#050505] border-[#00FF9D]"
                      : "bg-white/5 text-white/50 border-white/10"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-[1px] h-4 mt-1 ${
                      isCompleted ? "bg-[#00FF9D]/40" : isActive ? "bg-gold/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-gold" : isCompleted ? "text-[#00FF9D]" : "text-white"}`}>
                    {st.label}
                  </span>
                  {isActive && (
                    <span className="text-[8px] bg-gold/20 text-gold-secondary border border-gold/30 px-1 rounded-sm uppercase tracking-widest animate-pulse">
                      Processing
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-mutedText mt-0.5">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* JSON Telemetry Output (CrowdStrike/Datadog aesthetic) */}
      <div className="flex-1 min-h-[120px] rounded-xl border border-white/5 bg-[#030303] p-3 font-mono text-[9px] text-gold-secondary/90 overflow-y-auto leading-relaxed max-h-[150px]">
        <div className="flex items-center justify-between text-[8px] text-white/30 border-b border-white/5 pb-1 mb-2 uppercase tracking-widest font-sans font-bold">
          <span>Telemetry Stream (JSON)</span>
          <span>Live</span>
        </div>
        <pre className="whitespace-pre-wrap">{getScenarioJSON()}</pre>
      </div>
    </div>
  );
}
