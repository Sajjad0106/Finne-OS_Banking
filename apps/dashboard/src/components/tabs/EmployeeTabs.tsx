"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  CheckSquare, 
  FileText, 
  UserCheck, 
  Search, 
  Filter, 
  MapPin, 
  ExternalLink,
  Bot,
  Sparkles,
  RefreshCw,
  FolderOpen
} from "lucide-react";

// Mock onboarding applications list
const initialQueue = [
  { id: "app_101", name: "Sajjad Ahmad", service: "Savings Account", lang: "Marathi", income: "₹85,000", risk: "Low (4%)", status: "Staged" },
  { id: "app_102", name: "Priya Sharma", service: "Home Loan Application", lang: "Hindi", income: "₹1,50,000", risk: "Low (6%)", status: "Staged" },
  { id: "app_103", name: "Rajesh Kumar", service: "Current Account", lang: "English", income: "₹2,10,000", risk: "Medium (18%)", status: "Staged" },
  { id: "app_104", name: "Aisha Patel", service: "Fixed Deposit Opening", lang: "Gujarati", income: "₹65,000", risk: "Low (2%)", status: "Approved" }
];

// ==========================================
// 1. EMPLOYEE OVERVIEW TAB
// ==========================================
export function EmployeeOverview({ operator }: { operator: any }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card-gold p-6 bg-gradient-to-r from-[#2F8E7F]/10 via-transparent to-transparent border-[#2F8E7F]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            IDBI Onboarding Console, <span className="text-[#DF955B] font-black">{operator?.fullName || "Staff Officer"}</span>
            <Sparkles className="h-4 w-4 text-[#DF955B] animate-pulse" />
          </h2>
          <p className="text-xs text-mutedText mt-1">
            Access, review, and clear pending customer accounts. Underwritten and validated by Finne OS compliance engine.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#2F8E7F]/20 border border-[#2F8E7F]/40 text-[#00FF9D] text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
            Clearance Level: Officer
          </span>
        </div>
      </div>

      {/* Summary figures */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <span className="text-[10px] text-mutedText uppercase tracking-wider block font-mono">Assigned Pending Review</span>
          <span className="text-2xl font-black text-white mt-1 block">3 Applications</span>
        </div>
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <span className="text-[10px] text-mutedText uppercase tracking-wider block font-mono">Cleared Today</span>
          <span className="text-2xl font-black text-[#00FF9D] mt-1 block">14 Customer KYC</span>
        </div>
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <span className="text-[10px] text-mutedText uppercase tracking-wider block font-mono">Auto-Translation Sync</span>
          <span className="text-2xl font-black text-info mt-1 block">100% Core Status</span>
        </div>
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <span className="text-[10px] text-mutedText uppercase tracking-wider block font-mono">KYC Risk Average</span>
          <span className="text-2xl font-black text-warning mt-1 block">5.4% Margin</span>
        </div>
      </div>

      {/* Internal notices */}
      <div className="glass-panel p-5 bg-[#0a0a0a]/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
          Regulatory Compliance Notices
        </h3>
        <div className="space-y-3.5 text-xs text-mutedText leading-relaxed">
          <p>
            📌 **RBI Directive AML-2026**: Ensure all applicants submitting addresses outside regional pincodes have their Aadhaar vaults matched via FIDO2 device signatures before clearance.
          </p>
          <p>
            📌 **KYC Auto-Translation**: Finne OS dynamically translated 4 applications submitted in Marathi and Gujarati. Please audit the matching names before signing the smart ledger.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ONBOARDING QUEUE TAB
// ==========================================
export function OnboardingQueue({ onViewKyc }: { onViewKyc: (app: any) => void }) {
  const [queue, setQueue] = useState(initialQueue);
  const [search, setSearch] = useState("");

  const handleApprove = (id: string) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: "Approved" } : item));
    alert("Application approved! Secure transaction signature dispatched to ledger.");
  };

  const filtered = queue.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glass-panel p-5 bg-[#0a0a0a]/80 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Branch Onboarding Queue
          </h2>
          <p className="text-[10px] text-mutedText mt-0.5">
            Review and clear multilingual applications submitted via client terminals.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="pl-8 pr-3 py-1.5 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#2F8E7F] max-w-[200px]"
            />
            <Search className="h-3.5 w-3.5 text-mutedText absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-mutedText font-mono text-[9px] uppercase tracking-wider">
              <th className="py-2.5">Application ID</th>
              <th className="py-2.5">Customer</th>
              <th className="py-2.5">Banking Service</th>
              <th className="py-2.5">Input Language</th>
              <th className="py-2.5">Reported Income</th>
              <th className="py-2.5">AI Credit Risk</th>
              <th className="py-2.5">Status</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px] text-white/90">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-3 text-mutedText">{app.id}</td>
                <td className="py-3 font-sans font-bold">{app.name}</td>
                <td className="py-3 font-sans text-xs text-[#DF955B]">{app.service}</td>
                <td className="py-3">
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[9px]">
                    {app.lang}
                  </span>
                </td>
                <td className="py-3">{app.income}</td>
                <td className="py-3 text-success font-semibold">{app.risk}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    app.status === "Approved" ? "bg-success/10 border border-success/30 text-[#00FF9D]" : "bg-warning/10 border border-warning/30 text-warning"
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => onViewKyc(app)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all"
                  >
                    View KYC
                  </button>
                  {app.status !== "Approved" && (
                    <button
                      type="button"
                      onClick={() => handleApprove(app.id)}
                      className="px-2.5 py-1 bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white font-bold rounded-lg transition-all shadow-[0_0_8px_rgba(0,131,108,0.2)]"
                    >
                      Clear
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 3. DOCUMENT KYC VERIFICATION TAB
// ==========================================
export function DocumentKyc({ activeApp }: { activeApp: any }) {
  const applicantName = activeApp?.name || "Sajjad Ahmad";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* OCR Crop details */}
      <div className="lg:col-span-2 glass-panel p-5 bg-[#0a0a0a]/80 space-y-4">
        <div className="border-b border-white/5 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            OCR Document Intelligence
          </h2>
          <p className="text-[10px] text-mutedText mt-0.5">
            Auto-extracted Aadhaar metadata vs digital register checks for applicant: **{applicantName}**
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-black/60 border border-white/15 rounded-xl space-y-2 font-mono text-[10px] text-mutedText">
            <span className="text-[#DF955B] font-bold block border-b border-white/5 pb-1">Aadhaar Card Extraction</span>
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="text-white">{applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span>DOB:</span>
              <span className="text-white">14-03-1998</span>
            </div>
            <div className="flex justify-between">
              <span>Gender:</span>
              <span className="text-white">Male</span>
            </div>
            <div className="flex justify-between">
              <span>Aadhaar No:</span>
              <span className="text-white">XXXX XXXX 3341</span>
            </div>
          </div>

          <div className="p-3 bg-black/60 border border-white/15 rounded-xl space-y-2 font-mono text-[10px] text-mutedText">
            <span className="text-[#2F8E7F] font-bold block border-b border-white/5 pb-1">PAN Card Extraction</span>
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="text-white">{applicantName.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>PAN Number:</span>
              <span className="text-white">BHMPS9920A</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Category:</span>
              <span className="text-white">Individual</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-success/5 border border-success/20 rounded-xl flex items-center gap-3 text-xs">
          <UserCheck className="h-5 w-5 text-[#00FF9D]" />
          <div>
            <span className="font-bold text-white block">Identity Cryptographic Clearance Checked</span>
            <p className="text-[10px] text-mutedText mt-0.5">
              Verified Aadhaar XML digital signature successfully matches UIDAI central registry server.
            </p>
          </div>
        </div>
      </div>

      {/* Selfie Liveness Match */}
      <SelfieCameraPanel activeApp={activeApp} />
    </div>
  );
}

function SelfieCameraPanel({ activeApp }: { activeApp: any }) {
  const [kycStream, setKycStream] = useState<MediaStream | null>(null);
  const [isKycCameraActive, setIsKycCameraActive] = useState(false);
  const [kycCameraError, setKycCameraError] = useState(false);
  const [kycProgress, setKycProgress] = useState(0);
  const [kycStatus, setKycStatus] = useState("Camera offline");
  const [capturedKycFrame, setCapturedKycFrame] = useState<string | null>(null);
  const [facialMatch, setFacialMatch] = useState<string | null>(null);
  
  const kycVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (kycStream) {
        kycStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [kycStream]);

  const startKycCamera = async () => {
    setIsKycCameraActive(true);
    setKycCameraError(false);
    setCapturedKycFrame(null);
    setFacialMatch(null);
    setKycProgress(0);
    setKycStatus("Connecting to FIDO2 Secure Camera Hub...");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("KYC Camera API not available in this context.");
      setKycCameraError(true);
      setKycStatus("HTTP IP BLOCKED BY BROWSER");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 300, height: 300 }
      });
      setKycStream(stream);
      setKycStatus("Live camera active. Align face...");
      setTimeout(() => {
        if (kycVideoRef.current) {
          kycVideoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      console.error("KYC Camera access error:", err);
      setKycCameraError(true);
      setKycStatus("Permission denied");
    }
  };

  const captureKycFace = () => {
    if (kycVideoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(kycVideoRef.current, 0, 0, 160, 160);
        const base64Img = canvas.toDataURL("image/jpeg", 0.7);
        setCapturedKycFrame(base64Img);
      }
    }
    
    // Stop stream
    if (kycStream) {
      kycStream.getTracks().forEach(track => track.stop());
      setKycStream(null);
    }
    setIsKycCameraActive(false);

    // Dynamic verification simulation
    setKycProgress(5);
    setKycStatus("Matching landmarks with Aadhaar profile...");
    
    let current = 5;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setKycProgress(100);
        setKycStatus("Biometric Match Certified.");
        setFacialMatch("99.2% Match (Highly Confirmed)");
      } else {
        setKycProgress(current);
        if (current < 35) {
          setKycStatus("Analyzing structural nasal bridge angle...");
        } else if (current < 70) {
          setKycStatus("Checking face thermal flow & liveness...");
        } else {
          setKycStatus("Comparing frame data against Aadhaar chip XML...");
        }
      }
    }, 250);
  };

  return (
    <div className="glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between min-h-[300px]">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
          Selfie Liveness Verification
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-center relative">
            <div className="relative w-28 h-28 rounded-full border-2 border-[#2F8E7F]/40 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_20px_rgba(0,131,108,0.2)]">
              {isKycCameraActive ? (
                <video
                  ref={kycVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : capturedKycFrame ? (
                <img
                  src={capturedKycFrame}
                  alt="Captured Selfie"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-b from-[#2F8E7F]/5 to-[#2F8E7F]/20">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#00FF9D]/60 animate-breath">
                    <path
                      d="M50 15 C30 15 25 35 25 55 C25 75 35 85 50 85 C65 85 75 75 75 55 C75 35 70 15 50 15 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="40" cy="48" r="4" fill="currentColor" />
                    <circle cx="60" cy="48" r="4" fill="currentColor" />
                    <path d="M42 62 Q50 70 58 62" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* HUD Scan Line for Camera Feed */}
            {isKycCameraActive && (
              <div className="absolute top-0 bottom-0 left-0 right-0 w-28 h-28 mx-auto rounded-full pointer-events-none border border-[#00FF9D]/30 overflow-hidden">
                <div className="w-full h-0.5 bg-[#00FF9D]/75 shadow-[0_0_8px_#00FF9D] absolute top-0 animate-[scan_2s_linear_infinite]" />
              </div>
            )}
          </div>

          <div className="text-center font-mono text-[9px]">
            {isKycCameraActive ? (
              <span className="text-[#00FF9D] animate-pulse block">{kycStatus}</span>
            ) : capturedKycFrame && kycProgress < 100 ? (
              <div className="space-y-1">
                <span className="text-[#DF955B] block">{kycStatus}</span>
                <div className="w-24 mx-auto h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="bg-[#DF955B] h-full" style={{ width: `${kycProgress}%` }} />
                </div>
              </div>
            ) : facialMatch ? (
              <div className="space-y-0.5">
                <span className="text-[10px] text-mutedText uppercase tracking-wider block">Facial Match Confidence</span>
                <span className="text-sm font-black text-[#00FF9D]">{facialMatch}</span>
              </div>
            ) : (
              <span className="text-white/40 block">Live identity comparison offline.</span>
            )}
          </div>

          {kycCameraError && (
            <div className="p-2 border border-critical/20 bg-critical/5 rounded-xl text-[8.5px] font-mono text-critical leading-normal">
              ⚠️ Camera API blocked by browser (requires HTTPS/localhost). 
              To test on this IP, enable <b>unsafely-treat-insecure-origin-as-secure</b> in chrome://flags!
            </div>
          )}

          <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1.5 text-[9px] font-mono text-mutedText">
            <div className="flex justify-between">
              <span>Liveness Audit:</span>
              <span className={facialMatch ? "text-success font-bold" : "text-white/40"}>
                {facialMatch ? "PASSED" : "PENDING"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biometric Sync:</span>
              <span className={facialMatch ? "text-success font-bold" : "text-white/40"}>
                {facialMatch ? "VERIFIED" : "PENDING"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {isKycCameraActive ? (
          <button
            type="button"
            onClick={captureKycFace}
            className="w-full py-2 bg-[#00FF9D] hover:bg-[#00FF9D]/90 text-black text-xs font-bold uppercase rounded-xl transition-all shadow-[0_0_12px_rgba(0,255,157,0.3)]"
          >
            Capture & Verify Face
          </button>
        ) : (
          <button
            type="button"
            onClick={startKycCamera}
            className="w-full py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase border border-white/15 rounded-xl transition-all"
          >
            Start Camera Verification
          </button>
        )}

        <button
          type="button"
          onClick={() => alert("Digital KYC credentials locked onto Central Banking Ledger.")}
          disabled={!facialMatch}
          className={`w-full py-2 text-xs font-bold uppercase rounded-xl transition-all ${
            facialMatch 
              ? "bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white cursor-pointer shadow-[0_0_12px_rgba(0,131,108,0.2)]" 
              : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
          }`}
        >
          Sign & Certify Identity
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. MEETING ASSISTANT TAB
// ==========================================
export function MeetingAssistant() {
  const [opportunity, setOpportunity] = useState([
    { title: "Sajjad Ahmad - Savings Account", text: "Customer's reported income is ₹85,000/mo. Recommended: Suggest pre-approved IDBI Home Loan at 8.5% p.a. EMI starts ₹19,695." },
    { title: "Priya Sharma - Home Loan", text: "Customer qualifies for pre-approved IDBI signature Platinum Credit Card. Zero joining fee. Add to loan packaging." }
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Opportunity recommendations list */}
      <div className="lg:col-span-2 glass-panel p-5 bg-[#0a0a0a]/80 space-y-4">
        <div className="border-b border-white/5 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#2F8E7F]" />
            AI Cross-Sell Engine
          </h2>
          <p className="text-[10px] text-mutedText mt-0.5">
            Real-time relationship intelligence showing cross-sell proposals for active queue customers.
          </p>
        </div>

        <div className="space-y-3.5">
          {opportunity.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#2F8E7F]/20 transition-all text-xs space-y-2">
              <div className="flex justify-between items-center font-bold text-white">
                <span>{item.title}</span>
                <span className="text-[#00FF9D] font-mono text-[9px] uppercase tracking-wider">High Match</span>
              </div>
              <p className="text-mutedText leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Branch copilot */}
      <div className="glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
            Officer AI Co-Pilot
          </h3>
          <p className="text-[10px] text-mutedText leading-relaxed">
            Finne OS branch co-pilot analyzes customer income, credit logs, and onboarding profiles during interviews to generate compliance-ready case summaries.
          </p>
        </div>
        <div className="pt-4 mt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => alert("Dispatched latest cross-sell logs to CRM dashboard.")}
            className="w-full py-2.5 bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-[0_0_12px_rgba(0,131,108,0.2)]"
          >
            Export Client Pitch Notes
          </button>
        </div>
      </div>
    </div>
  );
}
