"use client";

import React from "react";
import { useSecurityStore } from "../../store/useSecurityStore";
import AgentMap from "../AgentMap";
import SimulatorControl from "../SimulatorControl";

export default function OverviewTab() {
  const { agents, threats, approvals, auditLogs } = useSecurityStore();

  const activeAgentsList = agents.filter((a) => a.status !== "Offline");
  const totalAgents = activeAgentsList.length;
  const warnings = activeAgentsList.filter((a) => a.status === "Warning").length;
  const isolated = activeAgentsList.filter((a) => a.status === "Isolated").length;
  const threatCount = threats.length;
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;

  // Render a tiny SVG sparkline for visual flair
  const renderSparkline = (points: number[], stroke: string) => {
    const width = 80;
    const height = 20;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const mapped = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height + 1; // offset padding
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          points={mapped.join(" ")}
          className="drop-shadow-[0_0_3px_currentColor]"
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Bento Grid KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Agents Online */}
        <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all hover:border-success/30">
          <div className="absolute top-0 right-0 w-12 h-12 bg-success/5 rounded-bl-3xl border-l border-b border-success/10" />
          <div>
            <div className="text-[10px] text-mutedText uppercase tracking-wider font-bold">Agents Monitored</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight text-white">{totalAgents}</span>
              <span className="text-[9px] text-success font-medium flex items-center gap-1">
                ● {totalAgents - isolated - warnings} Secure
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className="text-[9px] text-mutedText">Activity</span>
            {renderSparkline([10, 15, 8, 22, 19, 25, 30], "#00FF9D")}
          </div>
        </div>

        {/* KPI 2: Isolated Sandbox */}
        <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all hover:border-critical/30">
          <div className="absolute top-0 right-0 w-12 h-12 bg-critical/5 rounded-bl-3xl border-l border-b border-critical/10" />
          <div>
            <div className="text-[10px] text-mutedText uppercase tracking-wider font-bold">Quarantined</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight text-white">{isolated}</span>
              {isolated > 0 ? (
                <span className="text-[9px] text-critical font-medium animate-pulse uppercase tracking-wider">
                  ● Sandbox Active
                </span>
              ) : (
                <span className="text-[9px] text-mutedText">None Isolated</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className="text-[9px] text-mutedText">Mitigation</span>
            {renderSparkline([20, 15, 10, 8, 5, 2, isolated], isolated > 0 ? "#FF4D4D" : "rgba(255,255,255,0.1)")}
          </div>
        </div>

        {/* KPI 3: Threat Prevention Rate */}
        <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all hover:border-gold/30">
          <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 rounded-bl-3xl border-l border-b border-gold/10" />
          <div>
            <div className="text-[10px] text-mutedText uppercase tracking-wider font-bold">Threats Logged</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight text-white">{threatCount}</span>
              <span className="text-[9px] text-gold-secondary font-medium">Auto-Mitigated</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className="text-[9px] text-mutedText">Prevention</span>
            <div className="flex items-center gap-2">
              {renderSparkline([2, 3, 1, 4, 2, 5, threatCount], "#D4AF37")}
              <span className="text-[9px] text-success font-bold">100%</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all hover:border-warning/30">
          <div className="absolute top-0 right-0 w-12 h-12 bg-warning/5 rounded-bl-3xl border-l border-b border-warning/10" />
          <div>
            <div className="text-[10px] text-mutedText uppercase tracking-wider font-bold">Pending Approvals</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight text-white">{pendingApprovals}</span>
              {pendingApprovals > 0 && (
                <span className="text-[8px] bg-warning/20 border border-warning/30 text-warning px-1.5 py-0.5 rounded uppercase font-semibold animate-pulse">
                  Action Req.
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className="text-[9px] text-mutedText">Approval SLA</span>
            <div className="flex items-center gap-2">
              {renderSparkline([5, 4, 3, 2, 1, 2, pendingApprovals], "#FFB020")}
              <span className="text-[9px] text-success font-medium">92s</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Trust index */}
        <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all hover:border-info/30">
          <div className="absolute top-0 right-0 w-12 h-12 bg-info/5 rounded-bl-3xl border-l border-b border-info/10" />
          <div>
            <div className="text-[10px] text-mutedText uppercase tracking-wider font-bold">Trust Index Score</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight text-white">
                {totalAgents > 0
                  ? Math.round(agents.reduce((sum, ag) => sum + ag.trustScore, 0) / totalAgents)
                  : 100}
              </span>
              <span className="text-[9px] text-gold font-medium">SYS_TRUST</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className="text-[9px] text-mutedText">Deviation</span>
            {renderSparkline([98, 97, 95, 96, 98, 85, 78], "#D4AF37")}
          </div>
        </div>

        {/* KPI 6: Compliance Status */}
        <div className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all hover:border-white/20">
          <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-bl-3xl border-l border-b border-white/10" />
          <div>
            <div className="text-[10px] text-mutedText uppercase tracking-wider font-bold">Compliance (SOC2)</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight text-[#00FF9D]">99.4%</span>
              <span className="text-[9px] text-mutedText">Passing</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className="text-[9px] text-mutedText">Reports Audited</span>
            <div className="flex items-center gap-2">
              {renderSparkline([95, 96, 97, 98, 99, 99.4, 99.4], "#00FF9D")}
              <span className="text-[9px] text-gold font-bold">3/3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Map & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <AgentMap />
        </div>
        <div className="flex flex-col">
          <SimulatorControl />
        </div>
      </div>

      {/* Real-time Activity Stream Panel (Datadog style scrolling feed) */}
      <div className="glass-panel p-5 bg-[#080808]/70 flex flex-col h-[280px]">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase">Real-Time Platform Event Stream</h3>
          </div>
          <span className="text-[9px] text-mutedText font-mono uppercase">Streaming telemetry via WebSocket</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2.5 font-mono text-[11px] leading-relaxed">
          {auditLogs.map((log) => {
            let typeColor = "text-[#5DA9FF]"; // info
            if (log.type === "success") typeColor = "text-[#00FF9D]";
            if (log.type === "warning") typeColor = "text-[#FFB020]";
            if (log.type === "error") typeColor = "text-[#FF4D4D]";

            return (
              <div
                key={log.id}
                className="flex items-start gap-4 border-b border-white/[0.02] pb-2 last:border-b-0 hover:bg-white/[0.01] px-2 py-1 rounded transition-colors"
              >
                <span className="text-white/30 text-[10px] whitespace-nowrap">{log.timestamp}</span>
                <span className="text-gold font-semibold whitespace-nowrap min-w-[150px]">
                  [{log.agentName}]
                </span>
                <span className="text-white/80 flex-1">{log.action}</span>
                <span className={`font-semibold uppercase text-[10px] ${typeColor} whitespace-nowrap`}>
                  {log.result}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
