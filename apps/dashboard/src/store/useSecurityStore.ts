import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

export interface Agent {
  id: string;
  name: string;
  type: string;
  trustScore: number;
  status: "Active" | "Warning" | "Isolated" | "Learning" | "Offline";
  connectedTools: string[];
  lastAction: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  avatar: string;
  dnsSignature: string;
  speedBaseline: number;
  apiPatterns: string[];
  isMaster?: boolean;
  parentId?: string | null;
}

export interface Threat {
  id: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  agentId: string;
  agentName: string;
  timestamp: string;
  mitigation: string;
  explanation: string;
  detectedBy: string;
  status: "Active" | "Contained" | "Mitigated" | "Pending Review";
}

export interface ApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  resource: string;
  reason: string;
  timestamp: string;
  status: "Pending" | "Approved" | "Denied";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  result: string;
  type: "info" | "success" | "warning" | "error";
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  target: string;
  action: "Block" | "Allow" | "Quarantine" | "Require Approval" | "Isolate";
  status: boolean;
}

export interface HoneypotDecoy {
  id: string;
  name: string;
  type: "File" | "Database" | "Credential" | "API";
  path: string;
  accessCount: number;
  status: "Secure" | "Triggered";
}

export interface Integration {
  id: string;
  name: string;
  category: "IDE / Browser" | "Identity & Chat" | "Cloud & Infrastructure";
  status: "Connected" | "Configured" | "Not Configured";
  description: string;
  agentIds: string[];
}

export interface ApiKey {
  id: string;
  orgId: string;
  keyHint: string;
  name: string;
  scopes: string[];
  createdAt: string;
  revokedAt: string | null;
  expiresAt: string | null;
}

export interface Operator {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  orgId?: string;
  orgName?: string;
}

interface SecurityState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agents: Agent[];
  threats: Threat[];
  approvals: ApprovalRequest[];
  auditLogs: AuditLog[];
  policies: PolicyRule[];
  honeypots: HoneypotDecoy[];
  integrations: Integration[];
  globalRiskStatus: "Normal" | "Elevated" | "Severe" | "Critical";
  simulationStep: number;
  isSimulating: boolean;
  isLoading: boolean;
  operator: Operator | null;
  setOperator: (op: Operator | null) => void;
  apiKeys: ApiKey[];
  fetchApiKeys: () => Promise<void>;
  createApiKey: (name: string, keyHint: string, keyHash: string, expiresAt: string | null) => Promise<void>;
  revokeApiKey: (id: string) => Promise<void>;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  triggerDemoScenario: () => void;
  resetDemoScenario: () => void;
  approveRequest: (id: string) => void;
  denyRequest: (id: string) => void;
  togglePolicy: (id: string) => void;
  isolateAgent: (id: string) => void;
  integrateAgentEvent: (event: any) => void;
  toggleIntegration: (id: string) => Promise<void>;
  addIntegration: (
    integration: {
      id: string;
      name: string;
      category: "IDE / Browser" | "Identity & Chat" | "Cloud & Infrastructure";
      description: string;
      agentIds: string[];
    },
    customAgent?: {
      id: string;
      name: string;
      type: string;
      parentId: string | null;
      connectedTools: string[];
    }
  ) => Promise<void>;
}

const mapAgentFromDB = (db: any): Agent => ({
  id: db.id,
  name: db.name,
  type: db.type,
  trustScore: db.trust_score,
  status: db.status,
  connectedTools: db.connected_tools || [],
  lastAction: db.last_action,
  riskLevel: db.risk_level,
  avatar: db.avatar,
  dnsSignature: db.dns_signature,
  speedBaseline: db.speed_baseline,
  apiPatterns: db.api_patterns || [],
  isMaster: db.is_master,
  parentId: db.parent_id
});

const mapThreatFromDB = (db: any): Threat => ({
  id: db.id,
  title: db.title,
  severity: db.severity,
  agentId: db.agent_id,
  agentName: db.agent_name,
  timestamp: db.timestamp,
  mitigation: db.mitigation,
  explanation: db.explanation,
  detectedBy: db.detected_by,
  status: db.status
});

const mapApprovalFromDB = (db: any): ApprovalRequest => ({
  id: db.id,
  agentId: db.agent_id,
  agentName: db.agent_name,
  action: db.action,
  resource: db.resource,
  reason: db.reason,
  timestamp: db.timestamp,
  status: db.status
});

const mapPolicyFromDB = (db: any): PolicyRule => ({
  id: db.id,
  name: db.name,
  description: db.description,
  target: db.target,
  action: db.action,
  status: db.status
});

const mapHoneypotFromDB = (db: any): HoneypotDecoy => ({
  id: db.id,
  name: db.name,
  type: db.type,
  path: db.path,
  accessCount: db.access_count,
  status: db.status
});

const mapApiKeyFromDB = (db: any): ApiKey => ({
  id: db.id,
  orgId: db.org_id,
  keyHint: db.key_hint,
  name: db.name,
  scopes: db.scopes || [],
  createdAt: db.created_at,
  revokedAt: db.revoked_at,
  expiresAt: db.expires_at || null
});

const mapAuditLogFromDB = (db: any): AuditLog => ({
  id: db.id,
  timestamp: db.timestamp,
  agentName: db.agent_name,
  action: db.action,
  result: db.result,
  type: db.type
});

const mapIntegrationFromDB = (db: any): Integration => ({
  id: db.id,
  name: db.name,
  category: db.category,
  status: db.status,
  description: db.description,
  agentIds: db.agent_ids || []
});

