"use client";

import React, { useState, useEffect } from "react";
import { useSecurityStore } from "../store/useSecurityStore";
import Splash from "../components/Splash";
import Login from "../components/Login";
import IdbiLogo from "../components/IdbiLogo";
import { supabase } from "../lib/supabaseClient";
import {
  LayoutDashboard,
  Cpu,
  ShieldAlert,
  Sliders,
  Inbox,
  Dna,
  Lock,
  FileCheck,
  Blocks,
  Terminal,
  User,
  Bell
} from "lucide-react";

// Tabs
import OverviewTab from "../components/tabs/OverviewTab";
import RegistryTab from "../components/tabs/RegistryTab";
import ThreatCenterTab from "../components/tabs/ThreatCenterTab";
import PolicyEngineTab from "../components/tabs/PolicyEngineTab";
import ApprovalsTab from "../components/tabs/ApprovalsTab";
import BehavioralDNATab from "../components/tabs/BehavioralDNATab";
import HoneypotsTab from "../components/tabs/HoneypotsTab";
import ComplianceTab from "../components/tabs/ComplianceTab";
import IntegrationsTab from "../components/tabs/IntegrationsTab";
import AuditLogsTab from "../components/tabs/AuditLogsTab";

// Banking Persona Tabs
import { CustomerOverview, SmartFormAssistant, LoanAdvisor, FinancialCoach } from "../components/tabs/CustomerTabs";
import { EmployeeOverview, OnboardingQueue, DocumentKyc, MeetingAssistant } from "../components/tabs/EmployeeTabs";
import { BranchAnalytics, ChurnAnalytics } from "../components/tabs/ManagerTabs";

