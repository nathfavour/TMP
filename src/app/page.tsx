"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
    const folderEmails = emails.filter((e) => e.folder === folder);
    if (folderEmails.length > 0) {
      setSelectedEmailId(folderEmails[0].id);
    } else {
      setSelectedEmailId(null);
    }
  };

  const handleConnectSetup = () => {
    // Generate a pseudo-random pubkey for display
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
    
    // Automatically switch to Sent folder to view sent mail
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

  // Filters emails based on search query and folder
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
    <div className={styles.container}>
      {/* Topbar navigation */}
      <header className={styles.topbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>T</div>
          <span>TENDON MAIL</span>
        </div>

        <div className={styles.searchBar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search local mailbox..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.topActions}>
          {credentials.authMethod !== "None" ? (
            <div className={styles.connectedBadge} onClick={() => setIsConnectDrawerOpen(true)}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}></span>
              <span>{credentials.alias}@{credentials.domain}</span>
            </div>
          ) : (
            <button className={styles.connectBtn} onClick={() => setIsConnectDrawerOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>CONNECT VAULT</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Mail layout */}
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <div>
            <button className={styles.composeBtn} onClick={() => setIsComposeOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>COMPOSE</span>
            </button>

            <nav className={styles.folderList}>
              <div
                className={`${styles.folderItem} ${activeFolder === "inbox" ? styles.folderItemActive : ""}`}
                onClick={() => handleSelectFolder("inbox")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
                <span>Inbox</span>
              </div>
              <div
                className={`${styles.folderItem} ${activeFolder === "sent" ? styles.folderItemActive : ""}`}
                onClick={() => handleSelectFolder("sent")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Sent</span>
              </div>
              <div
                className={`${styles.folderItem} ${activeFolder === "drafts" ? styles.folderItemActive : ""}`}
                onClick={() => handleSelectFolder("drafts")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Drafts</span>
              </div>
            </nav>
          </div>

          <div className={styles.sidebarFooter}>
            <div>PORT: 5003</div>
            <div style={{ marginTop: 4, color: "var(--accent)" }}>TMP v3.0.0</div>
          </div>
        </aside>

        {/* Content area: list + details split layout */}
        <div className={styles.contentArea}>
          <div className={styles.emailList}>
            <div className={styles.listHeader}>
              <span className={styles.listTitle}>{activeFolder}</span>
              <span className={styles.badgeMono}>{filteredEmails.length} messages</span>
            </div>

            {filteredEmails.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>No emails in {activeFolder}</span>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`${styles.emailItem} ${selectedEmailId === email.id ? styles.emailItemActive : ""}`}
                  onClick={() => setSelectedEmailId(email.id)}
                >
                  <div className={styles.emailMeta}>
                    <span className={styles.emailSender}>{email.senderName}</span>
                    <span className={styles.emailTime}>{email.time}</span>
                  </div>
                  <div className={styles.emailSubject}>{email.subject}</div>
                  <div className={styles.emailSnippet}>{email.body}</div>
                </div>
              ))
            )}
          </div>

          {/* Email detail view panel */}
          <div className={styles.detailView}>
            {selectedEmail ? (
              <>
                <div className={styles.detailHeader}>
                  <div className={styles.detailActions}>
                    <button className={styles.actionBtn}>Reply</button>
                    <button className={styles.actionBtn}>Forward</button>
                    <button className={styles.actionBtn}>Delete</button>
                  </div>
                  <h2 className={styles.detailSubject}>{selectedEmail.subject}</h2>
                  <div className={styles.senderMeta}>
                    <div>
                      <strong>{selectedEmail.senderName}</strong>{" "}
                      <span className={styles.senderAddress}>&lt;{selectedEmail.sender}&gt;</span>
                    </div>
                    <div className={styles.emailTime}>{selectedEmail.time}</div>
                  </div>
                </div>
                <div className={styles.detailBody}>
                  {selectedEmail.body}
                </div>
                <div style={{ padding: "0 24px 24px", borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
                  <h4 style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-secondary)", margin: "16px 0 8px" }}>
                    DECRYPTED ENVELOPE METADATA (TMP SPEC)
                  </h4>
                  <pre className={styles.badgeMono} style={{ whiteSpace: "pre-wrap" }}>
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
              </>
            ) : (
              <div className={styles.detailPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
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

      {/* Connection Drawer Overlay */}
      {isConnectDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsConnectDrawerOpen(false)} />
      )}

      {/* Connection Drawer Sheet */}
      <div className={`${styles.drawer} ${isConnectDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Connection settings</span>
          <button className={styles.closeBtn} onClick={() => setIsConnectDrawerOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerContent}>
          {credentials.authMethod !== "None" ? (
            <div className={styles.nestedCard}>
              <div className={styles.cardTitle}>Active Client Vault Profile</div>
              <div className={styles.formGroup}>
                <span className={styles.formLabel}>Local Identity Address</span>
                <div className={styles.badgeMono}>{credentials.alias}@{credentials.domain}</div>
              </div>
              <div className={styles.formGroup}>
                <span className={styles.formLabel}>SEC256K1 PUBLIC ADDRESS (npub)</span>
                <div className={styles.badgeMono}>{credentials.npub}</div>
              </div>
              <div className={styles.formGroup}>
                <span className={styles.formLabel}>Authentication Method</span>
                <div className={styles.badgeMono} style={{ color: "var(--accent)" }}>{credentials.authMethod}</div>
              </div>
              <button
                className={styles.btnPrimary}
                style={{ width: "100%", background: "#ef4444", color: "#fff", marginTop: 8 }}
                onClick={handleResetAuth}
              >
                DISCONNECT VAULT
              </button>
            </div>
          ) : (
            <>
              {authStep === "choose" && (
                <div className={styles.nestedCard}>
                  <div className={styles.cardTitle}>Select Vault Decryption Pathway</div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                    TMP vaults store your private keys locally and require edge decryption. Choose a secure pathway:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button
                      className={styles.actionBtn}
                      style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 4, padding: 12 }}
                      onClick={() => setAuthStep("passkey")}
                    >
                      <strong>Pathway 1: WebAuthn Passkey (Recommended)</strong>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                        Secure hardware-bound biometric authentication via internal secure enclave
                      </span>
                    </button>
                    <button
                      className={styles.actionBtn}
                      style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 4, padding: 12 }}
                      onClick={() => setAuthStep("password")}
                    >
                      <strong>Pathway 2: Client-Side Password</strong>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                        Argon2id WASM key derivation function calculated purely at the edge
                      </span>
                    </button>
                    <button
                      className={styles.actionBtn}
                      style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 4, padding: 12 }}
                      onClick={() => setAuthStep("mnemonic")}
                    >
                      <strong>Pathway 3: Recovery Mnemonic</strong>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                        12 or 24 word mnemonic seed fallback verification
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {authStep === "passkey" && (
                <div className={styles.nestedCard}>
                  <div className={styles.cardTitle}>WebAuthn Passkey Hydration</div>
                  <div className={styles.formGroup}>
                    <span className={styles.formLabel}>User Alias</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <span className={styles.formLabel}>Domain Pointer</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={tempDomain}
                      onChange={(e) => setTempDomain(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button
                      className={styles.actionBtn}
                      style={{ flex: 1 }}
                      onClick={() => setAuthStep("choose")}
                    >
                      BACK
                    </button>
                    <button
                      className={styles.btnPrimary}
                      style={{ flex: 2 }}
                      onClick={handleConnectSetup}
                    >
                      AUTHENTICATE HARDWARE
                    </button>
                  </div>
                </div>
              )}

              {authStep === "password" && (
                <div className={styles.nestedCard}>
                  <div className={styles.cardTitle}>Argon2id Password Derivation</div>
                  <div className={styles.formGroup}>
                    <span className={styles.formLabel}>User Alias</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <span className={styles.formLabel}>Decryption Password</span>
                    <input
                      type="password"
                      className={styles.textInput}
                      placeholder="••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button
                      className={styles.actionBtn}
                      style={{ flex: 1 }}
                      onClick={() => setAuthStep("choose")}
                    >
                      BACK
                    </button>
                    <button
                      className={styles.btnPrimary}
                      style={{ flex: 2 }}
                      onClick={handleConnectSetup}
                    >
                      DERIVE KEY
                    </button>
                  </div>
                </div>
              )}

              {authStep === "mnemonic" && (
                <div className={styles.nestedCard}>
                  <div className={styles.cardTitle}>Mnemonic Phrase Verification</div>
                  <div className={styles.formGroup}>
                    <span className={styles.formLabel}>User Alias</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <span className={styles.formLabel}>12/24 Word Mnemonic Seed</span>
                    <textarea
                      className={styles.textInput}
                      rows={3}
                      placeholder="word1 word2 word3..."
                      value={mnemonicInput}
                      onChange={(e) => setMnemonicInput(e.target.value)}
                      style={{ resize: "none", fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button
                      className={styles.actionBtn}
                      style={{ flex: 1 }}
                      onClick={() => setAuthStep("choose")}
                    >
                      BACK
                    </button>
                    <button
                      className={styles.btnPrimary}
                      style={{ flex: 2 }}
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

      {/* Floating Compose Panel */}
      {isComposeOpen && (
        <div className={styles.composer}>
          <div className={styles.composerHeader}>
            <span className={styles.composerTitle}>New Message</span>
            <button className={styles.closeBtn} onClick={() => setIsComposeOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <form className={styles.composerForm} onSubmit={handleSendEmail}>
            <input
              type="text"
              placeholder="To (username@domain.com or npub)"
              className={styles.composerInput}
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className={styles.composerInput}
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
            />
            <textarea
              placeholder="Write your secure email..."
              className={styles.composerTextarea}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              required
            />
            <div className={styles.composerActions}>
              <span className={styles.badgeMono} style={{ fontSize: 10 }}>
                MODE: STRICT BINARY PROTOBUF
              </span>
              <button type="submit" className={styles.sendBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>SEND EMAIL</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
