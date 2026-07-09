"use client";
import React, { useState } from "react";
import { useSecurityStore } from "../../store/useSecurityStore";
import { Globe, Terminal, GitBranch, MessageSquare, Cloud, Plug, Loader2, Plus, X, Key, Copy, Check, Trash2 } from "lucide-react";

const getIcon = (id: string) => {
  switch (id) {
    case "chrome": return Globe;
    case "vscode": return Terminal;
    case "github": return GitBranch;
    case "slack": return MessageSquare;
    case "azure": return Cloud;
    case "mcp": return Plug;
    default: return Plug;
  }
};

export default function IntegrationsTab() {
  const { integrations, toggleIntegration, agents, addIntegration, apiKeys, fetchApiKeys, createApiKey, revokeApiKey, operator } = useSecurityStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<"connectors" | "apikeys">("connectors");
  
  // Periodic force-update for API key expiration countdowns
  const [, setTick] = useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"IDE / Browser" | "Identity & Chat" | "Cloud & Infrastructure">("IDE / Browser");
  const [description, setDescription] = useState("");
  const [agentMapping, setAgentMapping] = useState<"existing" | "new">("existing");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  
  // Custom agent states
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentType, setNewAgentType] = useState("");
  const [newAgentParentId, setNewAgentParentId] = useState("agent-work-master");
  const [newAgentTools, setNewAgentTools] = useState("");

  // API Key States
  const [keyName, setKeyName] = useState("");
  const [keyExpiry, setKeyExpiry] = useState("never");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  React.useEffect(() => {
    if (subTab === "apikeys" && operator?.orgId) {
      fetchApiKeys();
    }
  }, [subTab, operator]);

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    try {
      await toggleIntegration(id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const offlineAgents = agents.filter((a) => a.status === "Offline");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    setIsSubmitting(true);
    try {
      const generatedId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const finalId = generatedId || `custom-${Date.now()}`;

      let mappedAgentIds: string[] = [];
      let customAgentData = undefined;

      if (agentMapping === "existing") {
        mappedAgentIds = selectedAgentIds;
      } else if (agentMapping === "new" && newAgentName && newAgentType) {
        const customAgentId = `agent-custom-${newAgentName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
        customAgentData = {
          id: customAgentId,
          name: newAgentName,
          type: newAgentType,
          parentId: newAgentParentId || null,
          connectedTools: newAgentTools.split(",").map(t => t.trim()).filter(Boolean)
        };
        mappedAgentIds = [customAgentId];
      }

      await addIntegration({
        id: finalId,
        name,
        category,
        description,
        agentIds: mappedAgentIds
      }, customAgentData);

      // Reset form fields
      setName("");
      setCategory("IDE / Browser");
      setDescription("");
      setAgentMapping("existing");
      setSelectedAgentIds([]);
      setNewAgentName("");
      setNewAgentType("");
      setNewAgentParentId("agent-work-master");
      setNewAgentTools("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed adding integration:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

const sha256Pure = (ascii: string): string => {
  const rightRotate = (value: number, amount: number) => {
    return (value >>> amount) | (value << (32 - amount));
  };
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i, j;
  let result = "";

  const words: number[] = [];
  const asciiLength = ascii.length * 8;
  
  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  ascii += "\x80";
  while (ascii.length % 64 - 56) ascii += "\x00";
  
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (24 - (i % 4) * 8);
  }
  
  words[words.length] = ((asciiLength / maxWord) | 0);
  words[words.length] = (asciiLength | 0);

  for (i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16);
    let oldHash = hash.slice(0);
    
    for (j = 0; j < 64; j++) {
      if (j >= 16) {
        w[j] = (rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10)) +
               w[j - 7] +
               (rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3)) +
               w[j - 16];
      }
      
      const s1 = (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) +
                 ((hash[4] & hash[5]) ^ (~hash[4] & hash[6])) +
                 hash[7] + k[j] + (w[j] | 0);
      
      const s0 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) +
                 ((hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]));
      
      hash = [(s1 + s0) | 0].concat(hash.slice(0, 7));
      hash[4] = (hash[4] + s1) | 0;
    }
    
    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    const byteStr = (hash[i] >>> 0).toString(16);
    result += ("00000000" + byteStr).slice(-8);
  }
  return result;
};

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    setIsGenerating(true);
    setKeyError(null);
    setGeneratedKey(null);
    try {
      const array = new Uint8Array(24);
      window.crypto.getRandomValues(array);
      const rawHex = Array.from(array, dec => dec.toString(16).padStart(2, "0")).join("");
      const rawToken = `at_live_${rawHex}`;
      
      let hashHex = "";
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(rawToken);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      } else {
        // Fallback to pure JS SHA-256 for insecure network contexts (HTTP local network IPs)
        hashHex = sha256Pure(rawToken);
      }
      
      const keyHint = `****${rawToken.slice(-4)}`;

      let expiresAt: string | null = null;
      if (keyExpiry !== "never") {
        let offsetMs = 0;
        switch (keyExpiry) {
          case "30s": offsetMs = 30 * 1000; break;
          case "5m": offsetMs = 5 * 60 * 1000; break;
          case "30m": offsetMs = 30 * 60 * 1000; break;
          case "1h": offsetMs = 60 * 60 * 1000; break;
          case "1d": offsetMs = 24 * 60 * 60 * 1000; break;
          case "7d": offsetMs = 7 * 24 * 60 * 60 * 1000; break;
        }
        expiresAt = new Date(Date.now() + offsetMs).toISOString();
      }

      await createApiKey(keyName, keyHint, hashHex, expiresAt);
      setGeneratedKey(rawToken);
      setKeyName("");
      setKeyExpiry("never");
    } catch (err: any) {
      console.error("Failed to generate API Key:", err);
      setKeyError(err.message || String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error("Fallback copy was unsuccessful");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy using navigator.clipboard, falling back:", err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const handleCheckboxChange = (agentId: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Header Section */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wider">Connectors & Developer Access</h2>
          <p className="text-xs text-mutedText">Integrate system plugins, browser monitors, and manage secure agent API keys</p>
        </div>
        {subTab === "connectors" && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-gold hover:bg-gold/90 text-[#050505] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-[1.02] transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Integration
          </button>
        )}
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex gap-6 border-b border-white/5 pb-1 select-none">
        <button
          onClick={() => setSubTab("connectors")}
          className={`text-[10px] font-black uppercase tracking-[0.15em] pb-2 transition-all border-b-2 ${
            subTab === "connectors"
              ? "border-gold text-white"
              : "border-transparent text-mutedText hover:text-white"
          }`}
        >
          Integrations Connectors
        </button>
        <button
          onClick={() => setSubTab("apikeys")}
          className={`text-[10px] font-black uppercase tracking-[0.15em] pb-2 transition-all border-b-2 ${
            subTab === "apikeys"
              ? "border-gold text-white"
              : "border-transparent text-mutedText hover:text-white"
          }`}
        >
          Developer API Keys
        </button>
      </div>

      {subTab === "connectors" ? (
        /* CONNECTORS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((int) => {
            const isConnected = int.status === "Connected";
            const IconComponent = getIcon(int.id);
            const isLoading = loadingId === int.id;

            return (
              <div
                key={int.id}
                className={`glass-panel p-6 bg-[#080808]/70 flex flex-col justify-between h-[210px] border transition-all duration-300 ${
                  isConnected
                    ? "border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.08)] opacity-100"
                    : "border-white/5 opacity-50 hover:opacity-85"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${isConnected ? "bg-gold/10 border-gold/30" : "bg-white/5 border-white/10"}`}>
                        <IconComponent className={`h-4.5 w-4.5 ${isConnected ? "text-gold" : "text-white/60"}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-wide">{int.name}</h4>
                        <span className="text-[8px] text-mutedText uppercase tracking-wider font-semibold font-mono">
                          {int.category}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold transition-all ${
                      isConnected
                        ? "bg-gold/10 border border-gold/30 text-gold-secondary shadow-[0_0_8px_rgba(212,175,55,0.1)]"
                        : "bg-white/5 border border-white/10 text-white/40"
                    }`}>
                      {int.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-mutedText leading-relaxed line-clamp-3">
                    {int.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-[8px] text-mutedText font-mono uppercase">
                    {isConnected ? `${int.agentIds ? int.agentIds.length : 0} Agents Online` : "0 Agents Online"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(int.id)}
                      disabled={isLoading}
                      className={`px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                        isConnected
                          ? "bg-critical/10 border border-critical/30 text-critical hover:bg-critical hover:text-white"
                          : "bg-gold text-[#050505] hover:bg-gold/95 shadow-[0_0_10px_rgba(212,175,55,0.15)] hover:scale-[1.02]"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isConnected ? (
                        "Disconnect"
                      ) : (
                        "Connect"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DEVELOPER API KEYS PANEL */
        <div className="space-y-6">
          {/* Key Generator Card */}
          <div className="glass-panel p-6 bg-[#080808]/75 border border-gold/15 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-gold" />
              Generate API Access Key
            </h3>
            <p className="text-[11px] text-mutedText mb-4">
              Provision unique authorization tokens so external AI agent instances can authenticate and stream telemetry metrics securely.
            </p>

            <form onSubmit={handleCreateKey} className="flex flex-col gap-3.5 max-w-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Key Description (e.g. GitHub Agent Warden)"
                  className="flex-1 px-4 py-2.5 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-mono"
                />
                
                <div className="flex items-center gap-2 bg-[#050505] border border-white/10 rounded-xl px-3 py-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-mutedText whitespace-nowrap">Expires:</span>
                  <select
                    value={keyExpiry}
                    onChange={(e) => setKeyExpiry(e.target.value)}
                    className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-mono"
                  >
                    <option value="never" className="bg-[#050505]">Never</option>
                    <option value="30s" className="bg-[#050505]">30 Seconds</option>
                    <option value="5m" className="bg-[#050505]">5 Minutes</option>
                    <option value="30m" className="bg-[#050505]">30 Minutes</option>
                    <option value="1h" className="bg-[#050505]">1 Hour</option>
                    <option value="1d" className="bg-[#050505]">1 Day</option>
                    <option value="7d" className="bg-[#050505]">7 Days</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gold hover:bg-gold/90 text-[#050505] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.15)] transition-all hover:scale-[1.02] disabled:opacity-50 self-end sm:self-auto"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate Token"
                )}
              </button>
            </form>
 
            {/* Display Error Alert */}
            {keyError && (
              <div className="mt-4 p-4 bg-critical/5 border border-critical/20 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-critical font-bold text-xs uppercase tracking-wider">
                  <span>⚠️ Error Generating Token</span>
                </div>
                <p className="text-[10px] text-mutedText">
                  {keyError}
                </p>
              </div>
            )}

            {/* Display Generated Key Alert */}
            {generatedKey && (
              <div className="mt-5 p-4 bg-success/5 border border-success/20 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-success font-bold text-xs uppercase tracking-wider">
                  <Check className="h-4 w-4" />
                  <span>Key Generated Successfully!</span>
                </div>
                <p className="text-[10px] text-mutedText">
                  Please copy this key now and store it safely. For cryptographic security reasons, **we only display this key once** and cannot retrieve it later.
                </p>
                <div className="flex gap-2 max-w-xl">
                  <input
                    type="text"
                    readOnly
                    value={generatedKey}
                    className="flex-1 px-4 py-2 bg-[#050505] border border-success/30 rounded-xl text-xs text-[#00FF9D] font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedKey)}
                    className="px-4 py-2 bg-success/10 border border-success/30 hover:bg-success/20 text-[#00FF9D] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Keys Listing Table */}
          <div className="glass-panel bg-[#080808]/70 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active API Keys</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/5 text-mutedText font-bold uppercase text-[9px] tracking-widest bg-white/[0.01]">
                    <th className="p-4">Key Name</th>
                    <th className="p-4">Key Hint</th>
                    <th className="p-4">Scopes</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Expiration</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/90">
                  {apiKeys.length > 0 ? (
                    apiKeys.map((key) => {
                      const isRevoked = !!key.revokedAt;
                      const isExpired = key.expiresAt ? new Date(key.expiresAt).getTime() < Date.now() : false;
                      
                      let expirationText = "Never";
                      let expirationStyle = "text-mutedText";
                      
                      if (key.expiresAt) {
                        const expDate = new Date(key.expiresAt);
                        const diffMs = expDate.getTime() - Date.now();
                        if (diffMs < 0) {
                          expirationText = "Expired";
                          expirationStyle = "text-critical font-bold";
                        } else {
                          const diffSecs = Math.round(diffMs / 1000);
                          if (diffSecs < 60) {
                            expirationText = `Expires in ${diffSecs}s`;
                            expirationStyle = "text-gold font-semibold animate-pulse";
                          } else {
                            const diffMins = Math.round(diffMs / 60000);
                            if (diffMins < 60) {
                              expirationText = `Expires in ${diffMins}m`;
                              expirationStyle = "text-gold/80 font-semibold";
                            } else {
                              const diffHours = Math.round(diffMins / 60);
                              if (diffHours < 24) {
                                expirationText = `Expires in ${diffHours}h`;
                                expirationStyle = "text-white/60";
                              } else {
                                expirationText = `Expires in ${Math.round(diffHours / 24)}d`;
                                expirationStyle = "text-white/60";
                              }
                            }
                          }
                        }
                      }

                      // Status label
                      let statusText = "Active";
                      let statusBadgeStyle = "bg-success/10 border border-success/30 text-success";
                      if (isRevoked) {
                        statusText = "Revoked";
                        statusBadgeStyle = "bg-critical/10 border border-critical/30 text-critical";
                      } else if (isExpired) {
                        statusText = "Expired";
                        statusBadgeStyle = "bg-critical/10 border border-critical/30 text-critical";
                      }

                      return (
                        <tr key={key.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 font-semibold">{key.name}</td>
                          <td className="p-4 font-mono text-mutedText text-[11px]">{key.keyHint}</td>
                          <td className="p-4">
                            {key.scopes.map((s, idx) => (
                              <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-[8px] font-mono border border-white/10 uppercase tracking-wider text-mutedText mr-1">
                                {s}
                              </span>
                            ))}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-mutedText">
                            {new Date(key.createdAt).toLocaleDateString()}
                          </td>
                          <td className={`p-4 font-mono text-[11px] ${expirationStyle}`}>
                            {expirationText}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${statusBadgeStyle}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {!isRevoked && !isExpired && (
                              <button
                                onClick={() => revokeApiKey(key.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-critical/30 bg-critical/5 hover:bg-critical hover:text-white text-critical text-[9px] font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Revoke</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-white/30 italic">
                        No developer API keys created yet. Generate one above to connect external agent SDKs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphic Modal Dialog Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans select-none animate-fadeIn">
          <div className="w-full max-w-lg p-6 glass-panel border border-gold/20 bg-[#0A0A0A]/95 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between max-h-[90vh] overflow-y-auto relative rounded-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="mb-4 pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Configure Manual Integration</h3>
              <p className="text-[10px] text-mutedText">Manually provision security plugins and map active agent telemetry</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-mutedText">Connector Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Security Hub"
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-mutedText">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-gold/50 transition-all"
                >
                  <option value="IDE / Browser">IDE / Browser</option>
                  <option value="Identity & Chat">Identity & Chat</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-mutedText">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details on monitoring endpoints and access bounds..."
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all"
                />
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <label className="text-[9px] font-bold uppercase tracking-wider text-mutedText block mb-1">Agent Attachment Mapping</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-white font-semibold">
                    <input
                      type="radio"
                      name="agentMapping"
                      value="existing"
                      checked={agentMapping === "existing"}
                      onChange={() => setAgentMapping("existing")}
                      className="accent-gold animate-pulse"
                    />
                    <span>Map Offline Agents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white font-semibold">
                    <input
                      type="radio"
                      name="agentMapping"
                      value="new"
                      checked={agentMapping === "new"}
                      onChange={() => setAgentMapping("new")}
                      className="accent-gold animate-pulse"
                    />
                    <span>Provision Custom Agent</span>
                  </label>
                </div>
              </div>

              {agentMapping === "existing" ? (
                <div className="space-y-1.5 bg-[#050505]/50 border border-white/5 rounded-xl p-3 max-h-[120px] overflow-y-auto">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-mutedText block mb-1">Available Offline Agents</span>
                  {offlineAgents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {offlineAgents.map((ag) => (
                        <label key={ag.id} className="flex items-center gap-2 text-[10px] text-white/70 hover:text-white cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={selectedAgentIds.includes(ag.id)}
                            onChange={() => handleCheckboxChange(ag.id)}
                            className="rounded border-white/20 accent-gold"
                          />
                          <span className="truncate">{ag.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-white/30 italic block text-center py-2">No offline agents currently unassigned</span>
                  )}
                </div>
              ) : (
                <div className="space-y-3 bg-[#050505]/50 border border-white/5 rounded-xl p-3">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gold block mb-1">Custom Agent Specifications</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-mutedText">Agent Name</label>
                      <input
                        type="text"
                        required={agentMapping === "new"}
                        value={newAgentName}
                        onChange={(e) => setNewAgentName(e.target.value)}
                        placeholder="e.g. AWS Auditor"
                        className="w-full px-2 py-1.5 bg-[#050505] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-mutedText">Agent Type</label>
                      <input
                        type="text"
                        required={agentMapping === "new"}
                        value={newAgentType}
                        onChange={(e) => setNewAgentType(e.target.value)}
                        placeholder="e.g. AWS Policy Auditor"
                        className="w-full px-2 py-1.5 bg-[#050505] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-mutedText">Parent Master Node</label>
                      <select
                        value={newAgentParentId}
                        onChange={(e) => setNewAgentParentId(e.target.value)}
                        className="w-full px-2 py-1.5 bg-[#050505] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gold/50"
                      >
                        <option value="agent-work-master">Workspace Copilot Coordinator</option>
                        <option value="agent-sec-master">Security Swarm Orchestrator</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-mutedText">Connected Tools (comma sep)</label>
                      <input
                        type="text"
                        value={newAgentTools}
                        onChange={(e) => setNewAgentTools(e.target.value)}
                        placeholder="e.g. AWS IAM, CloudTrail"
                        className="w-full px-2 py-1.5 bg-[#050505] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gold hover:bg-gold/90 text-[#050505] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Save & Provision"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
