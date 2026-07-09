"use client";

import React from "react";
import { motion } from "framer-motion";

interface AgentInvaderProps {
  status: "Active" | "Warning" | "Isolated" | "Learning" | "Offline";
  agentId?: string;
  className?: string;
  size?: number;
}

export default function AgentInvader({ status, agentId, className = "", size = 40 }: AgentInvaderProps) {
  // Map individual agent IDs to unique identity colors
  const getBaseColor = () => {
    if (status === "Offline") return "#333333"; // Dark gray when offline
    if (status === "Isolated") return "#FF4D4D"; // Red for quarantine isolation
    if (status === "Warning") return "#FFB020"; // Amber for warnings
    
    switch (agentId) {
      case "agent-fin-01":
        return "#D4AF37"; // Gold
      case "agent-browser-02":
        return "#00E5FF"; // Teal
      case "agent-mcp-03":
        return "#39FF14"; // Cyber Green
      case "agent-ide-04":
        return "#BF00FF"; // Electric Purple
      case "agent-api-05":
        return "#0077FF"; // Azure Blue
      default:
        return "#FF5722"; // Orange
    }
  };

  const color = getBaseColor();

  // Opacity/Glow settings based on status
  const getGlowOpacity = () => {
    switch (status) {
      case "Offline": return 0.08;
      case "Isolated": return 0.5;
      case "Warning": return 0.4;
      default: return 0.25;
    }
  };

  const isOffline = status === "Offline";

  return (
    <motion.div
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
      // Slow float/breathing animation
      animate={isOffline ? { y: 0 } : { y: [0, -3, 0] }}
      transition={isOffline ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <filter id={`invader-glow-${status}-${agentId || "default"}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dotted horizontal line behind the invader feet */}
        <line
          x1="2"
          y1="32"
          x2="38"
          y2="32"
          stroke={isOffline ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.08)"}
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />

        <g filter={isOffline ? "" : `url(#invader-glow-${status}-${agentId || "default"})`}>
          {/* Main Head/Body */}
          <rect
            x="8"
            y="8"
            width="24"
            height="16"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />

          {/* Left Ear/Arm */}
          <rect
            x="4"
            y="13"
            width="4"
            height="6"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />

          {/* Right Ear/Arm */}
          <rect
            x="32"
            y="13"
            width="4"
            height="6"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />

          {/* 4 Walking Legs */}
          {/* Leg 1 (Left Outer) */}
          <motion.rect
            x="10"
            y="24"
            width="3"
            height="8"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            animate={isOffline ? { height: 6 } : { height: [8, 4, 8] }}
            transition={isOffline ? {} : { duration: 0.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Leg 2 (Left Inner) */}
          <motion.rect
            x="16"
            y="24"
            width="3"
            height="4"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            animate={isOffline ? { height: 6 } : { height: [4, 8, 4] }}
            transition={isOffline ? {} : { duration: 0.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Leg 3 (Right Inner) */}
          <motion.rect
            x="21"
            y="24"
            width="3"
            height="8"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            animate={isOffline ? { height: 6 } : { height: [8, 4, 8] }}
            transition={isOffline ? {} : { duration: 0.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Leg 4 (Right Outer) */}
          <motion.rect
            x="27"
            y="24"
            width="3"
            height="4"
            fill={color}
            fillOpacity={getGlowOpacity()}
            stroke={color}
            strokeWidth="1.5"
            animate={isOffline ? { height: 6 } : { height: [4, 8, 4] }}
            transition={isOffline ? {} : { duration: 0.6, repeat: Infinity, ease: "linear" }}
          />

          {/* 2 Square Eyes */}
          {/* Left Eye */}
          <rect
            x="13"
            y="13"
            width="4"
            height="4"
            fill="#050505"
            stroke={color}
            strokeWidth="1"
          />
          {/* Left Eye Pupil */}
          <motion.rect
            x="14.5"
            y="14.5"
            width="1"
            height="1"
            fill={isOffline ? "#222222" : color}
            animate={isOffline ? {} : { opacity: [1, 0.4, 1] }}
            transition={isOffline ? {} : { duration: 1.5, repeat: Infinity }}
          />

          {/* Right Eye */}
          <rect
            x="23"
            y="13"
            width="4"
            height="4"
            fill="#050505"
            stroke={color}
            strokeWidth="1"
          />
          {/* Right Eye Pupil */}
          <motion.rect
            x="24.5"
            y="14.5"
            width="1"
            height="1"
            fill={isOffline ? "#222222" : color}
            animate={isOffline ? {} : { opacity: [1, 0.4, 1] }}
            transition={isOffline ? {} : { duration: 1.5, delay: 0.1, repeat: Infinity }}
          />

          {/* Status Alert Overlay HUD */}
          {status === "Warning" && (
            <motion.rect
              x="2"
              y="2"
              width="36"
              height="30"
              stroke="#FFB020"
              strokeWidth="1"
              strokeDasharray="2 4"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          )}

          {status === "Isolated" && (
            <g>
              <path d="M 2 8 L 2 2 L 8 2" stroke="#FF4D4D" strokeWidth="1.5" />
              <path d="M 38 8 L 38 2 L 32 2" stroke="#FF4D4D" strokeWidth="1.5" />
              <path d="M 2 26 L 2 32 L 8 32" stroke="#FF4D4D" strokeWidth="1.5" />
              <path d="M 38 26 L 38 32 L 32 32" stroke="#FF4D4D" strokeWidth="1.5" />
            </g>
          )}

          {status === "Learning" && (
            <motion.rect
              x="8"
              y="8"
              width="24"
              height="1.2"
              fill="#5DA9FF"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </g>
      </svg>
    </motion.div>
  );
}
