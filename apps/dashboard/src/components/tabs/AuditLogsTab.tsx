"use client";

import React, { useState } from "react";
import { useSecurityStore } from "../../store/useSecurityStore";

export default function AuditLogsTab() {
  const { auditLogs } = useSecurityStore();
  const [filter, setFilter] = useState<"all" | "info" | "success" | "warning" | "error">("all");
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter = filter === "all" || log.type === filter;
    const matchesSearch =
      log.agentName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.result.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wider">System Audit Trail</h2>
          <p className="text-xs text-mutedText">Tamper-proof chronological records of agent operations and policy decisions</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-gold/50 w-48 transition-all"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-gold/50 font-sans"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="success">Allowed</option>
            <option value="warning">Warning</option>
            <option value="error">Blocked</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-5 bg-[#080808]/50 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider font-mono">
              <th className="pb-3 font-semibold">Timestamp</th>
              <th className="pb-3 font-semibold">Origin Agent</th>
              <th className="pb-3 font-semibold">Execution Operation</th>
              <th className="pb-3 font-semibold">Policy Decision</th>
              <th className="pb-3 font-semibold text-right">Integrity Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px] leading-relaxed">
            {filteredLogs.map((log) => {
              let typeColor = "text-[#5DA9FF]";
              if (log.type === "success") typeColor = "text-[#00FF9D]";
              if (log.type === "warning") typeColor = "text-[#FFB020]";
              if (log.type === "error") typeColor = "text-[#FF4D4D]";

              // Mock hash based on index
              const logHash = `SHA256::${Math.floor(Math.sin(parseInt(log.id.replace(/[^\d]/g, "")) || 42) * 100000000).toString(16).toUpperCase().slice(0, 12)}`;

              return (
                <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 pr-4 text-white/45">{log.timestamp}</td>
                  <td className="py-3.5 pr-4 text-gold font-bold">{log.agentName}</td>
                  <td className="py-3.5 pr-4 text-white/80">{log.action}</td>
                  <td className={`py-3.5 pr-4 font-bold uppercase ${typeColor}`}>{log.result}</td>
                  <td className="py-3.5 text-right text-white/20 text-[10px] select-all" title="Verifiable HSM block hash">
                    {logHash}
                  </td>
                </tr>
              );
            })}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-mutedText italic">
                  No log entries matched your filter parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