const renderSidebarIcon = (id: string, isActive: boolean) => {
  const cls = `h-4 w-4 ${isActive ? "text-gold" : "text-mutedText"}`;
  if (id.includes("overview")) return <LayoutDashboard className={cls} />;
  if (id.includes("form-assistant") || id.includes("onboarding-queue")) return <Inbox className={cls} />;
  if (id.includes("loan-advisor") || id.includes("policy-engine")) return <Sliders className={cls} />;
  if (id.includes("financial-coach") || id.includes("meeting-assistant") || id.includes("churn-analytics") || id.includes("behavioral-dna")) return <Dna className={cls} />;
  if (id.includes("document-kyc") || id.includes("compliance")) return <FileCheck className={cls} />;
  
  switch (id) {
    case "registry": return <Cpu className={cls} />;
    case "threat-center": return <ShieldAlert className={cls} />;
    case "honeypots": return <Lock className={cls} />;
    case "integrations": return <Blocks className={cls} />;
    case "audit-logs": return <Terminal className={cls} />;
    default: return <LayoutDashboard className={cls} />;
  }
};

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeKycApp, setActiveKycApp] = useState<any>(null);
  
  const { 
    activeTab, 
    setActiveTab, 
    globalRiskStatus, 
    approvals,
    threats,
    integrateAgentEvent,
    fetchInitialData,
    operator
  } = useSecurityStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    useSecurityStore.getState().setOperator(null);
    setIsLoggedIn(false);
    setShowSplash(true);
  };

  // Restore active Supabase Auth session on page mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const userMeta = session.user.user_metadata || {};
          
          let orgId = userMeta.org_id;
          let orgName = userMeta.orgName;
          
          // Retrieve pending persona choice if redirecting back from Google login
          let pendingPersona: string | null = null;
          if (typeof window !== "undefined") {
            pendingPersona = localStorage.getItem("finne_oauth_persona");
            if (pendingPersona) {
              localStorage.removeItem("finne_oauth_persona");
            }
          }

          // Fetch profiles row from database to get official role mapping
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name, phone, username, face_biometrics")
            .eq("id", session.user.id)
            .maybeSingle();

          let activeRole = profile?.role || userMeta.role || "SAVINGS_ACCOUNT";

          // If logging in via Google OAuth, apply the persona role override
          if (pendingPersona) {
            let newRole = "SAVINGS_ACCOUNT";
            let newOrgName = "IDBI Customers";
            if (pendingPersona === "EMPLOYEE") {
              newRole = "ONBOARDING_AGENT";
              newOrgName = "IDBI Bank Staff";
            } else if (pendingPersona === "MANAGER") {
              newRole = "BRANCH_MANAGER";
              newOrgName = "IDBI Bank Staff";
            }

            // Find organization matching newOrgName
            let targetOrgId = orgId;
            try {
              const { data: orgData } = await supabase
                .from("organizations")
                .select("id")
                .eq("name", newOrgName)
                .maybeSingle();
              if (orgData) {
                targetOrgId = orgData.id;
              }
            } catch (err) {
              console.error("Error retrieving org details for OAuth:", err);
            }

            // Update database profile
            try {
              await supabase
                .from("profiles")
                .update({ 
                  role: newRole, 
                  org_id: targetOrgId 
                })
                .eq("id", session.user.id);
              
              activeRole = newRole;
              orgId = targetOrgId;
              orgName = newOrgName;
            } catch (upErr) {
              console.error("Failed to update profile role after Google OAuth:", upErr);
            }
          }

          let derivedPersona: "CUSTOMER" | "EMPLOYEE" | "MANAGER" = "CUSTOMER";
          if (
            activeRole === "ONBOARDING_AGENT" || 
            activeRole === "LOAN_OFFICER" || 
            activeRole === "AUDIT_COMPLIANCE" || 
            activeRole === "EMPLOYEE"
          ) {
            derivedPersona = "EMPLOYEE";
          } else if (
            activeRole === "BRANCH_MANAGER" || 
            activeRole === "SECURITY_CISO" || 
            activeRole === "MANAGER"
          ) {
            derivedPersona = "MANAGER";
          }

          const opData: any = {
            id: session.user.id,
            fullName: profile?.full_name || userMeta.fullName || userMeta.full_name || session.user.email?.split("@")[0] || "Google Operator",
            email: session.user.email || "",
            phone: profile?.phone || userMeta.phone || "",
            username: profile?.username || userMeta.username || session.user.email?.split("@")[0] || "google_user",
            role: activeRole,
            persona: derivedPersona,
            orgId: orgId || "00000000-0000-0000-0000-000000000000",
            orgName: orgName || "Default Demo Org",
            faceBiometrics: profile?.face_biometrics || userMeta.face_biometrics || ""
          };

          const defaultTab = derivedPersona === "CUSTOMER" 
            ? "customer-overview" 
            : derivedPersona === "EMPLOYEE" 
            ? "employee-overview" 
            : "manager-overview";
          useSecurityStore.getState().setActiveTab(defaultTab);
          useSecurityStore.getState().setOperator(opData);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Session restoration error:", err);
      }
    };
    restoreSession();
  }, []);

  // Redirect to corresponding portal when operator logs in
  useEffect(() => {
    if (isLoggedIn && operator) {
      const activeRole = (operator as any).role || "";
      let derivedPersona = (operator as any).persona;
      
      if (!derivedPersona) {
        if (
          activeRole === "ONBOARDING_AGENT" || 
          activeRole === "LOAN_OFFICER" || 
          activeRole === "AUDIT_COMPLIANCE" || 
          activeRole === "EMPLOYEE" || 
          activeRole.startsWith("SOC_")
        ) {
          derivedPersona = "EMPLOYEE";
        } else if (
          activeRole === "BRANCH_MANAGER" || 
          activeRole === "SECURITY_CISO" || 
          activeRole === "MANAGER"
        ) {
          derivedPersona = "MANAGER";
        } else {
          derivedPersona = "CUSTOMER";
        }
      }

      if (derivedPersona === "CUSTOMER") {
        setActiveTab("customer-overview");
      } else if (derivedPersona === "EMPLOYEE") {
        setActiveTab("employee-overview");
      } else {
        setActiveTab("manager-overview");
      }
    }
  }, [isLoggedIn, operator, setActiveTab]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchInitialData();
    }
  }, [isLoggedIn, fetchInitialData]);

  useEffect(() => {
    if (!isLoggedIn) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const connect = async () => {
      // Build dynamic WebSocket URL depending on dev/prod environments
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const wsHost = isLocal ? `${window.location.hostname}:8000` : "finne-os.onrender.com";
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      
      let token = "demo_bypass_token";
      let orgId = "00000000-0000-0000-0000-000000000000";
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          token = session.access_token;
          orgId = session.user?.user_metadata?.org_id || "00000000-0000-0000-0000-000000000000";
        }
      } catch (err) {
        console.error("Error fetching access token for WS:", err);
      }

      if (isCancelled) return;

      const orgQuery = orgId ? `?org_id=${encodeURIComponent(orgId)}` : "";
      const tokenQuery = `&token=${encodeURIComponent(token)}`;
      const wsUrl = `${protocol}//${wsHost}/ws/telemetry${orgQuery}${tokenQuery}`;
      
      console.log(`Connecting to Finne OS Telemetry WebSocket: ${wsUrl}`);
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (isCancelled) {
          socket?.close();
          return;
        }
        console.log("WebSocket Connection Staged successfully.");
        setWsConnected(true);
      };

      socket.onmessage = (event) => {
        if (isCancelled) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "AGENT_TELEMETRY" && payload.data) {
            integrateAgentEvent(payload.data);
          }
        } catch (e) {
          console.error("Error parsing telemetry packet:", e);
        }
      };

      socket.onclose = () => {
        if (isCancelled) return;
        console.log("Telemetry WebSocket disconnected. Reconnecting in 5s...");
        setWsConnected(false);
        reconnectTimer = setTimeout(connect, 5000);
      };

      socket.onerror = () => {
        if (isCancelled) return;
        console.warn("Telemetry WebSocket connection offline. Reconnecting...");
        socket?.close();
      };
    };

    connect();

    return () => {
      isCancelled = true;
      if (socket) socket.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [isLoggedIn, integrateAgentEvent]);


  const pendingApprovalsCount = approvals.filter(a => a.status === "Pending").length;
  const activeThreatsCount = threats.length;

  const sidebarItems = React.useMemo(() => {
    const persona = (operator as any)?.persona || "CUSTOMER";
    if (persona === "CUSTOMER") {
      return [
        { id: "customer-overview", label: "Overview", icon: "overview" },
        { id: "form-assistant", label: "Form Assistant", icon: "form-assistant" },
        { id: "loan-advisor", label: "Loan Advisor", icon: "loan-advisor" },
        { id: "financial-coach", label: "Financial Coach", icon: "financial-coach" }
      ];
    } else if (persona === "EMPLOYEE") {
      return [
        { id: "employee-overview", label: "Overview", icon: "overview" },
        { id: "onboarding-queue", label: "Onboarding Queue", icon: "onboarding-queue" },
        { id: "document-kyc", label: "Identity KYC Scan", icon: "document-kyc" },
        { id: "meeting-assistant", label: "Meeting Copilot", icon: "meeting-assistant" }
      ];
    } else {
      // MANAGER
      return [
        { id: "manager-overview", label: "Branch Analytics", icon: "overview" },
        { id: "churn-analytics", label: "Customer Churn", icon: "churn-analytics" }
      ];
    }
  }, [operator, activeThreatsCount, pendingApprovalsCount]);

  const getRiskStatusClass = () => {
    switch (globalRiskStatus) {
      case "Normal":
        return "bg-success/10 border-success/30 text-[#00FF9D] shadow-[0_0_10px_rgba(0,255,157,0.15)]";
      case "Elevated":
        return "bg-warning/10 border-warning/30 text-[#FFB020] shadow-[0_0_10px_rgba(255,176,32,0.15)]";
      case "Severe":
        return "bg-critical/10 border-critical/30 text-[#FF4D4D] shadow-[0_0_12px_rgba(255,77,77,0.2)] animate-pulse";
      case "Critical":
        return "bg-critical/20 border-critical/50 text-[#FF4D4D] font-bold border-2 shadow-[0_0_20px_rgba(255,77,77,0.4)] animate-bounce";
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      // Customer Portal Tabs
      case "customer-overview":
        return <CustomerOverview operator={operator} />;
      case "form-assistant":
        return <SmartFormAssistant />;
      case "loan-advisor":
        return <LoanAdvisor />;
      case "financial-coach":
        return <FinancialCoach />;

      // Employee Portal Tabs
      case "employee-overview":
        return <EmployeeOverview operator={operator} />;
      case "onboarding-queue":
        return <OnboardingQueue onViewKyc={(app) => {
          setActiveKycApp(app);
          setActiveTab("document-kyc");
        }} />;
      case "document-kyc":
        return <DocumentKyc activeApp={activeKycApp} />;
      case "meeting-assistant":
        return <MeetingAssistant />;

      // Manager Portal Tabs
      case "manager-overview":
        return <BranchAnalytics operator={operator} />;
      case "churn-analytics":
        return <ChurnAnalytics operator={operator} />;

      // Swarm / Control Plane Tabs
      case "overview":
        return <OverviewTab />;
      case "registry":
        return <RegistryTab />;
      case "threat-center":
        return <ThreatCenterTab />;
      case "policy-engine":
        return <PolicyEngineTab />;
      case "approvals":
        return <ApprovalsTab />;
      case "behavioral-dna":
        return <BehavioralDNATab />;
      case "honeypots":
        return <HoneypotsTab />;
      case "compliance":
        return <ComplianceTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "audit-logs":
        return <AuditLogsTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => {
      setIsLoggedIn(true);
      setShowSplash(true);
    }} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans relative">
      <div className="absolute inset-0 grid-mesh opacity-20 pointer-events-none" />

      {/* Floating financial/banking symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] z-0">
        <div className="absolute top-[10%] left-[5%] text-7xl font-bold animate-float">₹</div>
        <div className="absolute top-[40%] right-[10%] text-9xl font-bold animate-float-delayed">₹</div>
        <div className="absolute bottom-[20%] left-[15%] text-8xl font-bold animate-float">₹</div>
        <div className="absolute top-[20%] left-[45%] text-6xl font-bold animate-float-delayed">%</div>
        <div className="absolute bottom-[10%] right-[30%] text-7xl font-bold animate-float">%</div>
      </div>

      {/* LEFT SIDEBAR */}
      <aside
        className={`bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between transition-all duration-300 relative z-30 ${
          sidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
            {sidebarExpanded ? (
              <div className="flex items-center gap-2">
                <IdbiLogo size={24} />
                <span className="font-bold tracking-[0.12em] text-sm uppercase">
                  Finne<span className="text-[#DF955B]"> OS</span>
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <IdbiLogo size={24} />
              </div>
            )}
            
            {sidebarExpanded && (
              <button
                onClick={() => setSidebarExpanded(false)}
                className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:border-gold/50 flex items-center justify-center text-xs text-white/70 hover:bg-gold/10 transition-colors"
              >
                ◀
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-gold/5 border-gold/40 text-white shadow-[0_0_12px_rgba(47,142,127,0.15)]"
                      : "bg-transparent border-transparent text-mutedText hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  {renderSidebarIcon(item.icon, isActive)}
                  {sidebarExpanded && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                  {(item as any).badge !== undefined && (item as any).badge > 0 && sidebarExpanded && (
                    <span className="px-1.5 py-0.5 rounded-full bg-critical text-white text-[8px] font-bold tracking-normal animate-pulse">
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-white/5">
          {!sidebarExpanded ? (
            <button
              onClick={() => setSidebarExpanded(true)}
              className="w-full h-10 rounded-xl bg-white/5 border border-white/10 hover:border-gold/50 flex items-center justify-center text-xs hover:bg-gold/10 transition-colors"
            >
              ▶
            </button>
          ) : (
            <div className="flex items-center justify-between w-full px-2.5 py-1 gap-2">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 overflow-hidden bg-gold/10">
                  {(operator as any)?.faceBiometrics ? (
                    <img src={(operator as any).faceBiometrics} alt="Profile Photo" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-gold" />
                  )}
                </div>
                <div className="min-w-0">
                  <h5 className="text-[11px] font-bold text-white leading-tight truncate">
                    {operator?.fullName || "Banking Executive"}
                  </h5>
                  <span className="text-[9px] text-mutedText font-mono block truncate">
                    {operator?.role || "SAVINGS_ACCOUNT"}
                  </span>
                </div>
              </div>
              {sidebarExpanded && (
                <button
                  onClick={handleLogout}
                  className="px-2 py-1.5 rounded-lg border border-critical/30 bg-critical/5 hover:bg-critical hover:text-white text-critical text-[9px] font-bold uppercase tracking-wider transition-all flex-shrink-0 animate-pulse hover:animate-none"
                  title="Log Out"
                >
                  Log Out
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* MASTER MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-25 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest hidden md:inline">
              IDBI BRANCH CONSOLE
            </span>
            <div className="bg-[#050505] border border-white/10 rounded-xl px-3 py-1 flex items-center gap-2 text-[10px] font-medium text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
              <span>NODE: CENTRAL_BANK_CORE</span>
            </div>
            <div className="bg-[#050505] border border-white/10 rounded-xl px-3 py-1 flex items-center gap-2 text-[10px] font-medium text-white/80">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? "bg-success animate-ping" : "bg-critical animate-pulse"}`} />
              <span>TELEMETRY: {wsConnected ? "CONNECTED" : "OFFLINE"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Risk posturing status indicator */}
            <div className={`px-3.5 py-1.5 rounded-xl border text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 ${getRiskStatusClass()}`}>
              <span>Shield Posture:</span>
              <span>{globalRiskStatus}</span>
            </div>

            {/* Notification alert bells */}
            <button
              onClick={() => setActiveTab("threat-center")}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-gold/50 flex items-center justify-center relative hover:bg-gold/10 transition-colors"
            >
              <Bell className="h-4 w-4 text-white" />
              {activeThreatsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-critical text-white rounded-full flex items-center justify-center text-[8px] font-bold animate-bounce border border-[#050505]">
                  {activeThreatsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* WORKSPACE VIEW PORT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#050505]">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
