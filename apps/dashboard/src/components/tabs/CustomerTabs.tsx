"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  TrendingUp, 
  DollarSign, 
  ChevronRight, 
  ArrowRight, 
  Send, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  Languages,
  PlusCircle,
  PiggyBank
} from "lucide-react";

// ==========================================
// 1. CUSTOMER OVERVIEW TAB
// ==========================================
export function CustomerOverview({ operator }: { operator: any }) {
  const categories = [
    { name: "Investments", amount: 45000, color: "bg-[#2F8E7F]", percentage: "45%" },
    { name: "Utilities", amount: 15000, color: "bg-[#DF955B]", percentage: "15%" },
    { name: "Healthcare", amount: 12000, color: "bg-info", percentage: "12%" },
    { name: "Food & Shopping", amount: 18000, color: "bg-warning", percentage: "18%" },
    { name: "Travel", amount: 10000, color: "bg-critical", percentage: "10%" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card-gold p-6 bg-gradient-to-r from-[#2F8E7F]/10 via-transparent to-transparent border-[#2F8E7F]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Welcome to Finne OS Portal, <span className="text-[#DF955B] font-black">{operator?.fullName || "Valued Client"}</span>
            <Sparkles className="h-4 w-4 text-[#DF955B] animate-pulse" />
          </h2>
          <p className="text-xs text-mutedText mt-1">
            Your secure AI-assisted banking platform. All customer decisions are protected by Finne Secure Shield.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#2F8E7F]/20 border border-[#2F8E7F]/40 text-[#00FF9D] text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
            IDBI Savings Tier 1
          </span>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Health Score */}
        <div className="glass-panel p-5 bg-[#0a0a0a]/80 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs text-mutedText uppercase tracking-wider">
            <span>Financial Health Score</span>
            <Heart className="h-4 w-4 text-[#DF955B]" />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#2F8E7F" strokeWidth="3" strokeDasharray="80 100" />
              </svg>
              <span className="absolute text-sm font-black text-white">780</span>
            </div>
            <div>
              <span className="text-success text-xs font-bold uppercase tracking-wider block">Excellent Posture</span>
              <span className="text-[10px] text-mutedText mt-0.5 block">Top 12% in IDBI Branch</span>
            </div>
          </div>
        </div>

        {/* Card 2: Savings balance */}
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <div className="flex justify-between items-center text-xs text-mutedText uppercase tracking-wider">
            <span>Active Savings Accounts</span>
            <PiggyBank className="h-4 w-4 text-[#2F8E7F]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white">₹1,42,830.40</span>
            <span className="text-[9px] text-[#00FF9D] font-mono block mt-1.5 uppercase">
              ▲ +4.2% Monthly Interest Yield
            </span>
          </div>
        </div>

        {/* Card 3: Loans balance */}
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <div className="flex justify-between items-center text-xs text-mutedText uppercase tracking-wider">
            <span>Current Outstanding Loan</span>
            <TrendingUp className="h-4 w-4 text-[#DF955B]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white">₹12,50,000.00</span>
            <span className="text-[9px] text-warning font-mono block mt-1.5 uppercase">
              Home Loan (IDBI H-Flex Tier-2)
            </span>
          </div>
        </div>
      </div>

      {/* Expense categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 bg-[#0a0a0a]/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
            Monthly Expense Categorization
          </h3>
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-mutedText">
                  <span>{cat.name}</span>
                  <span className="text-white font-bold">₹{cat.amount.toLocaleString("en-IN")} ({cat.percentage})</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: cat.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
              AI Wellness Alerts
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/20 text-xs">
                <CheckCircle className="h-4 w-4 text-[#00FF9D] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Savings Target Achieved</span>
                  <p className="text-mutedText mt-0.5 text-[10px]">
                    You successfully saved ₹10,000 this month. Recommended: Move ₹8,000 to high-yield FD at 7.25% APR.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#DF955B]/5 border border-[#DF955B]/20 text-xs">
                <AlertTriangle className="h-4 w-4 text-[#DF955B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Home Loan EMI Approaching</span>
                  <p className="text-mutedText mt-0.5 text-[10px]">
                    EMI payment of ₹18,500 due on 10th July. Balance check passes. Autopay active.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 text-[9px] text-mutedText font-mono uppercase tracking-wider text-right">
            Finne Telemetry Status: Secure
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. SMART FORM ONBOARDING TAB
// ==========================================
export function SmartFormAssistant() {
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState("English");
  const [selectedService, setSelectedService] = useState("Savings Account");
  const [aiFilling, setAiFilling] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "",
    monthlyIncome: "",
    occupation: "",
    pincode: "",
    aadhaarNo: ""
  });

  const languages = [
    { name: "English", local: "English" },
    { name: "Hindi", local: "हिन्दी" },
    { name: "Marathi", local: "मराठी" },
    { name: "Kannada", local: "ಕನ್ನಡ" },
    { name: "Tamil", local: "தமிழ்" },
    { name: "Telugu", local: "తెలుగు" },
    { name: "Bengali", local: "বাংলা" },
    { name: "Gujarati", local: "ગુજરાતી" }
  ];

  const services = [
    "Savings Account",
    "Current Account",
    "Home Loan Application",
    "Education Loan Application",
    "Personal Loan",
    "KYC Document Update",
    "Fixed Deposit Opening"
  ];

  const triggerAiAutofill = () => {
    setAiFilling(true);
    let charIdx = 0;
    const mockFullData = {
      fullName: selectedLang === "Hindi" ? "सज्जाद अहमद" : selectedLang === "Marathi" ? "सज्जाद अहमद" : "Sajjad Ahmad",
      monthlyIncome: "85000",
      occupation: selectedLang === "Hindi" ? "सॉफ्टवेयर इंजीनियर" : "Software Engineer",
      pincode: "400001",
      aadhaarNo: "4820 9012 3341"
    };

    const interval = setInterval(() => {
      setFormData(prev => {
        const next = { ...prev };
        if (charIdx < 1) next.fullName = mockFullData.fullName;
        else if (charIdx < 2) next.monthlyIncome = mockFullData.monthlyIncome;
        else if (charIdx < 3) next.occupation = mockFullData.occupation;
        else if (charIdx < 4) next.pincode = mockFullData.pincode;
        else if (charIdx < 5) {
          next.aadhaarNo = mockFullData.aadhaarNo;
          clearInterval(interval);
          setAiFilling(false);
        }
        charIdx++;
        return next;
      });
    }, 400);
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Onboarding form wrapper */}
      <div className="lg:col-span-2 glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between min-h-[460px]">
        <div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#2F8E7F]" />
              Smart Banking Form Assistant
            </h2>
            <span className="text-[10px] font-mono text-gold-secondary bg-[#2F8E7F]/10 border border-[#2F8E7F]/30 px-2 py-0.5 rounded uppercase">
              Step {step} of 4
            </span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-white block">Step 1: Select Form Language</span>
              <p className="text-[10px] text-mutedText">
                Finne OS supports 8 regional Indian languages. Conversational AI translation will automatically convert entries into English for dashboard audit controls.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.name}
                    type="button"
                    onClick={() => setSelectedLang(lang.name)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedLang === lang.name
                        ? "bg-[#2F8E7F]/10 border-[#2F8E7F]/40 text-white shadow-[0_0_10px_rgba(0,131,108,0.2)]"
                        : "bg-transparent border-white/5 text-mutedText hover:text-white hover:bg-white/[0.01]"
                    }`}
                  >
                    <span className="text-xs font-bold">{lang.local}</span>
                    <span className="text-[8px] font-mono uppercase opacity-55">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-white block">Step 2: Select Banking Service</span>
              <p className="text-[10px] text-mutedText">
                Choose the savings product or credit instrument you wish to apply for.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {services.map((srv) => (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      selectedService === srv
                        ? "bg-[#2F8E7F]/10 border-[#2F8E7F]/40 text-white shadow-[0_0_8px_rgba(0,131,108,0.15)]"
                        : "bg-transparent border-white/5 text-mutedText hover:text-white hover:bg-white/[0.01]"
                    }`}
                  >
                    <span>{srv}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white block">Step 3: Conversational Form Filling ({selectedLang})</span>
                  <p className="text-[10px] text-mutedText mt-0.5">
                    Speak or type details. The AI parses the conversation to populate the banking fields.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={aiFilling}
                  onClick={triggerAiAutofill}
                  className="px-3.5 py-1.5 bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,131,108,0.2)] disabled:opacity-50"
                >
                  <Bot className="h-3.5 w-3.5" />
                  {aiFilling ? "Filling..." : "Simulate Conversational Autofill"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 focus:border-[#2F8E7F] focus:outline-none rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">Monthly Income (INR)</label>
                  <input
                    type="text"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 focus:border-[#2F8E7F] focus:outline-none rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Engineer"
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 focus:border-[#2F8E7F] focus:outline-none rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 focus:border-[#2F8E7F] focus:outline-none rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-mutedText block">Aadhaar Number</label>
                  <input
                    type="text"
                    value={formData.aadhaarNo}
                    onChange={(e) => setFormData({ ...formData, aadhaarNo: e.target.value })}
                    placeholder="0000 0000 0000"
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 focus:border-[#2F8E7F] focus:outline-none rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-white block">Step 4: Smart Form Review & Submission</span>
              <p className="text-[10px] text-mutedText">
                Verification checklist complete. AI has validated PIN, Aadhaar structure, and cross-checked credit flags.
              </p>

              <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-xs space-y-2 mt-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-mutedText">Language Selected:</span>
                  <span className="text-white font-bold">{selectedLang}</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-mutedText">Banking Service:</span>
                  <span className="text-white font-bold">{selectedService}</span>
                </div>
                <div className="flex justify-between items-center font-mono border-t border-white/5 pt-2">
                  <span className="text-mutedText">Customer Name:</span>
                  <span className="text-[#00FF9D] font-bold">{formData.fullName || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-mutedText">Staged ID:</span>
                  <span className="text-white font-bold">{formData.aadhaarNo ? `Aadhaar ID Encrypted` : "Missing"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#2F8E7F]/5 border border-[#2F8E7F]/20 rounded-xl text-[10px] text-white">
                <CheckCircle className="h-4 w-4 text-[#00FF9D] flex-shrink-0" />
                <span>All parameters checked. Fully ready for Human Officer clearance validation.</span>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
          <button
            type="button"
            disabled={step === 1}
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/[0.02] disabled:opacity-50 transition-all"
          >
            Previous Step
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_10px_rgba(0,131,108,0.2)]"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                alert("Smart form submitted successfully!");
                setStep(1);
                setFormData({ fullName: "", monthlyIncome: "", occupation: "", pincode: "", aadhaarNo: "" });
              }}
              className="px-5 py-2.5 bg-success hover:bg-success/90 text-black text-xs font-black uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)]"
            >
              Submit to Bank
            </button>
          )}
        </div>
      </div>

      {/* Translation & audit telemetry pane */}
      <div className="glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
            AI Translation Telemetry
          </h3>
          <p className="text-[10px] text-mutedText leading-relaxed">
            Finne OS translation core handles regional submissions and displays them uniformly in English on the dashboard for officers and compliance audits.
          </p>

          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-mutedText uppercase">Customer Input ({selectedLang})</span>
              <div className="p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-[11px] text-white">
                {formData.fullName ? formData.fullName : "Awaiting entry..."}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-[#DF955B] uppercase font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-pulse" />
                English Translation Core
              </span>
              <div className="p-3 bg-[#2F8E7F]/5 border border-[#2F8E7F]/20 rounded-xl font-mono text-[11px] text-[#00FF9D]">
                {formData.fullName 
                  ? (selectedLang === "Hindi" || selectedLang === "Marathi" ? "Sajjad Ahmad" : formData.fullName)
                  : "Awaiting translation trigger..."}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-mutedText font-mono space-y-1.5 mt-4">
          <div className="flex justify-between">
            <span>Finne OS Shield Posture:</span>
            <span className="text-[#00FF9D] font-bold">SECURE</span>
          </div>
          <div className="flex justify-between">
            <span>SQL Policy Rules:</span>
            <span className="text-white">AML_COMPLIANT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. LOAN DISCOVERY ADVISOR TAB
// ==========================================
export function LoanAdvisor() {
  const [loanAmount, setLoanAmount] = useState(1500000);
  const [tenure, setTenure] = useState(15); // years
  const [interestRate, setInterestRate] = useState(8.5); // percentage

  // Calculate EMI
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = tenure * 12;
  const emiVal = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const calculatedEmi = isNaN(emiVal) ? 0 : Math.round(emiVal);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* EMI Sliders */}
      <div className="lg:col-span-2 glass-panel p-5 bg-[#0a0a0a]/80 space-y-6">
        <div className="border-b border-white/5 pb-2 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Smart Loan EMI Advisor
          </h2>
          <p className="text-[10px] text-mutedText mt-0.5">
            Configure terms to view eligibility scores and estimated monthly installments.
          </p>
        </div>

        <div className="space-y-4">
          {/* Slider 1: Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-mutedText">Loan Amount</span>
              <span className="text-white font-mono font-bold">₹{loanAmount.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={5000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#2F8E7F]"
            />
            <div className="flex justify-between text-[9px] text-white/30 font-mono">
              <span>₹5 Lakh</span>
              <span>₹50 Lakh</span>
            </div>
          </div>

          {/* Slider 2: Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-mutedText">Tenure (Years)</span>
              <span className="text-white font-mono font-bold">{tenure} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-[#2F8E7F]"
            />
            <div className="flex justify-between text-[9px] text-white/30 font-mono">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Slider 3: Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-mutedText">Interest Rate (p.a.)</span>
              <span className="text-white font-mono font-bold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={6.5}
              max={15.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#2F8E7F]"
            />
            <div className="flex justify-between text-[9px] text-white/30 font-mono">
              <span>6.5%</span>
              <span>15.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* EMI Score panel */}
      <div className="glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between min-h-[300px]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
            Advisory Report
          </h3>
          <div className="space-y-4">
            <div className="text-center py-4 bg-white/5 border border-white/5 rounded-2xl">
              <span className="text-[10px] text-mutedText uppercase tracking-wider block font-mono">Estimated Monthly EMI</span>
              <span className="text-3xl font-black text-[#00FF9D] mt-1 block">₹{calculatedEmi.toLocaleString("en-IN")}</span>
            </div>

            <div className="p-3 bg-[#2F8E7F]/5 border border-[#2F8E7F]/25 rounded-xl space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-mutedText">Eligibility Index:</span>
                <span className="text-[#00FF9D] font-bold font-mono">92% (High)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedText">Total Interest Payable:</span>
                <span className="text-white font-mono">₹{(calculatedEmi * totalMonths - loanAmount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Pre-Approval request registered! Loan Advisor agent has queued the application.")}
          className="w-full py-3 bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-[0_0_12px_rgba(0,131,108,0.2)] mt-4"
        >
          Request Pre-Approval
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. AI FINANCIAL COACH TAB
// ==========================================
export function FinancialCoach() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I am your Finne OS Financial Coach, secured by Finne Secure Shield. How can I help you manage your funds or explore loan options today?" }
  ]);
  const [inputText, setInputText] = useState("");

  const questions = [
    "Can I afford a home loan?",
    "How can I save ₹10,000 monthly?",
    "What FD yields are suitable for me?"
  ];

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate AI typing response
    setTimeout(() => {
      let coachResponse = "Let me analyze your transactions. Based on your current income posture (₹85,000) and outstanding loans, you have a safe debt clearance margins of ₹25,000 monthly.";
      if (textToSend.toLowerCase().includes("home")) {
        coachResponse = "For a Home Loan of ₹20 Lakh at 8.5% for 15 years, the EMI is roughly ₹19,695. Your income profile of ₹85,000 meets the 50% FOIR (Fixed Income Obligation Ratio) standard. It is fully affordable!";
      } else if (textToSend.toLowerCase().includes("save")) {
        coachResponse = "To save ₹10,000, I recommend setting up an IDBI Smart Autopay on your pay-day. Move ₹5,000 into a Recurring Deposit (7.2% yield) and ₹5,000 into dynamic mutual funds.";
      } else if (textToSend.toLowerCase().includes("fd")) {
        coachResponse = "IDBI offers premium FD rates of 7.25% for 444-day tenures. This matches your savings profile perfectly as your goal is mid-term. I can set this up inside the portal.";
      }
      setMessages(prev => [...prev, { role: "assistant", text: coachResponse }]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat pane */}
      <div className="lg:col-span-2 glass-panel p-5 bg-[#0a0a0a]/80 flex flex-col justify-between h-[450px]">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#2F8E7F]/10 border border-[#2F8E7F]/30 flex items-center justify-center">
            <Bot className="h-4.5 w-4.5 text-[#2F8E7F]" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">AI Financial Coach</span>
            <span className="text-[8px] font-mono text-[#00FF9D] uppercase tracking-wider block">Finne Sandbox Active</span>
          </div>
        </div>

        {/* Message logs */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 my-2 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-2.5 text-xs ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                msg.role === "user" ? "bg-[#DF955B] text-black" : "bg-[#2F8E7F] text-white"
              }`}>
                {msg.role === "user" ? "U" : "C"}
              </div>
              <div className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                msg.role === "user" 
                  ? "bg-[#DF955B]/15 border border-[#DF955B]/25 text-white" 
                  : "bg-white/5 border border-white/5 text-white/90"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Text input */}
        <div className="flex gap-2 border-t border-white/5 pt-3 mt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your wellness query..."
            className="flex-1 px-4 py-2.5 bg-black/60 border border-white/10 focus:border-[#2F8E7F] focus:outline-none rounded-xl text-xs text-white placeholder-white/20"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="w-10 h-10 bg-[#2F8E7F] hover:bg-[#2F8E7F]/90 text-white rounded-xl flex items-center justify-center transition-all shadow-[0_0_8px_rgba(0,131,108,0.2)]"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Suggested prompts pane */}
      <div className="glass-panel p-5 bg-[#0a0a0a]/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 mb-4">
          Suggested Prompts
        </h3>
        <p className="text-[10px] text-mutedText leading-relaxed mb-4">
          Click any prompt below to chat with the AI financial coach:
        </p>
        <div className="space-y-2.5">
          {questions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q)}
              className="w-full p-3 rounded-xl border border-white/5 hover:border-[#2F8E7F]/40 text-left text-xs text-mutedText hover:text-white bg-transparent hover:bg-white/[0.01] transition-all flex items-center justify-between"
            >
              <span>{q}</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-40" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
