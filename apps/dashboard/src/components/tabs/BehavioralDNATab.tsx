"use client";

import React, { useState } from "react";
import { useSecurityStore, Agent } from "../../store/useSecurityStore";
import AgentInvader from "../AgentInvader";

export default function BehavioralDNATab() {
  const { agents } = useSecurityStore();
  const onlineAgents = agents.filter(a => a.status !== "Offline");
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(onlineAgents[0] || null);

  React.useEffect(() => {
    if (onlineAgents.length > 0) {
      if (!selectedAgent || !onlineAgents.some(a => a.id === selectedAgent.id)) {
        setSelectedAgent(onlineAgents[0]);
      } else {
        const updated = onlineAgents.find(a => a.id === selectedAgent.id);
        if (updated && updated.status !== selectedAgent.status) {
          setSelectedAgent(updated);
        }
      }
    } else {
      setSelectedAgent(null);
    }
  }, [agents, selectedAgent]);

  // Custom SVG Radar Chart renderer for Agent DNA
  // Dimensions: 200x200
  // Variables: File Operations, API Frequency, Network requests, Privilege Levels, Execution Speed
  const renderRadarChart = (agent: Agent) => {
    const isFinanceDrift = agent.id === "agent-fin-01" && agent.status === "Isolated";
    
    // Normal profile data coordinates
    const baseStats = { files: 40, api: 60, net: 30, priv: 20, speed: 45 };
    // Drifted profile coordinate (highly elevated)
    const driftStats = isFinanceDrift 
      ? { files: 95, api: 90, net: 85, priv: 80, speed: 95 }
      : { files: 45, api: 55, net: 35, priv: 25, speed: 50 };

    const getCoord = (stat: number, angleDeg: number) => {
      const angleRad = (Math.PI / 180) * angleDeg;
      const radius = (stat / 100) * 80; // Scale to max 80 radius
      const x = 100 + radius * Math.cos(angleRad - Math.PI / 2);
      const y = 100 + radius * Math.sin(angleRad - Math.PI / 2);
      return { x, y };
    };

    // Calculate vertices for 5-axis polygon
    const p1_base = getCoord(baseStats.files, 0);
    const p2_base = getCoord(baseStats.api, 72);
    const p3_base = getCoord(baseStats.net, 144);
    const p4_base = getCoord(baseStats.priv, 216);
    const p5_base = getCoord(baseStats.speed, 288);

    const p1_drift = getCoord(driftStats.files, 0);
    const p2_drift = getCoord(driftStats.api, 72);
    const p3_drift = getCoord(driftStats.net, 144);
    const p4_drift = getCoord(driftStats.priv, 216);
    const p5_drift = getCoord(driftStats.speed, 288);

    const basePoints = `${p1_base.x},${p1_base.y} ${p2_base.x},${p2_base.y} ${p3_base.x},${p3_base.y} ${p4_base.x},${p4_base.y} ${p5_base.x},${p5_base.y}`;
    const driftPoints = `${p1_drift.x},${p1_drift.y} ${p2_drift.x},${p2_drift.y} ${p3_drift.x},${p3_drift.y} ${p4_drift.x},${p4_drift.y} ${p5_drift.x},${p5_drift.y}`;

    return (
      <svg width="220" height="220" className="overflow-visible filter drop-shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        {/* Draw Web Axises */}
        {Array.from({ length: 5 }).map((_, i) => {
          const coord = getCoord(100, i * 72);
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={coord.x}
              y2={coord.y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Outer Ring boundary */}
        <polygon
          points={`${getCoord(100, 0).x},${getCoord(100, 0).y} ${getCoord(100, 72).x},${getCoord(100, 72).y} ${getCoord(100, 144).x},${getCoord(100, 144).y} ${getCoord(100, 216).x},${getCoord(100, 216).y} ${getCoord(100, 288).x},${getCoord(100, 288).y}`}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1.5"
        />
        <polygon
          points={`${getCoord(50, 0).x},${getCoord(50, 0).y} ${getCoord(50, 72).x},${getCoord(50, 72).y} ${getCoord(50, 144).x},${getCoord(50, 144).y} ${getCoord(50, 216).x},${getCoord(50, 216).y} ${getCoord(50, 288).x},${getCoord(50, 288).y}`}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Base Standard Baseline Model (Green) */}
        <polygon
          points={basePoints}
          fill="rgba(0, 255, 157, 0.1)"
          stroke="#00FF9D"
          strokeWidth="1.5"
          className="transition-all duration-500"
        />

        {/* Runtime Actual Deviation Model (Gold / Red) */}
        <polygon
          points={driftPoints}
          fill={isFinanceDrift ? "rgba(255, 77, 77, 0.2)" : "rgba(212, 175, 55, 0.15)"}
          stroke={isFinanceDrift ? "#FF4D4D" : "#D4AF37"}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Axis Labels */}
        <text x="100" y="10" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" className="uppercase font-mono">Files</text>
        <text x="195" y="75" textAnchor="start" fill="rgba(255,255,255,0.5)" fontSize="8" className="uppercase font-mono">APIs</text>
        <text x="160" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" className="uppercase font-mono">Net</text>
        <text x="40" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" className="uppercase font-mono">Privs</text>
        <text x="5" y="75" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="8" className="uppercase font-mono">Speed</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white tracking-wider">Behavioral Fingerprint DNA</h2>
        <p className="text-xs text-mutedText">Drift detection, execution velocity, and anomaly mapping</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent Selector List */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[10px] text-mutedText uppercase tracking-widest font-mono font-bold block mb-2">Select Agent</span>
          {onlineAgents.map((ag) => (
            <button
              key={ag.id}
              onClick={() => setSelectedAgent(ag)}
              className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                selectedAgent?.id === ag.id
                  ? "bg-gold/5 border-gold/40 text-white shadow-[0_0_12px_rgba(212,175,55,0.06)]"
                  : "bg-[#080808]/40 border-white/5 text-mutedText hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#080808] border border-white/5 flex items-center justify-center">
                  <AgentInvader status={ag.status} agentId={ag.id} size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">{ag.name}</h4>
                  <span className="text-[8px] font-mono opacity-60 block">{ag.id}</span>
                </div>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${
                ag.status === "Active" ? "bg-success" : ag.status === "Warning" ? "bg-warning" : ag.status === "Isolated" ? "bg-critical" : "bg-info"
              }`} />
            </button>
          ))}
        </div>

        {/* Behavior DNA Viewer */}
        {selectedAgent ? (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Radar Chart Visual */}
            <div className="glass-panel p-6 bg-[#080808]/70 flex flex-col items-center justify-center border border-white/5 min-h-[300px]">
              <h3 className="text-[10px] text-mutedText uppercase tracking-widest font-mono font-bold block mb-6">
                Behavior DNA Vector Map
              </h3>
              {renderRadarChart(selectedAgent)}
              <div className="flex items-center gap-4 mt-6 text-[9px] text-mutedText">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#00FF9D]" />
                  <span>Base Model</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-gold" />
                  <span>Runtime Profile</span>
                </div>
              </div>
            </div>

            {/* Behavior Metric Stats */}
            <div className="glass-panel p-6 bg-[#080808]/70 flex flex-col justify-between border border-white/5">
              <div>
                <h3 className="text-[10px] text-mutedText uppercase tracking-widest font-mono font-bold block mb-4 border-b border-white/5 pb-2">
                  Anomaly Audit
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-mutedText">Trust Posture Score</span>
                      <span className={`font-mono font-bold text-sm ${selectedAgent.trustScore > 80 ? "text-[#00FF9D]" : "text-[#FF4D4D]"}`}>
                        {selectedAgent.trustScore} / 100
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${selectedAgent.trustScore > 80 ? "bg-[#00FF9D]" : "bg-[#FF4D4D]"}`} style={{ width: `${selectedAgent.trustScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-mutedText">Execution Drift Rate</span>
                      <span className="font-mono font-semibold text-white">
                        {selectedAgent.id === "agent-fin-01" && selectedAgent.status === "Isolated" ? "+720%" : "+0.0%"}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-mutedText leading-relaxed">
                      Comparison of operation latency against historical moving average window.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-mutedText">Role Bound Status</span>
                      <span className={`font-mono font-semibold ${selectedAgent.status === "Isolated" ? "text-critical" : "text-success"}`}>
                        {selectedAgent.status === "Isolated" ? "Breached" : "Secure"}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-mutedText leading-relaxed">
                      Compliance with tenant-level directory restrictions and policy access maps.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-[9.5px] text-mutedText mt-4 leading-relaxed font-mono">
                Fingerprint: <span className="text-white">{selectedAgent.dnsSignature}</span>
              </div>
            </div>

            {/* Behavior Heatmap Simulation */}
            <div className="glass-panel p-6 bg-[#080808]/70 flex flex-col justify-between border border-white/5">
              <div>
                <h3 className="text-[10px] text-mutedText uppercase tracking-widest font-mono font-bold block mb-4 border-b border-white/5 pb-2">
                  Velocity Heatmap
                </h3>
                
                <div className="grid grid-cols-6 gap-1.5 my-3">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const isHigh = selectedAgent.id === "agent-fin-01" && selectedAgent.status === "Isolated" && idx > 18;
                    const bg = isHigh 
                      ? "bg-[#FF4D4D] shadow-[0_0_8px_#FF4D4D]" 
                      : "bg-[#00FF9D]/30 border border-[#00FF9D]/20";
                    return (
                      <div
                        key={idx}
                        className={`h-6 rounded-md transition-colors duration-500 ${bg}`}
                        title={`Bucket ${idx}: ${isHigh ? "Critical Drift" : "Nominal"}`}
                      />
                    );
                  })}
                </div>
                <p className="text-[9.5px] text-mutedText leading-relaxed mt-2.5">
                  Histogram mapping operation load and network packet speed over a 24-bucket sliding timeline.
                </p>
              </div>

              <div className="text-[9px] text-mutedText border-t border-white/5 pt-3 leading-relaxed">
                * Red blocks represent structural variations exceeding a 3-standard-deviation limit (anomaly trigger).
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 glass-panel p-12 bg-[#080808]/30 flex flex-col items-center justify-center text-center min-h-[300px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">No Agents Configured</h3>
            <p className="text-[10px] text-mutedText max-w-sm mt-1">Connect system integrations in the Connectors tab to populate inspectable active agents.</p>
          </div>
        )}
      </div>
    </div>
  );
}
