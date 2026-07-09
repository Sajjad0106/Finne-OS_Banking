"use client";

import React from "react";
import { 
  BarChart, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  DollarSign
} from "lucide-react";

// ==========================================
// 1. BRANCH ANALYTICS TAB
// ==========================================
export function BranchAnalytics({ operator }: { operator?: any }) {
  const metrics = [
    { label: "Total Branch Deposits", value: "₹4.82 Cr", change: "+12.4% MoM", color: "text-[#00FF9D]" },
    { label: "Active Outstanding Loans", value: "₹2.15 Cr", change: "+8.1% MoM", color: "text-[#DF955B]" },
    { label: "Onboarded Retail Clients", value: "1,482", change: "+45 this week", color: "text-info" },
    { label: "KYC Compliance Rate", value: "99.8%", change: "Regulatory Standard", color: "text-success" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card-gold p-6 bg-gradient-to-r from-[#2F8E7F]/10 via-transparent to-transparent border-[#2F8E7F]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10 overflow-hidden flex-shrink-0">
            {operator?.faceBiometrics ? (
              <img src={operator.faceBiometrics} alt="Profile Photo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl text-gold font-bold">{operator?.fullName?.[0] || "M"}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Manager Control Center, <span className="text-[#DF955B] font-black">{operator?.fullName || "Branch Manager"}</span>
              <Sparkles className="h-4 w-4 text-[#DF955B] animate-pulse" />
            </h2>
            <p className="text-xs text-mutedText mt-1">
              Finne OS Branch Operations Platform. All audits and transaction approvals are cryptographically signed.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#DF955B]/25 border border-[#DF955B]/40 text-[#DF955B] text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-bold">
            CISO Clearance Level 1
          </span>
        </div>
      </div>
      {/* Branch overview metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((item, i) => (
          <div key={i} className="glass-panel p-5 bg-[#0a0a0a]/80">
            <span className="text-[10px] text-mutedText uppercase tracking-wider block font-mono">
              {item.label}
            </span>
            <span className={`text-2xl font-black mt-2 block ${item.color}`}>
              {item.value}
            </span>
            <span className="text-[9px] text-mutedText font-mono block mt-1.5 uppercase">
              {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Analytics breakdown columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Swarm Status */}
        <div className="lg:col-span-2 glass-panel p-5 bg-[#0a0a0a]/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">
            Branch Operations Performance
          </h3>
          <p className="text-[10px] text-mutedText">
            Finne OS monitors real-time branch performance metrics and flags credit imbalances.
          </p>

          <div className="space-y-4 mt-2">
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-white block">Regional Loan Disbursements (Q2)</span>
              <div className="h-4 bg-gradient-to-r from-[#2F8E7F] to-[#2F8E7F]/40 rounded-lg flex items-center px-3 text-[10px] font-mono text-white justify-between w-full">
                <span>Home Loans</span>
                <span>₹1.20 Crore (56%)</span>
              </div>
              <div className="h-4 bg-gradient-to-r from-[#DF955B] to-[#DF955B]/40 rounded-lg flex items-center px-3 text-[10px] font-mono text-white justify-between w-[80%]">
                <span>Personal Loans</span>
                <span>₹65 Lakh (30%)</span>
              </div>
              <div className="h-4 bg-gradient-to-r from-info to-info/40 rounded-lg flex items-center px-3 text-[10px] font-mono text-white justify-between w-[35%]">
                <span>Gold Loans</span>
                <span>₹30 Lakh (14%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security SWAT compliance indicator */}
        <div className="glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
              Finne Swarm Sentinel Posture
            </h3>
            <div className="space-y-3 font-mono text-[9px] text-mutedText">
              <div className="flex justify-between items-center p-2 bg-success/5 border border-success/20 rounded-lg">
                <span>Explainable AI Engine:</span>
                <span className="text-[#00FF9D] font-bold uppercase">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-success/5 border border-success/20 rounded-lg">
                <span>Fraud Swarm Node:</span>
                <span className="text-[#00FF9D] font-bold uppercase">SYNCED</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[9px] text-mutedText leading-relaxed">
            All customer credentials are automatically locked on the ledger, satisfying RBI compliance regulations.
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CHURN RISK & RETENTION TAB
// ==========================================
export function ChurnAnalytics({ operator }: { operator?: any }) {
  const churnList = [
    { name: "Praveen Mehta", risk: "88% Risk", status: "Dormant (45 Days)", reason: "Zero transactions post-term FD payout", suggestion: "Recommend Special FD rate: 7.5% for 444 days" },
    { name: "Meera Nair", risk: "72% Risk", status: "Low Activity", reason: "Salary payout redirected to competitive bank", suggestion: "Offer lifetime free Signature Credit Card upgrade" }
  ];

  return (
    <div className="glass-panel p-5 bg-[#0a0a0a]/80 space-y-4">
      <div className="border-b border-white/5 pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Customer Retention & Churn Risk
        </h2>
        <p className="text-[10px] text-mutedText mt-0.5">
          AI retention engine flags dormant client profiles and recommends targeted outreach solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {churnList.map((client, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#DF955B]/25 transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-white text-xs block">{client.name}</span>
                <span className="text-[9px] text-mutedText block font-mono mt-0.5">{client.status}</span>
              </div>
              <span className="bg-critical/15 border border-critical/30 text-critical text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {client.risk}
              </span>
            </div>

            <div className="space-y-1.5 text-[10px] leading-relaxed">
              <p className="text-mutedText">
                <span className="font-bold text-white">Churn Indicator:</span> {client.reason}
              </p>
              <div className="p-2.5 bg-[#2F8E7F]/5 border border-[#2F8E7F]/25 rounded-lg text-[#00FF9D] font-mono flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#DF955B] flex-shrink-0 mt-0.5 animate-pulse" />
                <span>**AI Advisor Suggestion**: {client.suggestion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
