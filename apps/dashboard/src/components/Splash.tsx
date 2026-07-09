"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Activity, 
  Lock, 
  Zap,
  Maximize2,
  Minimize2,
  List,
  BarChart3,
  RefreshCw,
  Bell
} from "lucide-react";
import IdbiLogo from "./IdbiLogo";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [stage, setStage] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedCard, setExpandedCard] = useState<"market" | "credit" | "flow" | "radar" | null>(null);

  // View switchers inside individual cards
  const [marketView, setMarketView] = useState<"line" | "candle">("line");
  const [portfolioView, setPortfolioView] = useState<"donut" | "dist">("donut");
  const [flowView, setFlowView] = useState<"river" | "ledger">("river");
  const [radarView, setRadarView] = useState<"radar" | "logs">("radar");

  // Timed transitions for boot sequence overlay
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1200)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Bottom sequence loader state controller
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : 4));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Ticker offset scroll loop
  const [tickerOffset, setTickerOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev - 1) % 300);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // REAL-TIME FLUCTUATION & OSCILLATOR STATES
  // ==========================================
  
  // 1. NIFTY 50 live feed states
  const [niftyPrice, setNiftyPrice] = useState(24745.35);
  const [niftyChange, setNiftyChange] = useState(135.45);
  const [niftyChangePct, setNiftyChangePct] = useState(0.55);
  const [niftyPoints, setNiftyPoints] = useState([80, 85, 75, 70, 65, 55, 60, 48, 50, 38, 42, 28, 32, 18, 22, 10]);

  // Interactive NIFTY hover crosshair states
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [niftyHoverPrice, setNiftyHoverPrice] = useState<number | null>(null);

  // Dynamic Candlestick heights state
  const [candleHeights, setCandleHeights] = useState([
    { body: 40, wick: 60, up: true },
    { body: 30, wick: 50, up: false },
    { body: 55, wick: 75, up: true },
    { body: 45, wick: 65, up: true },
    { body: 20, wick: 40, up: false },
    { body: 65, wick: 85, up: true },
    { body: 50, wick: 70, up: false },
    { body: 75, wick: 95, up: true },
    { body: 35, wick: 55, up: false },
    { body: 60, wick: 80, up: true }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hoveredIdx !== null) return; 
      const delta = (Math.random() - 0.45) * 9.5;
      
      setNiftyPrice(prev => Number((prev + delta).toFixed(2)));
      setNiftyChange(prev => Number((prev + delta).toFixed(2)));
      setNiftyChangePct(prev => {
        const nextPct = ((niftyChange + delta) / 24610) * 100;
        return Number(nextPct.toFixed(2));
      });

      // Shift graph line coordinates
      setNiftyPoints(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const nextVal = Math.max(10, Math.min(90, last + (Math.random() - 0.5) * 16));
        next.push(nextVal);
        return next;
      });

      // Fluctuate candlesticks
      setCandleHeights(prev => prev.map(c => {
        const newBody = Math.max(15, Math.min(80, c.body + Math.floor((Math.random() - 0.5) * 10)));
        return {
          body: newBody,
          wick: Math.min(95, newBody + 15),
          up: Math.random() > 0.4
        };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [niftyChange, hoveredIdx]);

  const niftyPath = niftyPoints.reduce((acc, val, idx) => {
    const x = (idx * (400 / (niftyPoints.length - 1))).toFixed(0);
    return acc + `${idx === 0 ? "M" : " L"} ${x},${val.toFixed(0)}`;
  }, "");
  const niftyAreaPath = niftyPath + ` L 400,100 L 0,100 Z`;

  const handleNiftyMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (isNaN(pct)) return;
    const idx = Math.max(0, Math.min(niftyPoints.length - 1, Math.round(pct * (niftyPoints.length - 1))));
    if (isNaN(idx) || idx === undefined || niftyPoints[idx] === undefined) return;
    setHoveredIdx(idx);
    const priceOffset = (100 - niftyPoints[idx]) * 4.5;
    setNiftyHoverPrice(24500 + priceOffset);
  };

  // 2. Loan Portfolio states
  const [portfolioTotal, setPortfolioTotal] = useState(245680);
  const [performingVol, setPerformingVol] = useState(215430);
  const [watchlistVol, setWatchlistVol] = useState(18245);
  const [npaVol, setNpaVol] = useState(5115);
  const [activeDonutSlice, setActiveDonutSlice] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor((Math.random() - 0.5) * 120);
      setPortfolioTotal(prev => prev + delta);
      setPerformingVol(prev => prev + Math.floor(delta * 0.87));
      setWatchlistVol(prev => prev + Math.floor(delta * 0.08));
      setNpaVol(prev => Math.max(4800, prev + Math.floor(delta * 0.02)));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // 3. Transactions Per Second & Success rates
  const [tps, setTps] = useState(12458);
  const [successRate, setSuccessRate] = useState(99.72);
  const [volumeToday, setVolumeToday] = useState(124560);
  const [surgeActive, setSurgeActive] = useState(false);
  const [ledgerLogs, setLedgerLogs] = useState<string[]>([
    "15:30:12 - RTGS Settlement ₹4.2 Cr - SUCCESS",
    "15:30:15 - UPI QR Transfer ₹5,500 - SUCCESS",
    "15:30:18 - NEFT Clearing ₹18.5 L - SUCCESS",
    "15:30:20 - ATM Cash Disbursed ₹10,000 - SUCCESS",
    "15:30:21 - IMPS Instant Transfer ₹2.5 L - SUCCESS"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (surgeActive) return;
      setTps(prev => Math.floor(prev + (Math.random() - 0.5) * 36));
      setVolumeToday(prev => prev + Math.floor(Math.random() * 4));
      setSuccessRate(prev => {
        const delta = (Math.random() - 0.5) * 0.03;
        return Number(Math.max(99.50, Math.min(99.99, prev + delta)).toFixed(2));
      });
    }, 800);
    return () => clearInterval(interval);
  }, [surgeActive]);

  const triggerSurge = () => {
    if (surgeActive) return;
    setSurgeActive(true);
    setTps(prev => prev + 1200);
    setVolumeToday(prev => prev + 450);
    
    // Inject surge records in ledger
    setLedgerLogs(prev => [
      `15:30:25 - SURGE TRIGGER: UPI volume spike! (+1,200 TPS)`,
      ...prev.slice(0, 4)
    ]);
    
    setTimeout(() => {
      setSurgeActive(false);
    }, 3000);
  };

  // 4. Risk Radar scan nodes
  const [radarDots, setRadarDots] = useState([
    { id: 1, cx: 80, cy: 30, color: "fill-critical", size: 3.5, opacity: 0.9 },
    { id: 2, cx: 120, cy: 75, color: "fill-warning", size: 3, opacity: 0.7 },
    { id: 3, cx: 140, cy: 45, color: "fill-success", size: 2.5, opacity: 0.8 },
    { id: 4, cx: 60, cy: 60, color: "fill-warning", size: 3.5, opacity: 0.5 }
  ]);
  const [radarRipples, setRadarRipples] = useState<{ id: number; cx: number; cy: number }[]>([]);
  const [earlyAlerts, setEarlyAlerts] = useState(23);
  const [radarLogs, setRadarLogs] = useState<string[]>([
    "PAN/Aadhaar match score: 98% (IDBI-192)",
    "NPA prediction: default probability < 0.15%",
    "Risk analysis: MSME loan stress low",
    "Security clearance: SSL handshake OK"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarDots(prev => prev.map(dot => {
        if (Math.random() > 0.6) {
          return {
            ...dot,
            cx: Math.max(30, Math.min(170, dot.cx + Math.floor((Math.random() - 0.5) * 16))),
            cy: Math.max(20, Math.min(80, dot.cy + Math.floor((Math.random() - 0.5) * 16))),
            opacity: Number((0.4 + Math.random() * 0.6).toFixed(1))
          };
        }
        return dot;
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleRadarClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newRipple = { id: Date.now(), cx: x, cy: y };
    setRadarRipples(prev => [...prev, newRipple]);
    setEarlyAlerts(prev => prev + 1);

    // Append a log warning
    setRadarLogs(prev => [
      `Flagged: Sonar ping registered at coords (${x.toFixed(0)}, ${y.toFixed(0)})`,
      ...prev.slice(0, 3)
    ]);

    // Append active dot at coordinates
    const newDot = { id: Date.now(), cx: x, cy: y, color: "fill-critical", size: 4, opacity: 1 };
    setRadarDots(prev => [...prev, newDot]);

    setTimeout(() => {
      setRadarRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  // Tickers stock data
  const tickers = [
    { name: "RELIANCE", price: "2,895.10", change: "+1.28%" },
    { name: "HDFCBANK", price: "1,678.35", change: "+0.94%" },
    { name: "ICICIBANK", price: "1,245.50", change: "+1.15%" },
    { name: "SBIN", price: "812.25", change: "+0.72%" },
    { name: "TCS", price: "3,982.45", change: "+0.88%" },
    { name: "IDBIBANK", price: "88.60", change: "+4.12%" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050607] overflow-hidden select-none font-sans text-white">
      {/* Subtle background grid mesh */}
      <div className="absolute inset-0 grid-mesh opacity-10 pointer-events-none" />

      {/* Floating financial/banking symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] z-0">
        <div className="absolute top-[12%] left-[8%] text-7xl font-bold animate-float">₹</div>
        <div className="absolute top-[45%] right-[12%] text-9xl font-bold animate-float-delayed">₹</div>
        <div className="absolute bottom-[25%] left-[18%] text-8xl font-bold animate-float">₹</div>
        <div className="absolute top-[22%] left-[48%] text-6xl font-bold animate-float-delayed">%</div>
        <div className="absolute bottom-[12%] right-[32%] text-7xl font-bold animate-float">%</div>
      </div>

      {/* Scanline indicator overlay */}
      <div className="scanline" />

      {/* TOP HEADER */}
      <header className="absolute top-0 left-0 w-full h-14 border-b border-white/5 bg-[#050607]/80 backdrop-blur-md flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#2F8E7F] animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 uppercase">
            FINNE OS :: BOOT INITIALIZATION STAGED v3.0.0 (IDBI)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-mutedText uppercase tracking-wider">
            STATUS:
          </span>
          <div className="bg-black/40 border border-white/5 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 text-[8.5px] font-mono font-medium text-[#00FF9D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
            <span>IDBI SECURE GATEWAY ACTIVE</span>
          </div>
        </div>
      </header>

      {/* MAIN DYNAMIC BENTO GRID */}
      <div className="w-[96vw] h-[86vh] max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-5 z-10 p-2 mt-12 mb-16 relative">
        
        {/* ====================================================
            QUADRANT 1: MARKET PULSE (NIFTY FEED)
           ==================================================== */}
        <AnimatePresence mode="wait">
          {(expandedCard === null || expandedCard === "market") && (
            <motion.div 
              layoutId="market-card"
              className={`glass-panel p-4 bg-[#080809]/60 border border-white/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#2F8E7F]/30 hover:shadow-[0_0_15px_rgba(47,142,127,0.08)] group ${
                expandedCard === "market" ? "md:col-span-2 md:row-span-2 h-[80vh] z-40 bg-[#08080A]/95 border-[#2F8E7F]/30" : "h-[38vh] md:h-auto"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-mono font-bold">
                  <TrendingUp className="h-3.5 w-3.5 text-[#2F8E7F]" />
                  <span>Market Pulse :: NIFTY 50 Live Feed</span>
                </div>
                
                {/* Expand / Minimize & Toggle View controls */}
                <div className="flex items-center gap-2.5 z-30">
                  <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5 text-[8px] font-mono">
                    <button 
                      type="button" 
                      onClick={() => setMarketView("line")} 
                      className={`px-2 py-0.5 rounded transition-all ${marketView === "line" ? "bg-[#2F8E7F] text-white" : "text-white/40"}`}
                    >
                      LINE
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMarketView("candle")} 
                      className={`px-2 py-0.5 rounded transition-all ${marketView === "candle" ? "bg-[#2F8E7F] text-white" : "text-white/40"}`}
                    >
                      CANDLE
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setExpandedCard(expandedCard === "market" ? null : "market")}
                    className="p-1 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded transition-all text-white/40 hover:text-white"
                  >
                    {expandedCard === "market" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Chart & Value Contents */}
              <div className="flex-1 flex flex-col justify-between my-2 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-mutedText uppercase block">NIFTY 50 INDEX</span>
                    <span className="text-2xl md:text-3xl font-black text-white leading-none font-mono">
                      {hoveredIdx !== null && niftyHoverPrice 
                        ? niftyHoverPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })
                        : niftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-[#00FF9D] font-mono font-bold ml-1.5">
                      +{niftyChange.toFixed(2)} ({niftyChangePct.toFixed(2)}%) ▲
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-white/30 block">NSE INDIA FEED</span>
                    <span className="text-[7px] text-[#2F8E7F] font-mono animate-pulse">LIVE TRACKING SECURE</span>
                  </div>
                </div>

                {/* Main Dynamic Chart view */}
                <div className="flex-1 flex items-center justify-center min-h-[100px] mt-2 relative">
                  {marketView === "line" ? (
                    <svg 
                      className="w-full h-28 cursor-crosshair" 
                      viewBox="0 0 400 100" 
                      preserveAspectRatio="none"
                      onMouseMove={handleNiftyMouseMove}
                      onMouseLeave={() => { setHoveredIdx(null); setNiftyHoverPrice(null); }}
                    >
                      <defs>
                        <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2F8E7F" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#2F8E7F" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={niftyAreaPath} fill="url(#chart-glow)" className="transition-all duration-1000 ease-in-out" />
                      <path d={niftyPath} fill="none" stroke="#2F8E7F" strokeWidth="2.5" className="transition-all duration-1000 ease-in-out" />
                      <circle cx="400" cy={niftyPoints[niftyPoints.length - 1]} r="3" fill="#00FF9D" className="animate-pulse" />
                      
                      {hoveredIdx !== null && (
                        <>
                          <line 
                            x1={(hoveredIdx * (400 / (niftyPoints.length - 1)))} 
                            y1="0" 
                            x2={(hoveredIdx * (400 / (niftyPoints.length - 1)))} 
                            y2="100" 
                            stroke="#00FF9D" 
                            strokeWidth="1" 
                            strokeDasharray="3,3" 
                          />
                          <circle 
                            cx={(hoveredIdx * (400 / (niftyPoints.length - 1)))} 
                            cy={niftyPoints[hoveredIdx]} 
                            r="5" 
                            fill="#00FF9D" 
                            stroke="#050607" 
                            strokeWidth="1.5"
                          />
                        </>
                      )}
                    </svg>
                  ) : (
                    // Candlestick graph representation
                    <div className="flex justify-between items-end w-full h-24 px-4 pt-2">
                      {candleHeights.map((c, i) => (
                        <div key={i} className="flex flex-col items-center w-4 h-full justify-end group/candle cursor-pointer">
                          <span className="text-[6px] font-mono text-white/30 hidden group-hover/candle:inline-block absolute -top-4">
                            {(24500 + c.body * 4.2).toFixed(0)}
                          </span>
                          <div className={`w-[1px] bg-white/20`} style={{ height: `${c.wick}px` }} />
                          <div className={`w-3 ${c.up ? "bg-[#00FF9D]" : "bg-[#FF4D4D]"} rounded-sm transition-all duration-1000`} style={{ height: `${c.body}px` }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Scrolling Stock quotes ticker strip */}
              <div className="border-t border-white/5 pt-2 flex items-center overflow-hidden w-full relative">
                <div 
                  className="flex whitespace-nowrap gap-6 font-mono text-[9px]"
                  style={{ transform: `translateX(${tickerOffset}px)` }}
                >
                  {tickers.concat(tickers).map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-white/40">{item.name}</span>
                      <span className="text-white font-bold">{item.price}</span>
                      <span className="text-[#00FF9D] font-bold">{item.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================================
            QUADRANT 2: CREDIT HEALTH MONITOR
           ==================================================== */}
        <AnimatePresence mode="wait">
          {(expandedCard === null || expandedCard === "credit") && (
            <motion.div 
              layoutId="credit-card"
              className={`glass-panel p-4 bg-[#080809]/60 border border-white/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#BF00FF]/30 hover:shadow-[0_0_15px_rgba(191,0,255,0.08)] group ${
                expandedCard === "credit" ? "md:col-span-2 md:row-span-2 h-[80vh] z-40 bg-[#08080A]/95 border-[#BF00FF]/30" : "h-[38vh] md:h-auto"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-mono font-bold">
                  <Activity className="h-3.5 w-3.5 text-[#BF00FF]" />
                  <span>Loan Portfolio :: Credit Health Monitor</span>
                </div>

                <div className="flex items-center gap-2.5 z-30">
                  <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5 text-[8px] font-mono">
                    <button 
                      type="button" 
                      onClick={() => setPortfolioView("donut")} 
                      className={`px-2 py-0.5 rounded transition-all ${portfolioView === "donut" ? "bg-[#BF00FF] text-white" : "text-white/40"}`}
                    >
                      DONUT
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPortfolioView("dist")} 
                      className={`px-2 py-0.5 rounded transition-all ${portfolioView === "dist" ? "bg-[#BF00FF] text-white" : "text-white/40"}`}
                    >
                      DISTRIBUTION
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setExpandedCard(expandedCard === "credit" ? null : "credit")}
                    className="p-1 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded transition-all text-white/40 hover:text-white"
                  >
                    {expandedCard === "credit" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Donut and distribution chart metrics */}
              <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-2">
                {portfolioView === "donut" ? (
                  <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke="#BF00FF" 
                        strokeWidth={activeDonutSlice === "std" ? "4.5" : "3"} 
                        strokeDasharray="75 100" 
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSlice("std")}
                        onMouseLeave={() => setActiveDonutSlice(null)}
                      />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke="#5DA9FF" 
                        strokeWidth={activeDonutSlice === "watchlist" ? "4.5" : "3"} 
                        strokeDasharray="15 100" 
                        strokeDashoffset="-75" 
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSlice("watchlist")}
                        onMouseLeave={() => setActiveDonutSlice(null)}
                      />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke="#FFB020" 
                        strokeWidth={activeDonutSlice === "substandard" ? "4.5" : "3"} 
                        strokeDasharray="8 100" 
                        strokeDashoffset="-90" 
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSlice("substandard")}
                        onMouseLeave={() => setActiveDonutSlice(null)}
                      />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke="#FF4D4D" 
                        strokeWidth={activeDonutSlice === "npa" ? "4.5" : "3"} 
                        strokeDasharray="2 100" 
                        strokeDashoffset="-98" 
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSlice("npa")}
                        onMouseLeave={() => setActiveDonutSlice(null)}
                      />
                    </svg>
                    <div className="absolute text-center pointer-events-none">
                      <span className="text-[7.5px] text-white/40 uppercase tracking-widest block font-mono">Portfolio</span>
                      <span className="text-sm font-black text-white block font-mono">₹{portfolioTotal.toLocaleString("en-IN")} Cr</span>
                      <span className="text-[7.5px] text-[#00FF9D] font-mono font-bold block mt-0.5">+2.35% (MoM)</span>
                    </div>
                  </div>
                ) : (
                  // Bar Distribution visualization
                  <div className="flex-1 flex flex-col justify-around h-32 w-full space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[8px] font-mono text-white/40 mb-1">
                        <span>RETAIL OUTSTANDING LOANS</span>
                        <span>42%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#BF00FF] rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] font-mono text-white/40 mb-1">
                        <span>CORPORATE EXPOSURES</span>
                        <span>38%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#5DA9FF] rounded-full" style={{ width: "38%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[8px] font-mono text-white/40 mb-1">
                        <span>MSME PORTFOLIO SIZE</span>
                        <span>20%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFB020] rounded-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Metrics Table details */}
                <div className="flex-1 w-full space-y-2 font-mono text-[9px] text-white/70">
                  <div 
                    className={`flex justify-between items-center border-b border-white/5 pb-1.5 transition-all duration-300 ${activeDonutSlice === "std" ? "text-white font-bold bg-white/5 px-2 py-0.5 rounded" : ""}`}
                    onMouseEnter={() => setActiveDonutSlice("std")}
                    onMouseLeave={() => setActiveDonutSlice(null)}
                  >
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#BF00FF]" /> Performing (STD)</span>
                    <span className="text-white font-bold font-mono">₹{performingVol.toLocaleString("en-IN")} Cr <span className="text-white/40">(87.71%)</span></span>
                  </div>
                  <div 
                    className={`flex justify-between items-center border-b border-white/5 pb-1.5 transition-all duration-300 ${activeDonutSlice === "watchlist" ? "text-white font-bold bg-white/5 px-2 py-0.5 rounded" : ""}`}
                    onMouseEnter={() => setActiveDonutSlice("watchlist")}
                    onMouseLeave={() => setActiveDonutSlice(null)}
                  >
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#5DA9FF]" /> Watchlist (SMA 1 & 2)</span>
                    <span className="text-white font-bold font-mono">₹{watchlistVol.toLocaleString("en-IN")} Cr <span className="text-white/40">(7.43%)</span></span>
                  </div>
                  <div 
                    className={`flex justify-between items-center border-b border-white/5 pb-1.5 transition-all duration-300 ${activeDonutSlice === "substandard" ? "text-white font-bold bg-white/5 px-2 py-0.5 rounded" : ""}`}
                    onMouseEnter={() => setActiveDonutSlice("substandard")}
                    onMouseLeave={() => setActiveDonutSlice(null)}
                  >
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FFB020]" /> Substandard (SMA 3)</span>
                    <span className="text-white font-bold font-mono">₹6,890 Cr <span className="text-white/40">(2.80%)</span></span>
                  </div>
                  <div 
                    className={`flex justify-between items-center pb-1.5 transition-all duration-300 ${activeDonutSlice === "npa" ? "text-white font-bold bg-white/5 px-2 py-0.5 rounded" : ""}`}
                    onMouseEnter={() => setActiveDonutSlice("npa")}
                    onMouseLeave={() => setActiveDonutSlice(null)}
                  >
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" /> Non-Performing (NPA)</span>
                    <span className="text-white font-bold font-mono">₹{npaVol.toLocaleString("en-IN")} Cr <span className="text-white/40">(2.06%)</span></span>
                  </div>
                </div>
              </div>

              {/* Bottom waveform */}
              <div className="w-full h-8 overflow-hidden relative">
                <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <motion.path
                    d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20"
                    fill="none"
                    stroke="#BF00FF"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    animate={{ d: [
                      "M0,20 Q25,5 50,20 T100,20 T150,20 T200,20",
                      "M0,20 Q25,35 50,20 T100,20 T150,20 T200,20",
                      "M0,20 Q25,5 50,20 T100,20 T150,20 T200,20"
                    ]}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================================
            QUADRANT 3: TRANSACTION FLOW RIVER
           ==================================================== */}
        <AnimatePresence mode="wait">
          {(expandedCard === null || expandedCard === "flow") && (
            <motion.div 
              layoutId="flow-card"
              className={`glass-panel p-4 bg-[#080809]/60 border border-white/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#DF955B]/30 hover:shadow-[0_0_15px_rgba(223,149,91,0.08)] group ${
                expandedCard === "flow" ? "md:col-span-2 md:row-span-2 h-[80vh] z-40 bg-[#08080A]/95 border-[#DF955B]/30" : "h-[38vh] md:h-auto"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-mono font-bold">
                  <Activity className="h-3.5 w-3.5 text-[#DF955B]" />
                  <span>Transaction Flow :: Real-Time Payments</span>
                </div>

                <div className="flex items-center gap-2 z-30">
                  <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5 text-[8px] font-mono">
                    <button 
                      type="button" 
                      onClick={() => setFlowView("river")} 
                      className={`px-2 py-0.5 rounded transition-all ${flowView === "river" ? "bg-[#DF955B] text-black font-bold" : "text-white/40"}`}
                    >
                      RIVER
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFlowView("ledger")} 
                      className={`px-2 py-0.5 rounded transition-all ${flowView === "ledger" ? "bg-[#DF955B] text-black font-bold" : "text-white/40"}`}
                    >
                      LEDGER
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={triggerSurge}
                    className={`text-[7px] font-mono font-black border rounded px-1.5 py-0.5 flex items-center gap-1 transition-all ${
                      surgeActive 
                        ? "bg-[#DF955B] text-black border-transparent animate-pulse" 
                        : "bg-transparent border-[#DF955B]/30 text-[#DF955B] hover:bg-[#DF955B]/10"
                    }`}
                  >
                    <Zap className="h-2.5 w-2.5" /> Surge
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setExpandedCard(expandedCard === "flow" ? null : "flow")}
                    className="p-1 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded transition-all text-white/40 hover:text-white"
                  >
                    {expandedCard === "flow" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Dynamic visualization stream */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 my-2 items-center">
                {/* Stats panel */}
                <div className="space-y-3 font-mono text-[9.5px]">
                  <div>
                    <span className="text-white/40 uppercase block">TPS (Transactions/sec)</span>
                    <span className="text-lg md:text-xl font-black text-white font-mono">
                      {tps.toLocaleString("en-IN")} <span className="text-[#00FF9D] text-[10px] font-bold">▲ 8.45%</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block">Today&apos;s Volume</span>
                    <span className="text-lg md:text-xl font-black text-white font-mono">
                      ₹{volumeToday.toLocaleString("en-IN")} Cr <span className="text-[#00FF9D] text-[10px] font-bold">▲ 11.32%</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block">Settlement success rate</span>
                    <span className="text-lg md:text-xl font-black text-[#00FF9D] font-mono">{successRate.toFixed(2)}%</span>
                  </div>
                </div>

                {/* River Particle Flow vs Ledger text lists */}
                <div className="md:col-span-2 w-full h-32 relative">
                  {flowView === "river" ? (
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      <path d="M 20,50 C 60,50 90,20 180,20" fill="none" stroke="rgba(223, 149, 91, 0.12)" strokeWidth="1.2" />
                      <path d="M 20,50 C 60,50 90,50 180,50" fill="none" stroke="rgba(223, 149, 91, 0.12)" strokeWidth="1.2" />
                      <path d="M 20,50 C 60,50 90,80 180,80" fill="none" stroke="rgba(223, 149, 91, 0.12)" strokeWidth="1.2" />
                      
                      <circle cx="20" cy="50" r="9" fill="#DF955B" fillOpacity="0.08" stroke="#DF955B" strokeWidth="0.8" />
                      <circle cx="180" cy="20" r="6" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                      <circle cx="180" cy="50" r="6" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                      <circle cx="180" cy="80" r="6" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />

                      <circle r={surgeActive ? "2.5" : "2"} fill="#DF955B">
                        <animateMotion dur={surgeActive ? "0.6s" : "2.5s"} repeatCount="indefinite" path="M 20,50 C 60,50 90,20 180,20" />
                      </circle>
                      <circle r="1.5" fill="#DF955B" opacity="0.8">
                        <animateMotion dur={surgeActive ? "0.8s" : "3.5s"} repeatCount="indefinite" path="M 20,50 C 60,50 90,20 180,20" begin="1s" />
                      </circle>
                      <circle r={surgeActive ? "2.5" : "2"} fill="#DF955B">
                        <animateMotion dur={surgeActive ? "0.5s" : "2s"} repeatCount="indefinite" path="M 20,50 C 60,50 90,50 180,50" />
                      </circle>
                      <circle r="1.5" fill="#DF955B" opacity="0.8">
                        <animateMotion dur={surgeActive ? "0.7s" : "3s"} repeatCount="indefinite" path="M 20,50 C 60,50 90,50 180,50" begin="0.8s" />
                      </circle>
                      <circle r={surgeActive ? "2.5" : "2"} fill="#DF955B">
                        <animateMotion dur={surgeActive ? "0.7s" : "2.8s"} repeatCount="indefinite" path="M 20,50 C 60,50 90,80 180,80" />
                      </circle>
                      <circle r="1.5" fill="#DF955B" opacity="0.8">
                        <animateMotion dur={surgeActive ? "0.9s" : "3.8s"} repeatCount="indefinite" path="M 20,50 C 60,50 90,80 180,80" begin="1.2s" />
                      </circle>
                    </svg>
                  ) : (
                    // Ledger records scroll list
                    <div className="h-full overflow-y-auto space-y-1.5 pr-2 flex flex-col justify-end font-mono text-[8px] text-white/50">
                      {ledgerLogs.map((log, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1">
                          <span className={log.includes("SURGE") ? "text-[#DF955B] font-bold" : ""}>{log}</span>
                          <span className="text-[#00FF9D]">SUCCESS</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================================
            QUADRANT 4: RISK RADAR :: EARLY WARNING SYSTEM
           ==================================================== */}
        <AnimatePresence mode="wait">
          {(expandedCard === null || expandedCard === "radar") && (
            <motion.div 
              layoutId="radar-card"
              className={`glass-panel p-4 bg-[#080809]/60 border border-white/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#2F8E7F]/30 hover:shadow-[0_0_15px_rgba(47,142,127,0.08)] group ${
                expandedCard === "radar" ? "md:col-span-2 md:row-span-2 h-[80vh] z-40 bg-[#08080A]/95 border-[#2F8E7F]/30" : "h-[38vh] md:h-auto"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-mono font-bold">
                  <Activity className="h-3.5 w-3.5 text-[#2F8E7F]" />
                  <span>Risk Radar :: Early Warning System</span>
                </div>

                <div className="flex items-center gap-2.5 z-30">
                  <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5 text-[8px] font-mono">
                    <button 
                      type="button" 
                      onClick={() => setRadarView("radar")} 
                      className={`px-2 py-0.5 rounded transition-all ${radarView === "radar" ? "bg-[#2F8E7F] text-white" : "text-white/40"}`}
                    >
                      RADAR
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRadarView("logs")} 
                      className={`px-2 py-0.5 rounded transition-all ${radarView === "logs" ? "bg-[#2F8E7F] text-white" : "text-white/40"}`}
                    >
                      RISK LOGS
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setExpandedCard(expandedCard === "radar" ? null : "radar")}
                    className="p-1 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded transition-all text-white/40 hover:text-white"
                  >
                    {expandedCard === "radar" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Animation and stats */}
              <div className="flex-1 flex items-center justify-between gap-6 my-2">
                {/* Radar Grid vs Alerts Log lists */}
                {radarView === "radar" ? (
                  <div className="relative w-32 h-32 border border-white/5 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                    <div className="absolute w-20 h-20 border border-white/5 rounded-full" />
                    <div className="absolute w-10 h-10 border border-white/5 rounded-full" />
                    
                    {/* Rotating Sweep pointer */}
                    <motion.div
                      className="absolute w-32 h-32 rounded-full pointer-events-none z-10"
                      style={{
                        background: "conic-gradient(from 0deg, rgba(47,142,127,0.18) 0deg, rgba(47,142,127,0) 90deg)"
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Sonar sweep Click-to-Ping catcher */}
                    <svg 
                      className="absolute inset-0 w-full h-full z-20 cursor-pointer" 
                      viewBox="0 0 200 100"
                      onClick={handleRadarClick}
                    >
                      {radarRipples.map(r => (
                        <motion.circle
                          key={r.id}
                          cx={r.cx}
                          cy={r.cy}
                          r="6"
                          fill="none"
                          stroke="#FF4D4D"
                          strokeWidth="1.5"
                          initial={{ scale: 0.1, opacity: 0.9 }}
                          animate={{ scale: 3.5, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      ))}
                    </svg>

                    {/* Dynamic Scanning dots */}
                    {radarDots.map(dot => (
                      <span 
                        key={dot.id}
                        className={`absolute w-1.5 h-1.5 rounded-full ${dot.color} animate-pulse transition-all duration-1000`} 
                        style={{ 
                          top: `${dot.cy}%`, 
                          left: `${dot.cx}%`,
                          opacity: dot.opacity 
                        }} 
                      />
                    ))}
                  </div>
                ) : (
                  // Risk checklist logs
                  <div className="flex-1 h-32 overflow-y-auto space-y-1.5 pr-2 flex flex-col justify-end font-mono text-[8px] text-white/50">
                    {radarLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-1.5 border-b border-white/5 pb-1">
                        <span className="w-1 h-1 rounded-full bg-critical" />
                        <span className="flex-1">{log}</span>
                        <span className="text-white/30 text-[7px]">VERIFIED</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metrics stats */}
                <div className="flex-1 space-y-2 font-mono text-[9px] text-white/70">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span>High Risk Accounts</span>
                    <span className="text-[#FF4D4D] font-bold">128 <span className="text-white/30 text-[8px]">▲ 12</span></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span>Medium Risk Accounts</span>
                    <span className="text-warning font-bold">542 <span className="text-white/30 text-[8px]">▲ 28</span></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span>Low Risk Accounts</span>
                    <span className="text-[#00FF9D] font-bold">4,812 <span className="text-white/30 text-[8px]">▼ 32</span></span>
                  </div>
                  <div className="flex justify-between items-center pb-1.5">
                    <span>Early Warning Alerts</span>
                    <span className="text-critical font-bold">{earlyAlerts} <span className="text-white/30 text-[8px]">▲ 5</span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ====================================================
          CENTER BRAND OVERLAY & INITIALIZE ACTION BUTTON
         ==================================================== */}
      {expandedCard === null && (
        <div className="absolute z-20 flex flex-col items-center text-center px-4 pointer-events-none">
          <AnimatePresence mode="wait">
            {stage >= 1 && (
              <motion.div
                key="finne-os-main-stage"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center pointer-events-auto"
              >
                {/* Centered official IDBI logo symbol */}
                <div className="mb-6 relative p-1 rounded-full bg-[#050607]/80 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/5">
                  <IdbiLogo size={82} />
                </div>

                {/* Title brand typography */}
                <h1
                  className="text-4xl md:text-5xl font-black tracking-wider text-white font-sans flex items-center gap-1.5"
                  style={{ textShadow: "0 0 40px rgba(47, 142, 127, 0.4)" }}
                >
                  Finne<span className="text-[#DF955B]"> OS</span>
                </h1>

                {/* Tagline */}
                <p className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF955B] font-sans mt-3">
                  AI-Powered Banking Intelligence. Secured by Finne OS.
                </p>

                {/* Glowing initialized entry button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setStage(4);
                    setTimeout(onComplete, 400);
                  }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 px-7 py-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-[0.18em] pointer-events-auto transition-all shadow-[0_0_20px_rgba(47,142,127,0.2)] hover:shadow-[0_0_30px_rgba(47,142,127,0.4)] backdrop-blur-md cursor-pointer"
                >
                  Initialize Banking Swarm
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ====================================================
          BOTTOM BOOT SEQUENTIAL STATUS STRIP
         ==================================================== */}
      <footer className="absolute bottom-0 left-0 w-full h-16 border-t border-white/5 bg-[#050607]/90 flex items-center justify-between px-6 z-30 font-mono text-[9px]">
        {/* Left: loading sequence items */}
        <div className="flex items-center gap-4 text-white/30">
          <span className="text-[8px] uppercase tracking-wider font-bold">System Boot Sequence</span>
          <div className="flex items-center gap-1.5">
            <span className={`transition-colors duration-300 ${activeStep >= 1 ? "text-[#00FF9D]" : ""}`}>
              CORE SERVICES LOADED
            </span>
            <span className="text-white/10">→</span>
            <span className={`transition-colors duration-300 ${activeStep >= 2 ? "text-[#00FF9D]" : ""}`}>
              AI AGENTS ONLINE
            </span>
            <span className="text-white/10">→</span>
            <span className={`transition-colors duration-300 ${activeStep >= 3 ? "text-[#00FF9D]" : ""}`}>
              DATA LAKE SYNCED
            </span>
            <span className="text-white/10">→</span>
            <span className={`transition-colors duration-300 ${activeStep >= 4 ? "text-[#00FF9D]" : ""}`}>
              SECURITY LAYER ACTIVE
            </span>
            <span className="text-white/10">→</span>
            <span className={`transition-colors duration-300 font-bold ${activeStep >= 4 ? "text-[#DF955B] animate-pulse" : ""}`}>
              BANKING SWARM INITIALIZING
            </span>
          </div>
        </div>

        {/* Right: Security indicators & IDBI brand name */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-white/30">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-[#2F8E7F]" /> ENCRYPTION: AES-256</span>
            <span className="w-1 h-3 bg-white/5" />
            <span>FIREWALL: ACTIVE</span>
          </div>
          <div className="flex items-center border-l border-white/5 pl-6 h-8 select-none">
            <IdbiLogo size={24} />
            <span className="font-extrabold tracking-[-0.04em] text-white text-xs leading-none font-serif ml-1.5 mr-0.5">
              IDBI
            </span>
            <span className="font-light tracking-[0.05em] text-white text-xs leading-none font-sans uppercase">
              BANK
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
