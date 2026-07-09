"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useSecurityStore } from "../store/useSecurityStore";
import { Database, Server, Cloud, User, Lock, HelpCircle } from "lucide-react";
import AgentInvader from "./AgentInvader";

interface Node {
  id: string;
  label: string;
  type: "Agent" | "Server" | "Database" | "API" | "Human" | "Honeypot";
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  status: "healthy" | "warning" | "blocked" | "inactive";
}

export default function AgentMap() {
  const { agents, simulationStep } = useSecurityStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Nodes list in layout coordinates
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime((t) => t + 0.015);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const getDynamicNodes = (): Node[] => {
    const predefinedIds = [
      "agent-sec-master", "agent-work-master", "agent-fin-01", "agent-browser-02",
      "agent-mcp-03", "agent-ide-04", "agent-api-05", "agent-sentinel-06",
      "agent-db-backup-08", "agent-git-guard", "agent-secrets-scan", "agent-sandbox-jail",
      "agent-slack-bot", "agent-con-jira", "agent-mail-filter", "agent-k8s-pod"
    ];

    const baseNodes: Node[] = [
      {
        id: "agent-sec-master",
        label: "Security Swarm Orchestrator",
        type: "Agent",
        x: 240 + Math.sin(time * 0.5) * 4,
        y: 220 + Math.cos(time * 0.5) * 4,
      },
      {
        id: "agent-work-master",
        label: "Workspace Copilot Coordinator",
        type: "Agent",
        x: 520 + Math.sin(time * 0.5) * 4,
        y: 280 + Math.cos(time * 0.5) * 4,
      },
      {
        id: "agent-fin-01",
        label: "Finance Copilot",
        type: "Agent",
        x: simulationStep >= 3 
          ? 760 + Math.sin(time * 30) * 1.2 // Isolated: locked/shaking in sandbox box
          : simulationStep === 1
          ? 520 + (750 - 520) * (0.5 + 0.5 * Math.sin(time * 0.8)) // Telemetry traveling from Workspace Master to HR DB
          : simulationStep === 2
          ? 520 + (750 - 520) * 0.7 + Math.sin(time * 40) * 1.5 // Alert Jitter
          : 640 + Math.sin(time) * 15, // Idle patrol
        y: simulationStep >= 3
          ? 440 + Math.cos(time * 30) * 1.2
          : simulationStep === 1
          ? 280 + (120 - 280) * (0.5 + 0.5 * Math.sin(time * 0.8))
          : simulationStep === 2
          ? 280 + (120 - 280) * 0.7 + Math.cos(time * 40) * 1.5
          : 180 + Math.cos(time * 0.8) * 12,
      },
      {
        id: "agent-browser-02",
        label: "Web Research Agent",
        type: "Agent",
        x: 620 + Math.sin(time * 0.7) * 18,
        y: 380 + Math.cos(time * 0.6) * 15,
      },
      {
        id: "agent-mcp-03",
        label: "Terminal MCP Server",
        type: "Agent",
        x: 140 + Math.sin(time * 0.8) * 10,
        y: 320 + Math.cos(time * 0.7) * 8,
      },
      {
        id: "agent-ide-04",
        label: "Dev Copilot",
        type: "Agent",
        x: 660 + Math.sin(time * 0.8) * 10,
        y: 280 + Math.cos(time * 0.9) * 12,
      },
      {
        id: "agent-api-05",
        label: "Cloud Deployment Agent",
        type: "Agent",
        x: 160 + Math.cos(time * 0.9) * 8,
        y: 120 + Math.sin(time * 0.8) * 10,
      },
      {
        id: "agent-sentinel-06",
        label: "Sentinel Canary Monitor",
        type: "Agent",
        x: 260 + Math.sin(time * 0.6) * 12,
        y: 350 + Math.cos(time * 0.6) * 10,
      },
      {
        id: "agent-db-backup-08",
        label: "Database Backup Daemon",
        type: "Agent",
        x: 480 + Math.sin(time * 0.5) * 12,
        y: 140 + Math.cos(time * 0.6) * 10,
      },
      {
        id: "agent-git-guard",
        label: "Git Guard Daemon",
        type: "Agent",
        x: 640 + Math.sin(time * 0.6) * 10,
        y: 200 + Math.cos(time * 0.7) * 8,
      },
      {
        id: "agent-secrets-scan",
        label: "Entropy Secrets Scanner",
        type: "Agent",
        x: 320 + Math.sin(time * 0.5) * 12,
        y: 120 + Math.cos(time * 0.6) * 10,
      },
      {
        id: "agent-sandbox-jail",
        label: "Container Jail Enforcer",
        type: "Agent",
        x: 120 + Math.sin(time * 0.4) * 8,
        y: 220 + Math.cos(time * 0.5) * 10,
      },
      {
        id: "agent-slack-bot",
        label: "Slack Portal Auditor",
        type: "Agent",
        x: 420 + Math.sin(time * 0.7) * 14,
        y: 360 + Math.cos(time * 0.6) * 12,
      },
      {
        id: "agent-con-jira",
        label: "Jira Integrity Monitor",
        type: "Agent",
        x: 580 + Math.sin(time * 0.8) * 10,
        y: 440 + Math.cos(time * 0.7) * 10,
      },
      {
        id: "agent-mail-filter",
        label: "Inbound Email Filter",
        type: "Agent",
        x: 460 + Math.sin(time * 0.5) * 12,
        y: 420 + Math.cos(time * 0.6) * 14,
      },
      {
        id: "agent-k8s-pod",
        label: "Kubernetes Pod Monitor",
        type: "Agent",
        x: 280 + Math.sin(time * 0.6) * 10,
        y: 80 + Math.cos(time * 0.7) * 8,
      },
      {
        id: "db-finance",
        label: "HR Payroll DB",
        type: "Database",
        x: 750 + Math.sin(time * 0.4) * 2,
        y: 120 + Math.cos(time * 0.4) * 2,
      },
      {
        id: "decoy-salary",
        label: "salary_master.xlsx",
        type: "Honeypot",
        x: 760 + Math.sin(time * 0.3) * 1,
        y: 260 + Math.cos(time * 0.3) * 1,
      },
      {
        id: "api-gateway",
        label: "Cloud API Gateway",
        type: "API",
        x: 380 + Math.sin(time * 0.5) * 2,
        y: 440 + Math.cos(time * 0.5) * 2,
      },
      {
        id: "human-ciso",
        label: "Security Analyst",
        type: "Human",
        x: 380 + Math.sin(time * 0.6) * 3,
        y: 180 + Math.cos(time * 0.7) * 3,
      },
    ];

    // Compute dynamic coordinates for manual custom agents orbiting their parent master node
    const customAgents = agents.filter((a) => !predefinedIds.includes(a.id));
    customAgents.forEach((ag, idx) => {
      const parentNode = baseNodes.find((n) => n.id === ag.parentId) || baseNodes.find((n) => n.id === "agent-work-master");
      const parentX = parentNode ? parentNode.x : 520;
      const parentY = parentNode ? parentNode.y : 280;
      
      const angle = (idx * (2 * Math.PI)) / (customAgents.length || 1) + time * 0.4;
      const radius = 95;

      baseNodes.push({
        id: ag.id,
        label: ag.name,
        type: "Agent",
        x: parentX + Math.sin(angle) * radius,
        y: parentY + Math.cos(angle) * radius,
      });
    });

    return baseNodes;
  };

  const dynamicNodes = getDynamicNodes();

  // Dynamic edges depending on simulator step and custom manual integrations
  const getEdges = (): Edge[] => {
    const predefinedIds = [
      "agent-sec-master", "agent-work-master", "agent-fin-01", "agent-browser-02",
      "agent-mcp-03", "agent-ide-04", "agent-api-05", "agent-sentinel-06",
      "agent-db-backup-08", "agent-git-guard", "agent-secrets-scan", "agent-sandbox-jail",
      "agent-slack-bot", "agent-con-jira", "agent-mail-filter", "agent-k8s-pod"
    ];

    const defaultEdges: Edge[] = [
      // Control hierarchy links (Master -> Slaves)
      { source: "agent-sec-master", target: "agent-mcp-03", status: "healthy" },
      { source: "agent-sec-master", target: "agent-api-05", status: "healthy" },
      { source: "agent-sec-master", target: "agent-sentinel-06", status: "healthy" },
      { source: "agent-sec-master", target: "agent-secrets-scan", status: "healthy" },
      { source: "agent-sec-master", target: "agent-sandbox-jail", status: "healthy" },
      { source: "agent-sec-master", target: "agent-k8s-pod", status: "healthy" },
      { source: "agent-work-master", target: "agent-fin-01", status: "healthy" },
      { source: "agent-work-master", target: "agent-browser-02", status: "healthy" },
      { source: "agent-work-master", target: "agent-ide-04", status: "healthy" },
      { source: "agent-work-master", target: "agent-db-backup-08", status: "healthy" },
      { source: "agent-work-master", target: "agent-git-guard", status: "healthy" },
      { source: "agent-work-master", target: "agent-slack-bot", status: "healthy" },
      { source: "agent-work-master", target: "agent-con-jira", status: "healthy" },
      { source: "agent-work-master", target: "agent-mail-filter", status: "healthy" },

      // Operator interfaces
      { source: "human-ciso", target: "agent-sec-master", status: "healthy" },
      { source: "human-ciso", target: "agent-work-master", status: "healthy" },

      // Operational links
      { source: "agent-browser-02", target: "api-gateway", status: "healthy" },
      { source: "agent-ide-04", target: "api-gateway", status: "healthy" },
      { source: "agent-mcp-03", target: "api-gateway", status: "healthy" },
      { source: "agent-sentinel-06", target: "decoy-salary", status: "healthy" },
      { source: "agent-db-backup-08", target: "api-gateway", status: "healthy" },
    ];

    const finalEdges = [...defaultEdges];

    // Append dynamic links for manually provisioned custom agents
    const customAgents = agents.filter((a) => !predefinedIds.includes(a.id));
    customAgents.forEach((ag) => {
      if (ag.parentId) {
        let edgeStatus: Edge["status"] = "healthy";
        if (ag.status === "Offline") edgeStatus = "inactive";
        else if (ag.status === "Warning") edgeStatus = "warning";
        else if (ag.status === "Isolated") edgeStatus = "blocked";

        finalEdges.push({
          source: ag.parentId,
          target: ag.id,
          status: edgeStatus,
        });
      }
    });

    if (simulationStep === 0) {
      return [
        ...finalEdges,
        { source: "agent-fin-01", target: "db-finance", status: "inactive" },
        { source: "agent-fin-01", target: "decoy-salary", status: "inactive" },
      ];
    } else if (simulationStep === 1) {
      return [
        ...finalEdges,
        { source: "agent-fin-01", target: "db-finance", status: "warning" },
        { source: "agent-fin-01", target: "decoy-salary", status: "inactive" },
      ];
    } else if (simulationStep >= 2) {
      return [
        ...finalEdges,
        { source: "agent-fin-01", target: "db-finance", status: "blocked" },
        { source: "agent-fin-01", target: "decoy-salary", status: "blocked" },
      ];
    }
    return finalEdges;
  };

  const edges = getEdges();

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".node-button")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoom((z) => Math.max(0.5, Math.min(2, z + factor)));
  };

  const resetMap = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Find agent info to render current status color
  const getAgentStatusColor = (nodeId: string) => {
    const ag = agents.find((a) => a.id === nodeId);
    if (!ag) return "border-white/10 text-white bg-white/5";
    switch (ag.status) {
      case "Active":
        return "border-[#00FF9D]/40 text-[#00FF9D] bg-[#00FF9D]/10 shadow-[0_0_15px_rgba(0,255,157,0.15)]";
      case "Warning":
        return "border-[#FFB020]/40 text-[#FFB020] bg-[#FFB020]/10 shadow-[0_0_15px_rgba(255,176,32,0.15)]";
      case "Isolated":
        return "border-[#FF4D4D]/50 text-[#FF4D4D] bg-[#FF4D4D]/15 shadow-[0_0_20px_rgba(255,77,77,0.3)] border-dashed border-2 animate-pulse";
      case "Learning":
        return "border-[#5DA9FF]/40 text-[#5DA9FF] bg-[#5DA9FF]/10 shadow-[0_0_15px_rgba(93,169,255,0.15)]";
      case "Offline":
        return "border-white/5 text-white/20 bg-[#080808]/40 opacity-30 cursor-not-allowed border-dashed";
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-3xl bg-[#080808] border border-white/[0.05] overflow-hidden select-none">
      {/* Visual background elements */}
      <div className="absolute inset-0 grid-mesh opacity-40" />
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-wider text-gold uppercase">Enterprise Swarm Map</h3>
        <p className="text-[10px] text-mutedText">Live agent telemetry & trust topologies</p>
      </div>

      {/* Control overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => handleZoom(0.1)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white text-sm hover:bg-gold/10 transition-colors"
        >
          ＋
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white text-sm hover:bg-gold/10 transition-colors"
        >
          －
        </button>
        <button
          onClick={resetMap}
          className="px-2 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-gold/50 flex items-center justify-center text-[10px] text-white uppercase tracking-wider hover:bg-gold/10 transition-colors"
        >
          Reset View
        </button>
      </div>

      {/* Connection Indicator Legend */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 text-[9px] text-mutedText bg-[#0A0A0A]/80 px-4 py-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" />
          <span>Active Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FFB020] shadow-[0_0_8px_#FFB020] animate-pulse" />
          <span>Policy Drift</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF4D4D] shadow-[0_0_8px_#FF4D4D] animate-ping" />
          <span>Blocked Threat</span>
        </div>
      </div>

      {/* Interactive Graph Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-grab active:cursor-grabbing`}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="w-full h-full relative"
        >
          <svg className="absolute inset-0 w-[1000px] h-[1000px]" style={{ pointerEvents: "none" }}>
            <defs>
              <linearGradient id="healthy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 255, 157, 0.4)" />
                <stop offset="100%" stopColor="rgba(212, 175, 55, 0.1)" />
              </linearGradient>
              <linearGradient id="warning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB020" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
              <linearGradient id="blocked-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Render Edges */}
            {edges.map((edge, idx) => {
              const sourceNode = dynamicNodes.find((n) => n.id === edge.source);
              const targetNode = dynamicNodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const sourceAgent = agents.find(a => a.id === edge.source);
              const targetAgent = agents.find(a => a.id === edge.target);
              const isOfflineEdge = (sourceAgent && sourceAgent.status === "Offline") || (targetAgent && targetAgent.status === "Offline");

              const isWarning = edge.status === "warning";
              const isBlocked = edge.status === "blocked";
              const isInactive = edge.status === "inactive" || isOfflineEdge;

              let strokeColor = "rgba(255, 255, 255, 0.08)";
              let strokeDash = "4 4";
              let glowColor = "transparent";

              if (edge.status === "healthy") {
                strokeColor = "rgba(0, 255, 157, 0.2)";
                strokeDash = "none";
              } else if (isWarning) {
                strokeColor = "#FFB020";
                strokeDash = "5 3";
                glowColor = "rgba(255, 176, 32, 0.25)";
              } else if (isBlocked) {
                strokeColor = "#FF4D4D";
                strokeDash = "none";
                glowColor = "rgba(255, 77, 77, 0.4)";
              }

              return (
                <g key={idx}>
                  {/* Outer glow line */}
                  {glowColor !== "transparent" && (
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={glowColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}
                  {/* Core Line */}
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={strokeColor}
                    strokeWidth={isBlocked || isWarning ? "2" : "1"}
                    strokeDasharray={isInactive ? "8 8" : strokeDash}
                    strokeLinecap="round"
                  />

                  {/* Flow Animation Dot */}
                  {!isInactive && !isBlocked && (
                    <circle r="3" fill={isWarning ? "#FFB020" : "#00FF9D"}>
                      <animateMotion
                        dur={isWarning ? "1.5s" : "3s"}
                        repeatCount="indefinite"
                        path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                      />
                    </circle>
                  )}

                  {/* Block sign on blocked edge */}
                  {isBlocked && (
                    <g transform={`translate(${(sourceNode.x + targetNode.x) / 2}, ${(sourceNode.y + targetNode.y) / 2})`}>
                      <circle r="10" fill="#FF4D4D" />
                      <line x1="-5" y1="-5" x2="5" y2="5" stroke="white" strokeWidth="2" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Nodes */}
          {dynamicNodes.map((node) => {
            const isAgent = node.type === "Agent";
            const nodeColorClass = isAgent
              ? getAgentStatusColor(node.id)
              : "border-white/10 text-white bg-white/5";

            // If Finance Agent is isolated, overlay a dashed warning ring
            const isFinanceAgent = node.id === "agent-fin-01";
            const isIsolated = isFinanceAgent && simulationStep >= 3;

            return (
              <motion.div
                key={node.id}
                style={{
                  position: "absolute",
                  left: node.x - 30,
                  top: node.y - 30,
                }}
                className="flex flex-col items-center select-none"
              >
                {/* Floating particle wrap */}
                <motion.div
                  animate={
                    isIsolated
                      ? { scale: [1, 1.05, 1], rotate: [0, 180, 360] }
                      : { y: [0, -4, 0] }
                  }
                  transition={
                    isIsolated
                      ? { duration: 12, repeat: Infinity, ease: "linear" }
                      : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }
                  className={`node-button relative w-16 h-16 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 ${nodeColorClass}`}
                >
                  {node.type === "Agent" ? (
                    <AgentInvader
                      status={agents.find((a) => a.id === node.id)?.status || "Active"}
                      agentId={node.id}
                      size={36}
                    />
                  ) : node.type === "Database" ? (
                    <Database className="h-5 w-5 text-[#5DA9FF] filter drop-shadow-[0_0_8px_rgba(93,169,255,0.4)]" />
                  ) : node.type === "Server" ? (
                    <Server className="h-5 w-5 text-gold-secondary filter drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                  ) : node.type === "API" ? (
                    <Cloud className="h-5 w-5 text-gold filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                  ) : node.type === "Human" ? (
                    <User className="h-5 w-5 text-[#00FF9D] filter drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]" />
                  ) : node.type === "Honeypot" ? (
                    <Lock className="h-5 w-5 text-critical filter drop-shadow-[0_0_8px_rgba(255,77,77,0.5)] animate-pulse" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-white" />
                  )}

                  {/* Red flashing sandbox lock overlay for isolated agents */}
                  {isIsolated && (
                    <span className="absolute -top-1 -right-1 bg-[#FF4D4D] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-black animate-pulse shadow-[0_0_10px_#FF4D4D]">
                      ✕
                    </span>
                  )}
                </motion.div>

                {/* Node Label */}
                <div className="mt-2 text-center">
                  <span className="text-[10px] text-white font-medium block whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-md border border-white/5">
                    {node.label}
                  </span>
                  <span className="text-[8px] text-mutedText uppercase tracking-wider block">
                    {node.type}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
