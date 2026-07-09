import React from "react";

interface IdbiLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function IdbiLogo({ className = "", size = 32, showText = false }: IdbiLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_0_10px_rgba(0,131,108,0.4)] flex-shrink-0"
      >
        {/* White circle background */}
        <circle cx="50" cy="50" r="46" fill="#FFFFFF" />

        {/* Orange logo motif carved using white cutouts to match the official emblem */}
        {/* Left curving petal (Pastel terracotta orange) */}
        <path
          d="M50 82 C32 82 24 66 24 48 C24 30 33 18 44 16 C41 22 38 28 38 34 C38 41 45 48 45 48 C45 64 48 76 50 82 Z"
          fill="#DF955B"
        />

        {/* Right curving petal (Pastel terracotta orange) */}
        <path
          d="M50 82 C68 82 76 66 76 48 C76 30 67 18 56 16 C59 22 62 28 62 34 C62 41 55 48 55 48 C55 64 52 76 50 82 Z"
          fill="#DF955B"
        />

        {/* White stem representing the "i" stalk */}
        <rect
          x="47.5"
          y="44"
          width="5"
          height="38"
          rx="2.5"
          fill="#FFFFFF"
        />

        {/* White circle creating the gap around the dot of the "i" */}
        <circle
          cx="50"
          cy="31"
          r="11"
          fill="#FFFFFF"
        />

        {/* Orange dot of the "i" (Pastel terracotta orange) */}
        <circle
          cx="50"
          cy="31"
          r="6"
          fill="#DF955B"
        />
      </svg>

      {/* Rebranded typography matching official logo layout */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-baseline font-sans">
            <span className="font-extrabold tracking-[-0.04em] text-white text-xl leading-none font-serif mr-1">
              IDBI
            </span>
            <span className="font-light tracking-[0.05em] text-white text-xl leading-none font-sans uppercase">
              BANK
            </span>
          </div>
          <span className="text-[7.5px] font-mono tracking-[0.35em] text-gold-secondary uppercase mt-1.5 leading-none">
            Finne OS Platform
          </span>
        </div>
      )}
    </div>
  );
}