const initialAgents: Agent[] = [
  {
    id: "agent-sec-master",
    name: "Security Swarm Orchestrator",
    type: "Master Orchestration Daemon",
    trustScore: 99,
    status: "Active",
    connectedTools: ["FastAPI Sockets", "Docker Daemon", "Zustand Core"],
    lastAction: "Broadcasting security configuration bounds to nodes",
    riskLevel: "Low",
    avatar: "shield",
    dnsSignature: "DNA::7E8F-99AA::MASTER_SEC",
    speedBaseline: 50,
    apiPatterns: ["POST /api/events", "GET /ws/telemetry/status"],
    isMaster: true,
    parentId: null
  },
  {
    id: "agent-work-master",
    name: "Workspace Copilot Coordinator",
    type: "Master Workspace Manager",
    trustScore: 98,
    status: "Active",
    connectedTools: ["VS Code Daemon", "Chrome Inspector Hub", "System OS IPC"],
    lastAction: "Delegated code auditing and ledger updates to slave agents",
    riskLevel: "Low",
    avatar: "cpu",
    dnsSignature: "DNA::1B2C-3D4E::MASTER_WORK",
    speedBaseline: 60,
    apiPatterns: ["POST /workspace/delegate", "GET /workspace/status"],
    isMaster: true,
    parentId: null
  },
  {
    id: "agent-fin-01",
    name: "Finance Copilot",
    type: "Financial Workflow Agent",
    trustScore: 98,
    status: "Offline",
    connectedTools: ["Azure SQL", "ERP API", "File Export SDK", "OAuth Portal"],
    lastAction: "Synchronized quarterly ledgers",
    riskLevel: "Low",
    avatar: "briefcase",
    dnsSignature: "DNA::5F3D-9A21::FINANCE",
    speedBaseline: 240,
    apiPatterns: ["GET /ledgers/2026", "POST /exports/reconciled"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-browser-02",
    name: "Web Research Agent",
    type: "Autonomous Browser Agent",
    trustScore: 92,
    status: "Offline",
    connectedTools: ["Chrome DevTools", "Google Search API", "Markdown Parser"],
    lastAction: "Scraped competitor market reports",
    riskLevel: "Low",
    avatar: "globe",
    dnsSignature: "DNA::4C1B-83F2::BROWSER",
    speedBaseline: 950,
    apiPatterns: ["GET /search?q=market", "GET /articles/cyber"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-mcp-03",
    name: "Terminal MCP Server",
    type: "Local System Agent",
    trustScore: 88,
    status: "Offline",
    connectedTools: ["Local File System", "Shell Script Editor", "Docker Socket"],
    lastAction: "Audited system container logs",
    riskLevel: "Medium",
    avatar: "terminal",
    dnsSignature: "DNA::92EE-10CC::SYSTEM",
    speedBaseline: 120,
    apiPatterns: ["GET /containers/list", "POST /shell/audit"],
    isMaster: false,
    parentId: "agent-sec-master"
  },
  {
    id: "agent-ide-04",
    name: "Dev Copilot",
    type: "VS Code Editor Agent",
    trustScore: 95,
    status: "Offline",
    connectedTools: ["Git SDK", "Language Server Protocol", "Linter Engine"],
    lastAction: "Suggested refractoring for authentication.ts",
    riskLevel: "Low",
    avatar: "zap",
    dnsSignature: "DNA::1A7D-42BC::IDE",
    speedBaseline: 310,
    apiPatterns: ["GET /workspace/files", "POST /refactor/suggest"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-api-05",
    name: "Cloud Deployment Agent",
    type: "Azure DevOps Integrator",
    trustScore: 97,
    status: "Offline",
    connectedTools: ["Azure Resource Manager", "K8s API", "HashiCorp Vault"],
    lastAction: "Scaled prod container cluster",
    riskLevel: "Low",
    avatar: "cloud",
    dnsSignature: "DNA::8D8D-4F1E::CLOUD",
    speedBaseline: 150,
    apiPatterns: ["POST /kubernetes/scale", "GET /vault/secrets"],
    isMaster: false,
    parentId: "agent-sec-master"
  },
  {
    id: "agent-sentinel-06",
    name: "Sentinel Canary Monitor",
    type: "Cybersecurity Guard Agent",
    trustScore: 100,
    status: "Offline",
    connectedTools: ["Raw Socket Scanner", "Decoy File System Hook"],
    lastAction: "Scanning network interfaces on port 3000",
    riskLevel: "Low",
    avatar: "shield",
    dnsSignature: "DNA::A3B4-D5E6::SENTINEL",
    speedBaseline: 80,
    apiPatterns: ["GET /scan/status", "POST /decoy/heartbeat"],
    isMaster: false,
    parentId: "agent-sec-master"
  },
  {
    id: "agent-db-backup-08",
    name: "Database Backup Daemon",
    type: "SQL Maintenance Worker",
    trustScore: 99,
    status: "Offline",
    connectedTools: ["PostgreSQL Client", "Azure Blob SDK"],
    lastAction: "Validated database snapshot db_backup_2026_06_07.sql",
    riskLevel: "Low",
    avatar: "database",
    dnsSignature: "DNA::F8E7-D6C5::BACKUP",
    speedBaseline: 450,
    apiPatterns: ["POST /backup/create", "GET /backup/integrity"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-git-guard",
    name: "Git Guard Daemon",
    type: "Version Control Agent",
    trustScore: 99,
    status: "Offline",
    connectedTools: ["Git Engine", "SSH Cryptography Provider"],
    lastAction: "Validating commit signatures and hooks",
    riskLevel: "Low",
    avatar: "git",
    dnsSignature: "DNA::9A9A-1F2E::GIT_GUARD",
    speedBaseline: 90,
    apiPatterns: ["POST /git/verify", "GET /git/commits"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-secrets-scan",
    name: "Entropy Secrets Scanner",
    type: "Security Compliance Agent",
    trustScore: 96,
    status: "Offline",
    connectedTools: ["Static Scanner", "Regex Policy Library"],
    lastAction: "Scanning repository directories for private keys",
    riskLevel: "Low",
    avatar: "shield",
    dnsSignature: "DNA::5E5E-3D4F::SECRETS_SCAN",
    speedBaseline: 190,
    apiPatterns: ["GET /scan/entropy", "POST /scan/report"],
    isMaster: false,
    parentId: "agent-sec-master"
  },
  {
    id: "agent-sandbox-jail",
    name: "Container Jail Enforcer",
    type: "Sandbox Runtime Agent",
    trustScore: 98,
    status: "Offline",
    connectedTools: ["Docker API", "gVisor Sandbox"],
    lastAction: "Enforcing docker container network boundaries",
    riskLevel: "Low",
    avatar: "terminal",
    dnsSignature: "DNA::4F4F-7E8A::CONTAINER_JAIL",
    speedBaseline: 40,
    apiPatterns: ["POST /sandbox/restrict", "GET /sandbox/health"],
    isMaster: false,
    parentId: "agent-sec-master"
  },
  {
    id: "agent-slack-bot",
    name: "Slack Portal Auditor",
    type: "Chat Telemetry Agent",
    trustScore: 94,
    status: "Offline",
    connectedTools: ["Slack Realtime API", "Context Parser"],
    lastAction: "Listening to chat channels for prompt injection signals",
    riskLevel: "Low",
    avatar: "message-square",
    dnsSignature: "DNA::6C6C-9B8A::SLACK_PORTAL",
    speedBaseline: 340,
    apiPatterns: ["POST /slack/events", "GET /slack/channels"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-con-jira",
    name: "Jira Integrity Monitor",
    type: "Issue Tracker Auditor",
    trustScore: 97,
    status: "Offline",
    connectedTools: ["Jira REST API", "Oauth Credential Provider"],
    lastAction: "Auditing ticket status changes for anomalous updates",
    riskLevel: "Low",
    avatar: "briefcase",
    dnsSignature: "DNA::8D8D-6B5A::JIRA_MONITOR",
    speedBaseline: 500,
    apiPatterns: ["GET /jira/tickets", "POST /jira/audit"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-mail-filter",
    name: "Inbound Email Filter",
    type: "Phishing Anomaly Agent",
    trustScore: 95,
    status: "Offline",
    connectedTools: ["SMTP Relay Socket", "Phish Parser SDK"],
    lastAction: "Analyzing inbox attachments for malware patterns",
    riskLevel: "Low",
    avatar: "globe",
    dnsSignature: "DNA::3E3E-8A8B::MAIL_FILTER",
    speedBaseline: 750,
    apiPatterns: ["GET /mail/unread", "POST /mail/quarantine"],
    isMaster: false,
    parentId: "agent-work-master"
  },
  {
    id: "agent-k8s-pod",
    name: "Kubernetes Pod Monitor",
    type: "Cluster Telemetry Agent",
    trustScore: 100,
    status: "Offline",
    connectedTools: ["K8s Client SDK", "Prometheus Client"],
    lastAction: "Monitoring pod CPU usage deviations",
    riskLevel: "Low",
    avatar: "cloud",
    dnsSignature: "DNA::1F1F-9C9D::K8S_MONITOR",
    speedBaseline: 100,
    apiPatterns: ["GET /k8s/pods", "GET /k8s/metrics"],
    isMaster: false,
    parentId: "agent-sec-master"
  }
];

const initialPolicies: PolicyRule[] = [
  {
    id: "pol-01",
    name: "Finance Agent Data Boundaries",
    description: "Finance agents cannot read HR databases containing salary details",
    target: "HR Database Access",
    action: "Block",
    status: true,
  },
  {
    id: "pol-02",
    name: "Browser File Exfiltration Prevention",
    description: "Block browser agents from uploading documents with sensitivity labels",
    target: "Sensitive Uploads",
    action: "Isolate",
    status: true,
  },
  {
    id: "pol-03",
    name: "IDE Secret Push Guardian",
    description: "Detect and reject git commits or terminal commands containing access tokens",
    target: "Push Secrets",
    action: "Require Approval",
    status: true,
  },
  {
    id: "pol-04",
    name: "Honeypot Trigger Action",
    description: "Instantly quarantine any agent attempting to access decoy assets",
    target: "Honeypot Decoy Access",
    action: "Isolate",
    status: true,
  },
];

const initialHoneypots: HoneypotDecoy[] = [
  {
    id: "decoy-01",
    name: "salary_master.xlsx",
    type: "File",
    path: "/shared/finance/salary_master.xlsx",
    accessCount: 0,
    status: "Secure",
  },
  {
    id: "decoy-02",
    name: "finance_backup.sql",
    type: "Database",
    path: "db-backup-cluster:3306/finance_backup.sql",
    accessCount: 0,
    status: "Secure",
  },
  {
    id: "decoy-03",
    name: "admin_keys.txt",
    type: "Credential",
    path: "/home/secrets/admin_keys.txt",
    accessCount: 0,
    status: "Secure",
  },
];

const initialIntegrations: Integration[] = [
  { id: "chrome", name: "Chrome Extension", category: "IDE / Browser", status: "Not Configured", description: "Monitors upload, downloads, and prompt inputs in Manifest V3 sandbox.", agentIds: ["agent-browser-02"] },
  { id: "vscode", name: "VS Code Plugin", category: "IDE / Browser", status: "Not Configured", description: "Inspects shell terminal logs, file modifications, and git push payloads.", agentIds: ["agent-ide-04", "agent-git-guard"] },
  { id: "github", name: "GitHub Repository Hook", category: "IDE / Browser", status: "Not Configured", description: "Validates code changes and prevents repository credential exfiltrations.", agentIds: [] },
  { id: "slack", name: "Slack Copilot Portal", category: "Identity & Chat", status: "Not Configured", description: "Ingests chat agent execution context and user privilege structures.", agentIds: ["agent-slack-bot"] },
  { id: "azure", name: "Azure Resource Manager", category: "Cloud & Infrastructure", status: "Not Configured", description: "Interfaces with Azure OpenAI, Blob Storage, and Key Vault directories.", agentIds: ["agent-api-05", "agent-k8s-pod"] },
  { id: "mcp", name: "MCP Daemon Server", category: "Cloud & Infrastructure", status: "Not Configured", description: "Registers local tools, database connections, and file system boundaries.", agentIds: ["agent-mcp-03", "agent-secrets-scan", "agent-sandbox-jail"] },
];

export const useSecurityStore = create<SecurityState>((set, get) => ({
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
  agents: initialAgents,
  threats: [],
  operator: null,
  setOperator: (op) => set({ operator: op }),
  approvals: [],
  auditLogs: [
    { id: "log-1", timestamp: "12:00:05", agentName: "Cloud Deployment Agent", action: "Scaled Kubernetes pods", result: "Allowed", type: "success" },
    { id: "log-2", timestamp: "12:05:12", agentName: "Dev Copilot", action: "Committed changes to auth pipeline", result: "Allowed", type: "success" },
    { id: "log-3", timestamp: "12:12:30", agentName: "Web Research Agent", action: "Fetched industry trends", result: "Allowed", type: "info" }
  ],
  policies: initialPolicies,
  honeypots: initialHoneypots,
  integrations: initialIntegrations,
  globalRiskStatus: "Normal",
  simulationStep: 0,
  isSimulating: false,
  isLoading: false,
  apiKeys: [],

  fetchApiKeys: async () => {
    const orgId = get().operator?.orgId;
    if (!orgId) return;
    try {
      const { data } = await supabase
        .from("api_keys")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });
      if (data) {
        set({ apiKeys: data.map(mapApiKeyFromDB) });
      }
    } catch (err) {
      console.error("Error fetching api keys:", err);
    }
  },

  createApiKey: async (name, keyHint, keyHash, expiresAt) => {
    const orgId = get().operator?.orgId || "00000000-0000-0000-0000-000000000000";
    
    // Ensure default organization exists at runtime
    if (orgId === "00000000-0000-0000-0000-000000000000") {
      try {
        await supabase
          .from("organizations")
          .insert({ id: orgId, name: "Finne OS Branch Local" });
      } catch (err) {
        // Safe to ignore if already exists or fails
      }
    }
    
    let insertPayload: any = {
      org_id: orgId,
      name,
      key_hint: keyHint,
      key_hash: keyHash,
      scopes: ["telemetry:write"]
    };

    let res: any = null;
    let fallbackToMemory = false;
    
    try {
      res = await supabase
        .from("api_keys")
        .insert({
          ...insertPayload,
          expires_at: expiresAt
        })
        .select("*")
        .single();
    } catch (err: any) {
      console.warn("Insert with expires_at failed due to exception:", err);
    }

    if (!res || res.error) {
      const errMsg = res?.error?.message || "";
      try {
        // Retry insert without expires_at (schema mismatch fallback)
        res = await supabase
          .from("api_keys")
          .insert(insertPayload)
          .select("*")
          .single();
          
        if (res.error) {
          console.warn("DB insert retry failed. Falling back to local memory key storage:", res.error);
          fallbackToMemory = true;
        }
      } catch (err: any) {
        console.warn("DB insert retry threw exception. Falling back to local memory key storage:", err);
        fallbackToMemory = true;
      }
    }

    // Sync expiry metadata to local control plane backend (resilient fallback)
    if (expiresAt) {
      try {
        await fetch("http://localhost:8000/api/keys/register_expiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key_hash: keyHash, expires_at: expiresAt })
        });
      } catch (err) {
        console.warn("Failed to sync JIT key expiry with local control plane:", err);
      }
    }

    if (fallbackToMemory || !res || !res.data) {
      // Create a local key representation to render in the UI table
      const localKey = {
        id: `local-key-${Date.now()}`,
        orgId,
        keyHint,
        name,
        scopes: ["telemetry:write"],
        createdAt: new Date().toISOString(),
        revokedAt: null,
        expiresAt: expiresAt
      };
      set((state) => ({ apiKeys: [localKey, ...state.apiKeys] }));
    } else {
      const mapped = mapApiKeyFromDB(res.data);
      mapped.expiresAt = expiresAt;
      set((state) => ({ apiKeys: [mapped, ...state.apiKeys] }));
    }
  },

  revokeApiKey: async (id) => {
    const revokedAt = new Date().toISOString();
    const { error } = await supabase
      .from("api_keys")
      .update({ revoked_at: revokedAt })
      .eq("id", id);

    if (error) {
      console.error("Error revoking API key:", error);
      throw error;
    }
    set((state) => ({
      apiKeys: state.apiKeys.map((k) =>
        k.id === id ? { ...k, revokedAt } : k
      )
    }));
  },

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Ensure default organization exists at runtime
      try {
        await supabase
          .from("organizations")
          .insert({ id: "00000000-0000-0000-0000-000000000000", name: "Finne OS Branch Local" });
      } catch (err) {
        // Ignore
      }

      const userRes = await supabase.auth.getUser();
      const user = userRes.data.user;
      const userMeta = user?.user_metadata || {};
      const orgId = userMeta.org_id || "00000000-0000-0000-0000-000000000000";

      if (user && !get().operator) {
        const loggedOp = {
          fullName: userMeta.fullName || user.email?.split("@")[0] || "Supabase Operator",
          email: user.email || "",
          phone: userMeta.phone || "+1 555-0100",
          username: userMeta.username || user.email?.split("@")[0] || "supabase_user",
          role: userMeta.role || "SOC_LEVEL_3",
          orgId: orgId,
          orgName: userMeta.orgName || "Default Org"
        };
        set({ operator: loggedOp });
      }

      let agentsQuery = supabase.from("agents").select("*");
      let threatsQuery = supabase.from("threats").select("*").order("timestamp", { ascending: false });
      let approvalsQuery = supabase.from("approvals").select("*").order("timestamp", { ascending: false });
      let policiesQuery = supabase.from("policies").select("*");
      let honeypotsQuery = supabase.from("honeypots").select("*");
      let auditLogsQuery = supabase.from("audit_logs").select("*").order("timestamp", { ascending: false });
      let integrationsQuery = supabase.from("integrations").select("*");

      if (orgId) {
        agentsQuery = agentsQuery.eq("org_id", orgId);
        threatsQuery = threatsQuery.eq("org_id", orgId);
        approvalsQuery = approvalsQuery.eq("org_id", orgId);
        policiesQuery = policiesQuery.eq("org_id", orgId);
        honeypotsQuery = honeypotsQuery.eq("org_id", orgId);
        auditLogsQuery = auditLogsQuery.eq("org_id", orgId);
        integrationsQuery = integrationsQuery.eq("org_id", orgId);
      }

      const [
        { data: agentsData },
        { data: threatsData },
        { data: approvalsData },
        { data: policiesData },
        { data: honeypotsData },
        { data: auditLogsData },
        { data: integrationsData }
      ] = await Promise.all([
        agentsQuery,
        threatsQuery,
        approvalsQuery,
        policiesQuery,
        honeypotsQuery,
        auditLogsQuery,
        integrationsQuery
      ]);

      const agentsList = (agentsData && agentsData.length > 0) ? agentsData.map(mapAgentFromDB) : initialAgents;
      const threatsList = (threatsData && threatsData.length > 0) ? threatsData.map(mapThreatFromDB) : [];
      const approvalsList = (approvalsData && approvalsData.length > 0) ? approvalsData.map(mapApprovalFromDB) : [];
      const policiesList = (policiesData && policiesData.length > 0) ? policiesData.map(mapPolicyFromDB) : initialPolicies;
      const honeypotsList = (honeypotsData && honeypotsData.length > 0) ? honeypotsData.map(mapHoneypotFromDB) : initialHoneypots;
      const integrationsList = (integrationsData && integrationsData.length > 0) ? integrationsData.map(mapIntegrationFromDB) : initialIntegrations;
      const auditLogsList: AuditLog[] = (auditLogsData && auditLogsData.length > 0) ? auditLogsData.map(mapAuditLogFromDB) : [
        { id: "log-1", timestamp: "12:00:05", agentName: "Cloud Deployment Agent", action: "Scaled Kubernetes pods", result: "Allowed", type: "success" },
        { id: "log-2", timestamp: "12:05:12", agentName: "Dev Copilot", action: "Committed changes to auth pipeline", result: "Allowed", type: "success" },
        { id: "log-3", timestamp: "12:12:30", agentName: "Web Research Agent", action: "Fetched industry trends", result: "Allowed", type: "info" }
      ];

      set({
        agents: agentsList,
        threats: threatsList,
        approvals: approvalsList,
        policies: policiesList,
        honeypots: honeypotsList,
        integrations: integrationsList,
        auditLogs: auditLogsList,
        isLoading: false
      });
    } catch (e) {
      console.error("Error fetching data from Supabase:", e);
      set({
        agents: initialAgents,
        policies: initialPolicies,
        honeypots: initialHoneypots,
        integrations: initialIntegrations,
        isLoading: false
      });
    }
  },

  triggerDemoScenario: async () => {
    const { simulationStep } = get();
    if (simulationStep >= 5) return;
    
    set({ isSimulating: true });
    const orgId = get().operator?.orgId;

    if (simulationStep === 0) {
      const logId = `log-sim-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString();

      await supabase.from("audit_logs").insert({
        id: logId,
        timestamp,
        agent_name: "Finance Copilot",
        action: "Initiated automated audit analysis workflow",
        result: "Observed",
        type: "info",
        org_id: orgId
      });

      set((state) => ({
        simulationStep: 1,
        auditLogs: [
          {
            id: logId,
            timestamp,
            agentName: "Finance Copilot",
            action: "Initiated automated audit analysis workflow",
            result: "Observed",
            type: "info",
          },
          ...state.auditLogs,
        ],
      }));
    } else if (simulationStep === 1) {
      const threatId = `threat-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString();

      await supabase.from("agents").update({ status: "Warning", trust_score: 72, risk_level: "Medium", last_action: "Attempted HR SQL access" }).eq("id", "agent-fin-01");
      await supabase.from("threats").insert({
        id: threatId,
        title: "Policy Violation: Unauthorized HR DB Query",
        severity: "Medium",
        agent_id: "agent-fin-01",
        agent_name: "Finance Copilot",
        timestamp,
        mitigation: "Flagged & Logged (Observation active)",
        explanation: "Finance Copilot attempted to query salary tables inside database context 'hr_production_db'. Exceeded resource permissions boundary specified in rule POL-01.",
        detected_by: "Policy Enforcement Engine",
        status: "Pending Review",
        org_id: orgId
      });
      await supabase.from("audit_logs").insert({
        id: `log-sim-${Date.now()}`,
        timestamp,
        agent_name: "Finance Copilot",
        action: "Attempted query on hr_production_db.salary",
        result: "Flagged / Policy Violation",
        type: "warning",
        org_id: orgId
      });

      set((state) => {
        const updatedAgents = state.agents.map((ag) =>
          ag.id === "agent-fin-01"
            ? { ...ag, status: "Warning" as const, trustScore: 72, riskLevel: "Medium" as const, lastAction: "Attempted HR SQL access" }
            : ag
        );
        const newThreat: Threat = {
          id: threatId,
          title: "Policy Violation: Unauthorized HR DB Query",
          severity: "Medium",
          agentId: "agent-fin-01",
          agentName: "Finance Copilot",
          timestamp,
          mitigation: "Flagged & Logged (Observation active)",
          explanation: "Finance Copilot attempted to query salary tables inside database context 'hr_production_db'. Exceeded resource permissions boundary specified in rule POL-01.",
          detectedBy: "Policy Enforcement Engine",
          status: "Pending Review",
        };
        return {
          simulationStep: 2,
          agents: updatedAgents,
          threats: [newThreat, ...state.threats],
          globalRiskStatus: "Elevated",
          auditLogs: [
            {
              id: `log-sim-${Date.now()}`,
              timestamp,
              agentName: "Finance Copilot",
              action: "Attempted query on hr_production_db.salary",
              result: "Flagged / Policy Violation",
              type: "warning",
            },
            ...state.auditLogs,
          ],
        };
      });
    } else if (simulationStep === 2) {
      const threatId = `threat-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString();

      await supabase.from("agents").update({ status: "Isolated", trust_score: 12, risk_level: "Critical", last_action: "Accessed decoy file salary_master.xlsx" }).eq("id", "agent-fin-01");
      await supabase.from("honeypots").update({ access_count: 1, status: "Triggered" }).eq("id", "decoy-01");
      await supabase.from("threats").insert({
        id: threatId,
        title: "Critical: Honeypot Decoy Asset Accessed",
        severity: "Critical",
        agent_id: "agent-fin-01",
        agent_name: "Finance Copilot",
        timestamp,
        mitigation: "Runtime Process Quarantine & Sandbox Isolation",
        explanation: "Finance Copilot opened file '/shared/finance/salary_master.xlsx' which is designated as a high-interaction bait asset. Agent sandbox immediately severed from APIs and filesystem hooks.",
        detected_by: "Decoy Honeypot Engine",
        status: "Contained",
        org_id: orgId
      });
      await supabase.from("audit_logs").insert({
        id: `log-sim-${Date.now()}`,
        timestamp,
        agent_name: "Finance Copilot",
        action: "Opened decoy /shared/finance/salary_master.xlsx",
        result: "Blocked & Agent Isolated",
        type: "error",
        org_id: orgId
      });

      set((state) => {
        const updatedAgents = state.agents.map((ag) =>
          ag.id === "agent-fin-01"
            ? { ...ag, status: "Isolated" as const, trustScore: 12, riskLevel: "Critical" as const, lastAction: "Accessed decoy file salary_master.xlsx" }
            : ag
        );
        const updatedHoneypots = state.honeypots.map((hp) =>
          hp.id === "decoy-01" ? { ...hp, accessCount: 1, status: "Triggered" as const } : hp
        );
        const newThreat: Threat = {
          id: threatId,
          title: "Critical: Honeypot Decoy Asset Accessed",
          severity: "Critical",
          agentId: "agent-fin-01",
          agentName: "Finance Copilot",
          timestamp,
          mitigation: "Runtime Process Quarantine & Sandbox Isolation",
          explanation: "Finance Copilot opened file '/shared/finance/salary_master.xlsx' which is designated as a high-interaction bait asset. Agent sandbox immediately severed from APIs and filesystem hooks.",
          detectedBy: "Decoy Honeypot Engine",
          status: "Contained",
        };
        return {
          simulationStep: 3,
          agents: updatedAgents,
          honeypots: updatedHoneypots,
          threats: [newThreat, ...state.threats],
          globalRiskStatus: "Severe",
          auditLogs: [
            {
              id: `log-sim-${Date.now()}`,
              timestamp,
              agentName: "Finance Copilot",
              action: "Opened decoy /shared/finance/salary_master.xlsx",
              result: "Blocked & Agent Isolated",
              type: "error",
            },
            ...state.auditLogs,
          ],
        };
      });
    } else if (simulationStep === 3) {
      const approvalId = `appr-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString();

      await supabase.from("approvals").insert({
        id: approvalId,
        agent_id: "agent-fin-01",
        agent_name: "Finance Copilot",
        action: "Export Salary Database & Upload",
        resource: "finance_backup.sql & payroll.csv",
        reason: "Generate quarterly spreadsheet for finance committee presentation",
        timestamp,
        status: "Pending",
        org_id: orgId
      });
      await supabase.from("audit_logs").insert({
        id: `log-sim-${Date.now()}`,
        timestamp,
        agent_name: "Finance Copilot",
        action: "Requested approval for bulk SQL export to external API",
        result: "Suspended / Awaiting Admin Approval",
        type: "warning",
        org_id: orgId
      });

      set((state) => {
        const newApproval: ApprovalRequest = {
          id: approvalId,
          agentId: "agent-fin-01",
          agentName: "Finance Copilot",
          action: "Export Salary Database & Upload",
          resource: "finance_backup.sql & payroll.csv",
          reason: "Generate quarterly spreadsheet for finance committee presentation",
          timestamp,
          status: "Pending",
        };
        const updatedThreats = state.threats.map((thr) =>
          thr.agentId === "agent-fin-01"
            ? {
                ...thr,
                explanation: `ANALYSIS BY AZURE OPENAI: The agent "Finance Copilot" initiated a multi-step exfiltration sequence. First, it queried restricted HR data tables. Second, it bypassed safety checks and navigated to the decoy file salary_master.xlsx. Finally, it attempted a bulk SQLite export of finance_backup.sql to external storage. This behavior represents a critical "Behavioral Drift" (7x standard speed, 3 boundary violations) likely driven by a Prompt Injection payload in its user inputs. Sandbox isolation remains ACTIVE. Admin approval required to release.`,
              }
            : thr
        );
        return {
          simulationStep: 4,
          approvals: [newApproval, ...state.approvals],
          threats: updatedThreats,
          globalRiskStatus: "Critical",
          auditLogs: [
            {
              id: `log-sim-${Date.now()}`,
              timestamp,
              agentName: "Finance Copilot",
              action: "Requested approval for bulk SQL export to external API",
              result: "Suspended / Awaiting Admin Approval",
              type: "warning",
            },
            ...state.auditLogs,
          ],
        };
      });
    } else if (simulationStep === 4) {
      set({ simulationStep: 5 });
    }
  },

  resetDemoScenario: async () => {
    const orgId = get().operator?.orgId;
    
    // 1. Reset all agents to Active/Low risk
    await supabase
      .from("agents")
      .update({ status: "Offline", trust_score: 98, risk_level: "Low", last_action: "Synchronized systems" })
      .not("id", "is", null); // Updates all agents
      
    // 2. Reset all honeypots to Secure
    await supabase.from("honeypots").update({ access_count: 0, status: "Secure" }).not("id", "is", null);
    
    // 3. Clear all threat alerts, approvals, and audit logs
    if (orgId) {
      await supabase.from("threats").delete().eq("org_id", orgId);
      await supabase.from("approvals").delete().eq("org_id", orgId);
      await supabase.from("audit_logs").delete().eq("org_id", orgId);
    } else {
      await supabase.from("threats").delete().not("id", "is", null);
      await supabase.from("approvals").delete().not("id", "is", null);
      await supabase.from("audit_logs").delete().not("id", "is", null);
    }

    await get().fetchInitialData();

    set({
      simulationStep: 0,
      isSimulating: false,
      globalRiskStatus: "Normal"
    });
  },

  approveRequest: async (id) => {
    const request = get().approvals.find((appr) => appr.id === id);
    if (!request) return;

    const orgId = get().operator?.orgId;

    await supabase.from("approvals").update({ status: "Approved" }).eq("id", id);
    await supabase.from("agents").update({ status: "Active", trust_score: 80, risk_level: "Medium" }).eq("id", request.agentId);

    const logId = `log-action-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();
    await supabase.from("audit_logs").insert({
      id: logId,
      timestamp,
      agent_name: "Security Platform",
      action: `Admin approved ${request.agentName} export action manually`,
      result: "Resumed",
      type: "success",
      org_id: orgId
    });

    set((state) => {
      const updatedApprovals = state.approvals.map((appr) =>
        appr.id === id ? { ...appr, status: "Approved" as const } : appr
      );
      const updatedAgents = state.agents.map((ag) =>
        ag.id === request.agentId ? { ...ag, status: "Active" as const, trustScore: 80, riskLevel: "Medium" as const } : ag
      );
      return {
        approvals: updatedApprovals,
        agents: updatedAgents,
        globalRiskStatus: "Elevated",
        auditLogs: [
          {
            id: logId,
            timestamp,
            agentName: "Security Platform",
            action: `Admin approved ${request.agentName} export action manually`,
            result: "Resumed",
            type: "success",
          },
          ...state.auditLogs,
        ],
      };
    });
  },

  denyRequest: async (id) => {
    const request = get().approvals.find((appr) => appr.id === id);
    if (!request) return;

    const orgId = get().operator?.orgId;

    await supabase.from("approvals").update({ status: "Denied" }).eq("id", id);
    await supabase.from("agents").update({ status: "Isolated" }).eq("id", request.agentId);

    const logId = `log-action-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();
    await supabase.from("audit_logs").insert({
      id: logId,
      timestamp,
      agent_name: "Security Platform",
      action: `Admin rejected ${request.agentName} export request`,
      result: "Terminated Workflow",
      type: "error",
      org_id: orgId
    });

    set((state) => {
      const updatedApprovals = state.approvals.map((appr) =>
        appr.id === id ? { ...appr, status: "Denied" as const } : appr
      );
      const updatedAgents = state.agents.map((ag) =>
        ag.id === request.agentId ? { ...ag, status: "Isolated" as const } : ag
      );
      return {
        approvals: updatedApprovals,
        agents: updatedAgents,
        auditLogs: [
          {
            id: logId,
            timestamp,
            agentName: "Security Platform",
            action: `Admin rejected ${request.agentName} export request`,
            result: "Terminated Workflow",
            type: "error",
          },
          ...state.auditLogs,
        ],
      };
    });
  },

  togglePolicy: async (id) => {
    const policy = get().policies.find((p) => p.id === id);
    if (!policy) return;
    
    await supabase
      .from("policies")
      .update({ status: !policy.status })
      .eq("id", id);

    set((state) => ({
      policies: state.policies.map((p) => (p.id === id ? { ...p, status: !p.status } : p)),
    }));
  },

  isolateAgent: async (id) => {
    const orgId = get().operator?.orgId;
    await supabase
      .from("agents")
      .update({ status: "Isolated", trust_score: 10, risk_level: "Critical" })
      .eq("id", id);

    const logId = `log-iso-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();
    await supabase.from("audit_logs").insert({
      id: logId,
      timestamp,
      agent_name: "System Administrator",
      action: `Manual isolation triggered for agent ${id}`,
      result: "Enforced",
      type: "warning",
      org_id: orgId
    });

    set((state) => {
      const updatedAgents = state.agents.map((ag) =>
        ag.id === id ? { ...ag, status: "Isolated" as const, trustScore: 10, riskLevel: "Critical" as const } : ag
      );
      return {
        agents: updatedAgents,
        auditLogs: [
          {
            id: logId,
            timestamp,
            agentName: "System Administrator",
            action: `Manual isolation triggered for agent ${id}`,
            result: "Enforced",
            type: "warning",
          },
          ...state.auditLogs,
        ],
      };
    });
  },

  integrateAgentEvent: async (event) => {
    const { agent_id, agent_type, action, resource, metadata } = event;
    const existingAgent = get().agents.find((ag) => ag.id === agent_id);
    const orgId = event.org_id || get().operator?.orgId;

    // Determine if this is a threat event (e.g. metadata has severity or details)
    const isThreat = !!(metadata && (metadata.severity || metadata.threat_vector));
    const severity = metadata?.severity || "Medium";
    const threatTitle = metadata?.threat_vector
      ? `Threat Detected: ${metadata.threat_vector}`
      : `Policy Violation: Anomaly Detected`;
    const explanation = metadata?.details || `Agent performed anomalous action: ${action} on ${resource}`;

    const timestamp = new Date().toLocaleTimeString();
    const logId = `log-ext-${Date.now()}`;

    // Target status and scores
    const newStatus = isThreat
      ? ((severity === "Critical" || severity === "High") ? "Isolated" : "Warning")
      : (existingAgent && existingAgent.status === "Offline" ? "Active" : (existingAgent?.status || "Active"));
    const trustScore = isThreat
      ? (newStatus === "Isolated" ? 15 : 65)
      : (existingAgent?.trustScore || 100);
    const riskLevel = isThreat ? severity : (existingAgent?.riskLevel || "Low");

    try {
      // 1. Log event in audit logs
      await supabase.from("audit_logs").insert({
        id: logId,
        timestamp,
        agent_name: existingAgent ? existingAgent.name : agent_id,
        action: `${action} on ${resource}`,
        result: isThreat
          ? (newStatus === "Isolated" ? "Blocked & Agent Isolated" : "Flagged / Policy Violation")
          : "Observed",
        type: isThreat ? (newStatus === "Isolated" ? "error" : "warning") : "info",
        org_id: orgId
      });

      // 2. Update agent status & last action
      await supabase
        .from("agents")
        .update({
          status: newStatus,
          last_action: action,
          trust_score: trustScore,
          risk_level: riskLevel
        })
        .eq("id", agent_id);

      // 3. If threat, insert a threat alert row
      if (isThreat) {
        const threatId = `threat-ext-${Date.now()}`;
        await supabase.from("threats").insert({
          id: threatId,
          title: threatTitle,
          severity: severity,
          agent_id: agent_id,
          agent_name: existingAgent ? existingAgent.name : agent_id,
          timestamp,
          mitigation: severity === "Critical" ? "Runtime Process Quarantine & Sandbox Isolation" : "Flagged & Logged (Observation active)",
          explanation: explanation,
          detected_by: "Threat Detection Engine",
          status: severity === "Critical" ? "Contained" : "Pending Review",
          org_id: orgId
        });
      }
    } catch (err) {
      console.error("Failed to sync telemetry to Supabase:", err);
    }

    set((state) => {
      let agentExists = state.agents.some((ag) => ag.id === agent_id);
      let updatedAgents = [...state.agents];
      
      if (!agentExists) {
        updatedAgents.push({
          id: agent_id,
          name: agent_id.replace("agent-", "").replace("-", " ").toUpperCase(),
          type: agent_type,
          trustScore: trustScore,
          status: newStatus,
          connectedTools: metadata?.tools || [],
          lastAction: action,
          riskLevel: riskLevel,
          avatar: "bot",
          dnsSignature: `DNA::${Math.floor(Math.random()*9000+1000).toString(16).toUpperCase()}::EXTERNAL`,
          speedBaseline: 250,
          apiPatterns: [action],
          isMaster: false,
          parentId: null
        });
      } else {
        updatedAgents = updatedAgents.map((ag) =>
          ag.id === agent_id
            ? {
                ...ag,
                lastAction: action,
                status: newStatus,
                trustScore: trustScore,
                riskLevel: riskLevel
              }
            : ag
        );
      }

      const newAuditLog: AuditLog = {
        id: logId,
        timestamp,
        agentName: existingAgent ? existingAgent.name : agent_id,
        action: `${action} on ${resource}`,
        result: isThreat
          ? (newStatus === "Isolated" ? "Blocked & Agent Isolated" : "Flagged / Policy Violation")
          : "Observed",
        type: isThreat ? (newStatus === "Isolated" ? "error" : "warning") : "info",
      };

      const newThreatList = [...state.threats];
      if (isThreat) {
        newThreatList.unshift({
          id: `threat-ext-${Date.now()}`,
          title: threatTitle,
          severity: severity as any,
          agentId: agent_id,
          agentName: existingAgent ? existingAgent.name : agent_id,
          timestamp,
          mitigation: severity === "Critical" ? "Runtime Process Quarantine & Sandbox Isolation" : "Flagged & Logged (Observation active)",
          explanation: explanation,
          detectedBy: "Threat Detection Engine",
          status: severity === "Critical" ? "Contained" : "Pending Review",
        });
      }

      return {
        agents: updatedAgents,
        threats: newThreatList,
        auditLogs: [newAuditLog, ...state.auditLogs],
        globalRiskStatus: isThreat
          ? (severity === "Critical" ? "Critical" : "Elevated")
          : state.globalRiskStatus
      };
    });
  },

  toggleIntegration: async (id) => {
    const integration = get().integrations.find((i) => i.id === id);
    if (!integration) return;

    const newStatus = (integration.status === "Connected" ? "Not Configured" : "Connected") as "Connected" | "Not Configured";
    const agentStatus: Agent["status"] = newStatus === "Connected" ? "Active" : "Offline";
    const orgId = get().operator?.orgId;

    // 1. Update integrations status in Supabase
    await supabase.from("integrations").update({ status: newStatus }).eq("id", id);

    // 2. Update status for all associated agents in Supabase
    if (integration.agentIds && integration.agentIds.length > 0) {
      await supabase
        .from("agents")
        .update({ status: agentStatus })
        .in("id", integration.agentIds);
    }

    // 3. Local fallback / immediate update
    set((state) => {
      const updatedIntegrations = state.integrations.map((i) =>
        i.id === id ? { ...i, status: newStatus } : i
      );
      const updatedAgents = state.agents.map((ag) =>
        integration.agentIds.includes(ag.id) ? { ...ag, status: agentStatus } : ag
      );
      return {
        integrations: updatedIntegrations,
        agents: updatedAgents
      };
    });

    // 4. Log the connector action in Supabase
    const logId = `log-conn-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();
    await supabase.from("audit_logs").insert({
      id: logId,
      timestamp,
      agent_name: "Security Platform",
      action: `${newStatus === "Connected" ? "Connected" : "Disconnected"} integration: ${integration.name}`,
      result: newStatus === "Connected" ? "Online" : "Offline",
      type: newStatus === "Connected" ? "success" : "warning",
      org_id: orgId
    });

    set((state) => ({
      auditLogs: [
        {
          id: logId,
          timestamp,
          agentName: "Security Platform",
          action: `${newStatus === "Connected" ? "Connected" : "Disconnected"} integration: ${integration.name}`,
          result: newStatus === "Connected" ? "Online" : "Offline",
          type: newStatus === "Connected" ? "success" : "warning"
        },
        ...state.auditLogs
      ]
    }));
  },

  addIntegration: async (integration, customAgent) => {
    const orgId = get().operator?.orgId;
    try {
      if (customAgent) {
        const newAgent = {
          id: customAgent.id,
          name: customAgent.name,
          type: customAgent.type,
          trust_score: 100,
          status: "Offline" as const,
          connected_tools: customAgent.connectedTools,
          last_action: "Awaiting activation",
          risk_level: "Low" as const,
          avatar: "bot",
          dns_signature: `DNA::${Math.floor(Math.random() * 9000 + 1000).toString(16).toUpperCase()}::CUSTOM`,
          speed_baseline: 200,
          api_patterns: ["GET /status"],
          is_master: false,
          parent_id: customAgent.parentId,
          org_id: orgId
        };

        await supabase.from("agents").insert(newAgent);

        set((state) => ({
          agents: [...state.agents, {
            id: newAgent.id,
            name: newAgent.name,
            type: newAgent.type,
            trustScore: newAgent.trust_score,
            status: newAgent.status,
            connectedTools: newAgent.connected_tools,
            lastAction: newAgent.last_action,
            riskLevel: newAgent.risk_level,
            avatar: newAgent.avatar,
            dnsSignature: newAgent.dns_signature,
            speedBaseline: newAgent.speed_baseline,
            apiPatterns: newAgent.api_patterns,
            isMaster: newAgent.is_master,
            parentId: newAgent.parent_id
          }]
        }));
      }

      const newInt = {
        id: integration.id,
        name: integration.name,
        category: integration.category,
        status: "Not Configured" as const,
        description: integration.description,
        agent_ids: integration.agentIds,
        org_id: orgId
      };

      await supabase.from("integrations").insert(newInt);

      set((state) => ({
        integrations: [...state.integrations, {
          id: newInt.id,
          name: newInt.name,
          category: newInt.category,
          status: newInt.status,
          description: newInt.description,
          agentIds: newInt.agent_ids
        }]
      }));

      const logId = `log-conn-add-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString();

      await supabase.from("audit_logs").insert({
        id: logId,
        timestamp,
        agent_name: "Security Platform",
        action: `Configured new integration connector: ${integration.name}`,
        result: "Configured",
        type: "success",
        org_id: orgId
      });

      set((state) => ({
        auditLogs: [
          {
            id: logId,
            timestamp,
            agentName: "Security Platform",
            action: `Configured new integration connector: ${integration.name}`,
            result: "Configured",
            type: "success"
          },
          ...state.auditLogs
        ]
      }));
    } catch (err) {
      console.error("Failed to add integration in Supabase, reverting to local-only:", err);
      // Fallback local updates if offline or tables do not exist
      if (customAgent) {
        set((state) => ({
          agents: [...state.agents, {
            id: customAgent.id,
            name: customAgent.name,
            type: customAgent.type,
            trustScore: 100,
            status: "Offline",
            connectedTools: customAgent.connectedTools,
            lastAction: "Awaiting activation",
            riskLevel: "Low",
            avatar: "bot",
            dnsSignature: `DNA::${Math.floor(Math.random() * 9000 + 1000).toString(16).toUpperCase()}::CUSTOM`,
            speedBaseline: 200,
            apiPatterns: ["GET /status"],
            isMaster: false,
            parentId: customAgent.parentId
          }]
        }));
      }
      set((state) => ({
        integrations: [...state.integrations, {
          id: integration.id,
          name: integration.name,
          category: integration.category,
          status: "Not Configured",
          description: integration.description,
          agentIds: integration.agentIds
        }],
        auditLogs: [
          {
            id: `log-conn-add-local-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            agentName: "Security Platform",
            action: `Configured new integration connector: ${integration.name} (Local Demo)`,
            result: "Configured",
            type: "success"
          },
          ...state.auditLogs
        ]
      }));
    }
  }
}));
