"use client";

import { useState } from "react";

interface Email {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  body: string;
  time: string;
  folder: "inbox" | "sent" | "drafts";
  protocolVersion: string;
  encrypted: boolean;
}

export default function Home() {
  // Navigation & UI States
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "drafts">("inbox");
  const [isConnectDrawerOpen, setIsConnectDrawerOpen] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>("1");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  // Credentials State
  const [credentials, setCredentials] = useState<{
    npub: string;
    alias: string;
    authMethod: "None" | "Passkey" | "Password" | "Mnemonic";
    domain: string;
  }>({
    npub: "npub17x...8p2q9",
    alias: "nathfavour",
    authMethod: "None",
    domain: "tendon.org",
  });

  // Drawer interaction states
  const [tempAlias, setTempAlias] = useState("nathfavour");
  const [tempDomain, setTempDomain] = useState("tendon.org");
  const [authStep, setAuthStep] = useState<"choose" | "passkey" | "password" | "mnemonic">("choose");
  const [passwordInput, setPasswordInput] = useState("");
  const [mnemonicInput, setMnemonicInput] = useState("");

  // Email storage state
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      sender: "system@tendon.org",
      senderName: "Tendon Core",
      subject: "Welcome to Tendon Message Protocol (TMP) v3",
      body: "Welcome to Tendon Message Protocol (TMP) v3. This client runtime is running locally. All state reconciliation, decryption pipelines, and vault parameters are contained within your device's sandbox. Relays are utilized as blind, untrusted transport packets.\n\nEnjoy peer-to-peer asynchronous communications over standard domain namespaces.",
      time: "22:15",
      folder: "inbox",
      protocolVersion: "3.0.0",
      encrypted: true,
    },
    {
      id: "2",
      sender: "newsletter@substack.com",
      senderName: "Substack Digest",
      subject: "Decentralized Mailbox Protocols: A Deepdive",
      body: "The landscape of local-first protocols is changing rapidly. SMTP/PGP was historically too complex for non-technical users. TMP combines static DNS registries (.well-known/tendon.json) with secure WebAuthn hardware-backed keys to create a standard that delivers email convenience with PGP security.",
      time: "18:42",
      folder: "inbox",
      protocolVersion: "3.0.0",
      encrypted: false,
    },
    {
      id: "3",
      sender: "auracrab@superteam.solana",
      senderName: "Auracrab purple-48",
      subject: "PR Merged: Escrow Program Audit Review",
      body: "We have finalized auditing the Solana Escrow repository. The PR has been successfully merged at github.com/dhyon/solana-escrow/pull/1.\n\nThanks for your contribution to the program audit!",
      time: "Yesterday",
      folder: "inbox",
      protocolVersion: "3.0.0",
      encrypted: true,
    },
  ]);

  // Composer Form States
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const handleSelectFolder = (folder: "inbox" | "sent" | "drafts") => {
    setActiveFolder(folder);
    setMobileView("list");
    const folderEmails = emails.filter((e) => e.folder === folder);
    if (folderEmails.length > 0) {
      setSelectedEmailId(folderEmails[0].id);
    } else {
      setSelectedEmailId(null);
    }
  };

  const handleConnectSetup = () => {
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newNpub = `npub1${randomHex}...${randomHex.substring(0, 4)}`;

    let method: "None" | "Passkey" | "Password" | "Mnemonic" = "None";
    if (authStep === "passkey") method = "Passkey";
    else if (authStep === "password") method = "Password";
    else if (authStep === "mnemonic") method = "Mnemonic";

    setCredentials({
      npub: newNpub,
      alias: tempAlias,
      domain: tempDomain,
      authMethod: method,
    });
    setIsConnectDrawerOpen(false);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo) return;

    const newEmail: Email = {
      id: String(emails.length + 1),
      sender: `${credentials.alias}@${credentials.domain}`,
      senderName: credentials.alias,
      subject: composeSubject || "(No Subject)",
      body: composeBody,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      folder: "sent",
      protocolVersion: "3.0.0",
      encrypted: true,
    };

    setEmails((prev) => [newEmail, ...prev]);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setIsComposeOpen(false);
    
    handleSelectFolder("sent");
    setSelectedEmailId(newEmail.id);
  };

  const handleResetAuth = () => {
    setCredentials({
      npub: "npub17x...8p2q9",
      alias: "nathfavour",
      authMethod: "None",
      domain: "tendon.org",
    });
    setAuthStep("choose");
  };

  const filteredEmails = emails.filter((email) => {
    if (email.folder !== activeFolder) return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query) ||
      email.sender.toLowerCase().includes(query) ||
      email.senderName.toLowerCase().includes(query)
    );
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  return (
    <div className="p-3 md:p-5 h-screen w-screen bg-[#0b0a09] flex flex-col overflow-hidden">
      
      {/* Tactile Outer Frame Panel */}
      <div className="flex flex-col flex-1 bg-[#161412] border border-white/5 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden pb-16 md:pb-0">
        
        {/* Topbar inside the frame */}
        <header className="flex items-center justify-between h-16 border-b border-white/5 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono font-bold text-sm">
              T
            </div>
            <span className="font-mono font-bold text-xs tracking-wider text-emerald-400">TENDON MAIL</span>
          </div>

          {/* Search bar nested card */}
          <div className="hidden md:flex items-center gap-3 w-96 bg-[#0b0a09] border border-white/5 rounded-lg h-10 px-4 focus-within:border-emerald-500/50 transition-colors">
            <svg className="text-[#a3a3a3]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search local mailbox..."
              className="bg-transparent border-none w-full text-[#ededed] outline-none text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            {credentials.authMethod !== "None" ? (
              <div 
                className="flex items-center gap-2 bg-[#0b0a09] border border-white/5 px-3 py-1.5 rounded-lg font-mono text-[10px] text-emerald-400 hover:border-emerald-500/50 hover:scale-[1.01] transition-all cursor-pointer"
                onClick={() => setIsConnectDrawerOpen(true)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{credentials.alias}@{credentials.domain}</span>
              </div>
            ) : (
              <button 
                className="flex items-center gap-2 bg-[#0b0a09] text-emerald-400 border border-white/5 px-3 py-1.5 rounded-lg font-mono text-[10px] hover:border-emerald-500 hover:scale-[1.01] transition-all cursor-pointer"
                onClick={() => setIsConnectDrawerOpen(true)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>CONNECT</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Desktop Sidebar (Deep ash background) */}
          <aside className="hidden md:flex flex-col justify-between w-60 border-r border-white/5 p-4 bg-[#161412]">
            <div>
              <button 
                className="flex items-center justify-center gap-2 bg-[#0b0a09] text-emerald-400 border border-white/5 hover:border-emerald-500 font-semibold py-2.5 px-4 rounded-xl w-full text-xs hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(16,185,129,0.15)] active:scale-[0.99] cursor-pointer transition-all mb-6"
                onClick={() => setIsComposeOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>COMPOSE</span>
              </button>

              <nav className="flex flex-col gap-1.5">
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                    activeFolder === "inbox" ? "bg-[#0b0a09] text-emerald-400 border border-white/5 shadow-inner" : "text-[#a3a3a3] hover:text-[#ededed]"
                  }`}
                  onClick={() => handleSelectFolder("inbox")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                  <span>Inbox</span>
                </div>
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                    activeFolder === "sent" ? "bg-[#0b0a09] text-emerald-400 border border-white/5 shadow-inner" : "text-[#a3a3a3] hover:text-[#ededed]"
                  }`}
                  onClick={() => handleSelectFolder("sent")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Send</span>
                </div>
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                    activeFolder === "drafts" ? "bg-[#0b0a09] text-emerald-400 border border-white/5 shadow-inner" : "text-[#a3a3a3] hover:text-[#ededed]"
                  }`}
                  onClick={() => handleSelectFolder("drafts")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Drafts</span>
                </div>
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs cursor-pointer transition-all text-[#a3a3a3] hover:text-[#ededed]`}
                  onClick={() => setIsConnectDrawerOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Settings</span>
                </div>
              </nav>
            </div>

            <div className="font-mono text-[9px] text-[#a3a3a3] text-center pt-4 border-t border-white/5">
              <div>PORT: 5003</div>
              <div className="mt-0.5 text-emerald-400">TMP v3.0.0</div>
            </div>
          </aside>

          {/* Subsections Content Workspace (Deep ash background) */}
          <div className="flex flex-1 overflow-hidden bg-[#161412] p-2 md:p-3 gap-2 md:gap-3">
            
            {/* Inbox / Email list pane (Recessed card background) */}
            <div className={`flex-1 flex flex-col overflow-y-auto bg-[#0b0a09] border border-white/5 rounded-xl ${
              mobileView === "detail" ? "hidden md:flex" : "flex"
            }`}>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/5 bg-[#161412]/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">{activeFolder}</span>
                <span className="font-mono text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#a3a3a3]">
                  {filteredEmails.length} messages
                </span>
              </div>

              {filteredEmails.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-[#a3a3a3] gap-3 p-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-xs">No emails in {activeFolder}</span>
                </div>
              ) : (
                <div className="flex flex-col p-1.5 gap-1.5">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`relative p-4 rounded-lg cursor-pointer transition-all hover:bg-[#161412]/50 hover:scale-[1.01] hover:-translate-y-[0.5px] border ${
                        selectedEmailId === email.id ? "bg-[#161412] border-white/5" : "bg-transparent border-transparent"
                      }`}
                      onClick={() => {
                        setSelectedEmailId(email.id);
                        setMobileView("detail");
                      }}
                    >
                      {selectedEmailId === email.id && (
                        <div className="absolute left-0 top-3 bottom-3 w-[2.5px] bg-emerald-400 rounded"></div>
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-[#ededed]">{email.senderName}</span>
                        <span className="font-mono text-[9px] text-[#a3a3a3]">{email.time}</span>
                      </div>
                      <div className="text-xs font-medium text-[#ededed] mb-1">{email.subject}</div>
                      <div className="text-[11px] text-[#a3a3a3] overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                        {email.body}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email detail pane (Recessed card background) */}
            <div className={`flex-1 md:w-1/2 flex flex-col overflow-y-auto bg-[#0b0a09] border border-white/5 rounded-xl ${
              mobileView === "list" ? "hidden md:flex" : "flex"
            }`}>
              {selectedEmail ? (
                <div className="flex flex-col h-full">
                  
                  {/* Detail headers & actions */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#161412]/10">
                    <button 
                      className="md:hidden text-emerald-400 mr-2 cursor-pointer p-1"
                      onClick={() => setMobileView("list")}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </button>
                    <div className="flex gap-2">
                      <button className="bg-[#161412] border border-white/5 text-[#ededed] px-3 py-1.5 rounded-lg text-xs hover:border-emerald-500 hover:text-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        Reply
                      </button>
                      <button className="bg-[#161412] border border-white/5 text-[#ededed] px-3 py-1.5 rounded-lg text-xs hover:border-emerald-500 hover:text-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        Forward
                      </button>
                      <button className="bg-[#161412] border border-white/5 text-[#ededed] px-3 py-1.5 rounded-lg text-xs hover:border-red-500 hover:text-red-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                    <h2 className="text-base font-bold mb-4 text-[#ededed] leading-snug">{selectedEmail.subject}</h2>
                    <div className="flex justify-between items-center text-xs mb-6 border-b border-white/5 pb-4">
                      <div>
                        <strong className="text-[#ededed]">{selectedEmail.senderName}</strong>{" "}
                        <span className="text-[#a3a3a3]">&lt;{selectedEmail.sender}&gt;</span>
                      </div>
                      <span className="font-mono text-[#a3a3a3]">{selectedEmail.time}</span>
                    </div>
                    <div className="text-xs leading-relaxed text-[#ededed] whitespace-pre-wrap">
                      {selectedEmail.body}
                    </div>
                  </div>

                  <div className="p-5 border-t border-white/5 bg-[#161412]/20 mt-auto">
                    <h4 className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider mb-2">
                      DECRYPTED ENVELOPE METADATA (TMP SPEC)
                    </h4>
                    <pre className="font-mono text-[9px] bg-[#161412] border border-white/5 p-3 rounded-lg text-emerald-400 overflow-x-auto whitespace-pre">
                      {JSON.stringify(
                        {
                          protocol_version: selectedEmail.protocolVersion,
                          sender_pubkey: credentials.npub,
                          envelope_signature: "secp256k1:0x3fa99b4...",
                          payload_encrypted: selectedEmail.encrypted,
                          local_hydration_status: "verified_dns_match",
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#a3a3a3] text-xs gap-4 p-10 text-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <span>Select an email from the left pane to view its content and decrypted metadata</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navbar (Deep ash background) */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#161412] border-t border-white/5 z-40 justify-around items-center px-4">
        <button 
          className={`flex flex-col items-center justify-center gap-1 text-[9px] cursor-pointer transition-colors ${
            activeFolder === "inbox" && mobileView === "list" ? "text-emerald-400 font-semibold" : "text-[#a3a3a3]"
          }`}
          onClick={() => handleSelectFolder("inbox")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <span>Inbox</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center gap-1 text-[9px] cursor-pointer transition-colors ${
            activeFolder === "sent" ? "text-emerald-400 font-semibold" : "text-[#a3a3a3]"
          }`}
          onClick={() => handleSelectFolder("sent")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>Send</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center w-10 h-10 bg-[#0b0a09] border border-white/5 text-emerald-400 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] cursor-pointer"
          onClick={() => setIsComposeOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button 
          className={`flex flex-col items-center justify-center gap-1 text-[9px] cursor-pointer transition-colors ${
            activeFolder === "drafts" ? "text-emerald-400 font-semibold" : "text-[#a3a3a3]"
          }`}
          onClick={() => handleSelectFolder("drafts")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Drafts</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center gap-1 text-[9px] cursor-pointer transition-colors ${
            isConnectDrawerOpen ? "text-emerald-400 font-semibold" : "text-[#a3a3a3]"
          }`}
          onClick={() => setIsConnectDrawerOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </button>
      </nav>

      {/* Connection Settings Bottom Drawer Overlay */}
      {isConnectDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[999] transition-opacity" 
          onClick={() => setIsConnectDrawerOpen(false)} 
        />
      )}

      {/* Connection Settings Bottom Drawer Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#161412] border-t border-[#34322f] rounded-t-2xl z-[1000] transition-transform duration-300 transform flex flex-col max-h-[75vh] ${
        isConnectDrawerOpen ? "translate-y-0 shadow-[0_-12px_36px_rgba(0,0,0,0.6),_0_16px_48px_rgba(0,0,0,0.8)]" : "translate-y-full"
      }`}>
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#0b0a09]/30">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-400">Settings & Vault Decryption</span>
          <button className="text-[#a3a3a3] hover:text-[#ededed] p-1 cursor-pointer transition-colors" onClick={() => setIsConnectDrawerOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-[#161412]">
          {credentials.authMethod !== "None" ? (
            <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
              <div className="text-xs font-semibold text-[#ededed] mb-4">Active Key Decryption Settings</div>
              
              <div className="flex flex-col gap-1.5 mb-4">
                <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">Identity Domain Endpoint</span>
                <div className="font-mono text-xs bg-[#161412] border border-white/5 p-2.5 rounded-lg text-emerald-400">
                  {credentials.alias}@{credentials.domain}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">SEC256K1 PUBLIC ADDRESS (npub)</span>
                <div className="font-mono text-xs bg-[#161412] border border-white/5 p-2.5 rounded-lg text-emerald-400 break-all">
                  {credentials.npub}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-6">
                <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">Active Authentication Mechanism</span>
                <div className="font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-400 font-semibold">
                  {credentials.authMethod}
                </div>
              </div>

              <button
                className="w-full bg-[#161412] border border-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-xl text-xs hover:bg-red-950/20 hover:border-red-500 hover:scale-[1.01] transition-all cursor-pointer"
                onClick={handleResetAuth}
              >
                RESET SYSTEM STATE / DISCONNECT
              </button>
            </div>
          ) : (
            <>
              {authStep === "choose" && (
                <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
                  <div className="text-xs font-semibold text-[#ededed] mb-2">Select Decryption Mechanism</div>
                  <p className="text-[11px] text-[#a3a3a3] mb-5">
                    Private keys stay localized on your device&apos;s sandbox runtime. Select how to authenticate:
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      className="text-left bg-[#161412] border border-white/5 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all flex flex-col gap-1"
                      onClick={() => setAuthStep("passkey")}
                    >
                      <strong className="text-xs text-[#ededed]">Pathway 1: WebAuthn Passkey (Secure Enclave)</strong>
                      <span className="text-[10px] text-[#a3a3a3]">
                        Unwrap keys via stable biometric/hardware signature generation
                      </span>
                    </button>
                    <button
                      className="text-left bg-[#161412] border border-white/5 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all flex flex-col gap-1"
                      onClick={() => setAuthStep("password")}
                    >
                      <strong className="text-xs text-[#ededed]">Pathway 2: Client-Side Argon2id Password</strong>
                      <span className="text-[10px] text-[#a3a3a3]">
                        Derive vault decryption key via edge WASM compute workers
                      </span>
                    </button>
                    <button
                      className="text-left bg-[#161412] border border-white/5 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all flex flex-col gap-1"
                      onClick={() => setAuthStep("mnemonic")}
                    >
                      <strong className="text-xs text-[#ededed]">Pathway 3: Recovery Mnemonic Seed</strong>
                      <span className="text-[10px] text-[#a3a3a3]">
                        Hydrate identity entropy mathematically from a standard recovery phrase
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {authStep === "passkey" && (
                <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
                  <div className="text-xs font-semibold text-[#ededed] mb-4">WebAuthn Hardware Authentication</div>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">User Alias</span>
                    <input
                      type="text"
                      className="bg-[#161412] border border-white/5 rounded-lg p-2.5 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">Verified DNS Domain</span>
                    <input
                      type="text"
                      className="bg-[#161412] border border-white/5 rounded-lg p-2.5 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                      value={tempDomain}
                      onChange={(e) => setTempDomain(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-[#161412] border border-white/5 text-[#ededed] py-2.5 rounded-xl text-xs font-semibold hover:border-emerald-500 hover:text-emerald-400 hover:scale-[1.01] transition-all cursor-pointer"
                      onClick={() => setAuthStep("choose")}
                    >
                      BACK
                    </button>
                    <button
                      className="flex-2 bg-emerald-500 text-black py-2.5 rounded-xl text-xs font-bold hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-all cursor-pointer"
                      onClick={handleConnectSetup}
                    >
                      AUTHENTICATE HARDWARE
                    </button>
                  </div>
                </div>
              )}

              {authStep === "password" && (
                <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
                  <div className="text-xs font-semibold text-[#ededed] mb-4">Argon2id Key Derivation</div>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">User Alias</span>
                    <input
                      type="text"
                      className="bg-[#161412] border border-white/5 rounded-lg p-2.5 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">Decryption Password</span>
                    <input
                      type="password"
                      className="bg-[#161412] border border-white/5 rounded-lg p-2.5 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                      placeholder="••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-[#161412] border border-white/5 text-[#ededed] py-2.5 rounded-xl text-xs font-semibold hover:border-emerald-500 hover:text-emerald-400 hover:scale-[1.01] transition-all cursor-pointer"
                      onClick={() => setAuthStep("choose")}
                    >
                      BACK
                    </button>
                    <button
                      className="flex-2 bg-emerald-500 text-black py-2.5 rounded-xl text-xs font-bold hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-all cursor-pointer"
                      onClick={handleConnectSetup}
                    >
                      DERIVE KEY
                    </button>
                  </div>
                </div>
              )}

              {authStep === "mnemonic" && (
                <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
                  <div className="text-xs font-semibold text-[#ededed] mb-4">Mnemonic Phrase Verification</div>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">User Alias</span>
                    <input
                      type="text"
                      className="bg-[#161412] border border-white/5 rounded-lg p-2.5 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">12/24 Word Mnemonic Seed</span>
                    <textarea
                      className="bg-[#161412] border border-white/5 rounded-lg p-2.5 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50 resize-none"
                      rows={3}
                      placeholder="word1 word2 word3..."
                      value={mnemonicInput}
                      onChange={(e) => setMnemonicInput(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-[#161412] border border-white/5 text-[#ededed] py-2.5 rounded-xl text-xs font-semibold hover:border-emerald-500 hover:text-emerald-400 hover:scale-[1.01] transition-all cursor-pointer"
                      onClick={() => setAuthStep("choose")}
                    >
                      BACK
                    </button>
                    <button
                      className="flex-2 bg-emerald-500 text-black py-2.5 rounded-xl text-xs font-bold hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-all cursor-pointer"
                      onClick={handleConnectSetup}
                    >
                      RECOVER VAULT
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Compose Panel (Rounded Card overlay with tactile backdrop) */}
      {isComposeOpen && (
        <>
          {/* Mobile/Desktop compose backdrop */}
          <div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50" onClick={() => setIsComposeOpen(false)} />
          
          <div className="fixed inset-x-3 bottom-3 md:inset-auto md:bottom-8 md:right-8 md:w-[480px] h-[85vh] md:h-[460px] bg-[#161412] border border-[#34322f] rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.9)] flex flex-col z-50 overflow-hidden">
            <div className="bg-[#0b0a09] px-5 py-3.5 flex justify-between items-center border-b border-white/5">
              <span className="text-xs font-bold text-[#ededed]">New Secure Message</span>
              <button className="text-[#a3a3a3] hover:text-[#ededed] p-1 cursor-pointer transition-colors" onClick={() => setIsComposeOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form className="flex-1 flex flex-col p-5 gap-3 bg-[#161412]" onSubmit={handleSendEmail}>
              <input
                type="text"
                placeholder="To (username@domain.com or npub)"
                className="bg-[#0b0a09] border border-white/5 rounded-lg p-3 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Subject"
                className="bg-[#0b0a09] border border-white/5 rounded-lg p-3 text-xs text-[#ededed] outline-none focus:border-emerald-500/50"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
              />
              <textarea
                placeholder="Write your secure email..."
                className="flex-1 bg-[#0b0a09] border border-white/5 rounded-lg p-3 text-xs text-[#ededed] outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                required
              />
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-[9px] text-[#a3a3a3] bg-[#0b0a09] px-2.5 py-1 rounded-lg border border-white/5 uppercase">
                  Protobuf binary payload
                </span>
                <button 
                  type="submit" 
                  className="bg-emerald-500 text-black font-semibold px-5 py-2.5 rounded-lg text-xs hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>SEND EMAIL</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
