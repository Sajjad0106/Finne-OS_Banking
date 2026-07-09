"use client";

import React, { useState } from "react";
import { useSecurityStore, Agent } from "../../store/useSecurityStore";
import AgentInvader from "../AgentInvader";
import { Search } from "lucide-react";

export default function RegistryTab() {
  const { agents, isolateAgent, setActiveTab } = useSecurityStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter((ag) =>
    ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#00FF9D] text-[#050505] shadow-[0_0_8px_#00FF9D]";
      case "Warning":
        return "bg-[#FFB020] text-[#050505] shadow-[0_0_8px_#FFB020]";
      case "Isolated":
        return "bg-[#FF4D4D] text-white shadow-[0_0_12px_#FF4D4D] animate-pulse";
      case "Learning":
        return "bg-[#5DA9FF] text-[#050505] shadow-[0_0_8px_#5DA9FF]";
      case "Offline":
        return "bg-white/5 border border-white/10 text-white/40 shadow-none";
    }
  };

  const getRiskColor = (risk: Agent["riskLevel"]) => {
    switch (risk) {
      case "Low":
        return "text-[#00FF9D]";
      case "Medium":
        return "text-[#FFB020]";
      case "High":
        return "text-[#FF4D4D]";
      case "Critical":
        return "text-[#FF4D4D] font-bold underline animate-pulse";
    }
  };

  const renderAgentRowCells = (ag: Agent, isChild: boolean = false, isMaster: boolean = false) => {
    return (
      <>
        <td className="py-4 pr-3">
          <div className="flex items-center gap-2">
            {isChild && (
              <span className="text-white/20 font-mono ml-2 mr-1 select-none text-xs font-bold">
                └─
              </span>
            )}
            <div className={`w-9 h-9 rounded-xl bg-[#080808] flex items-center justify-center border ${isMaster ? "border-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.05)]" : "border-white/10"}`}>
              <AgentInvader status={ag.status} agentId={ag.id} size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-xs">{ag.name}</span>
                {isMaster && (
                  <span className="bg-gold/10 border border-gold/30 text-gold text-[8px] font-bold px-1 rounded uppercase tracking-wider">
                    Master
                  </span>
                )}
                {isChild && (
                  <span className="bg-white/5 border border-white/10 text-mutedText text-[8px] font-bold px-1 rounded uppercase tracking-wider">
                    Worker
                  </span>
                )}
              </div>
              <div className="text-[9px] text-mutedText font-mono">{ag.dnsSignature}</div>
            </div>
          </div>
        </td>
        <td className="py-4">
          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest ${getStatusColor(ag.status)}`}>
            {ag.status}
          </span>
        </td>
        <td className="py-4 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className={`font-bold font-mono text-[13px] ${ag.trustScore > 80 ? "text-[#00FF9D]" : ag.trustScore > 50 ? "text-[#FFB020]" : "text-[#FF4D4D]"}`}>
              {ag.trustScore}
            </span>
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${ag.trustScore > 80 ? "bg-[#00FF9D]" : ag.trustScore > 50 ? "bg-[#FFB020]" : "bg-[#FF4D4D]"}`}
                style={{ width: `${ag.trustScore}%` }}
              />
            </div>
          </div>
        </td>
        <td className="py-4">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${getRiskColor(ag.riskLevel)}`}>
            {ag.riskLevel}
          </span>
        </td>
        <td className="py-4">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {ag.connectedTools.slice(0, 2).map((t) => (
              <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-mutedText">
                {t}
              </span>
            ))}
            {ag.connectedTools.length > 2 && (
              <span className="px-1.5 py-0.5 rounded bg-gold/10 border border-gold/20 text-[9px] text-gold-secondary">
                +{ag.connectedTools.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => isolateAgent(ag.id)}
              disabled={ag.status === "Isolated" || ag.isMaster}
              className={`px-2 py-1 rounded text-[9px] uppercase tracking-wider font-bold transition-all ${
                ag.status === "Isolated" || ag.isMaster
                  ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                  : "bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white"
              }`}
            >
              Isolate
            </button>
          </div>
        </td>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wider">Enterprise Agent Registry</h2>
          <p className="text-xs text-mutedText">Inventory and posture monitoring of active AI entities</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search agents by name or profile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-gold/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table Inventory */}
        <div className="xl:col-span-2 glass-panel p-5 bg-[#080808]/50 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Agent Name</th>
                <th className="pb-3 font-semibold">Security Status</th>
                <th className="pb-3 font-semibold text-center">Trust Score</th>
                <th className="pb-3 font-semibold">Risk Level</th>
                <th className="pb-3 font-semibold">Connected Services</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {searchTerm !== "" ? (
                // Flat layout for active search results
                filteredAgents.map((ag) => (
                  <tr
                    key={ag.id}
                    onClick={() => setSelectedAgent(ag)}
                    className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                      selectedAgent?.id === ag.id ? "bg-white/[0.03] border-l-2 border-gold" : ""
                    }`}
                  >
                    {renderAgentRowCells(ag, !!ag.parentId, !!ag.isMaster)}
                  </tr>
                ))
              ) : (
                // Hierarchical layout matching Master-Slave trees
                agents.filter((a) => a.isMaster).map((master) => {
                  const children = agents.filter((a) => a.parentId === master.id);
                  return (
                    <React.Fragment key={master.id}>
                      {/* Master Daemon Row */}
                      <tr
                        onClick={() => setSelectedAgent(master)}
                        className={`hover:bg-white/[0.02] cursor-pointer transition-colors bg-gold/[0.01] border-l-2 border-gold/40 ${
                          selectedAgent?.id === master.id ? "bg-gold/5 border-l-2 border-gold" : ""
                        }`}
                      >
                        {renderAgentRowCells(master, false, true)}
                      </tr>
                      {/* Nested Worker Slave Rows */}
                      {children.map((child) => (
                        <tr
                          key={child.id}
                          onClick={() => setSelectedAgent(child)}
                          className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                            selectedAgent?.id === child.id ? "bg-white/[0.03] border-l-2 border-gold" : ""
                          }`}
                        >
                          {renderAgentRowCells(child, true, false)}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed DNA Inspector Card */}
        <div className="xl:col-span-1">
          {selectedAgent ? (
            <div className="glass-panel p-5 bg-[#080808]/70 flex flex-col justify-between h-full border border-gold/10">
              <div>
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#080808] flex items-center justify-center border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                    <AgentInvader status={selectedAgent.status} agentId={selectedAgent.id} size={42} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{selectedAgent.name}</h3>
                    <p className="text-[10px] text-gold uppercase tracking-wider font-mono">{selectedAgent.type}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[10px] text-mutedText uppercase tracking-wider block mb-1">Behavior DNA Signature</span>
                    <span className="font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/10 block break-all text-center">
                      {selectedAgent.dnsSignature}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-mutedText uppercase tracking-wider block">Execution Baseline</span>
                      <span className="font-semibold text-white font-mono text-sm">{selectedAgent.speedBaseline} ms/op</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-mutedText uppercase tracking-wider block">API Topologies</span>
                      <span className="font-semibold text-white text-sm">{selectedAgent.apiPatterns.length} Handlers</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-mutedText uppercase tracking-wider block mb-1.5">Connected Interfaces</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.connectedTools.map((t) => (
                        <span key={t} className="px-2 py-1 rounded bg-[#0A0A0A] border border-white/10 text-[9px] text-white">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-mutedText uppercase tracking-wider block mb-1">Last Captured Operation</span>
                    <p className="text-white/80 italic bg-white/[0.02] border border-white/5 p-2 rounded-lg leading-relaxed">
                      "{selectedAgent.lastAction}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab("behavioral-dna");
                  }}
                  className="flex-1 py-2 rounded-xl bg-gold text-[#050505] text-[10px] uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all text-center"
                >
                  Inspect DNA fingerprint
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 bg-[#080808]/30 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Search className="h-8 w-8 text-gold/35 mb-3" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Postures Detail</h3>
              <p className="text-[10px] text-mutedText max-w-[200px] mt-1">Select an agent record from the list to view its behavior signature and parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
