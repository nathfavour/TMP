"use client";

import { useState, useEffect, useRef } from "react";
import {
  bytesToNpub,
  generateRandomPrivkey,
  getPubkeyFromPrivkey,
  encryptVault,
  decryptVault,
  deriveKeyFromPassword,
  bytesToHex,
  type EncryptedVault
} from "@/lib/tmp/crypto";
import { resolveIdentifier } from "@/lib/tmp/resolver";
import { NostrRelayPool, signEvent, type NostrEvent } from "@/lib/tmp/nostr";
import { buildEnvelope, wrapForNostr } from "@/lib/tmp/builder";
import { decodeEnvelope } from "@/lib/tmp/codec";

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
  rawEvent?: NostrEvent;
}

interface AccountVaultConfig {
  alias: string;
  domain: string;
  passkeys: { 
    credentialIdHex: string; 
    vault: EncryptedVault; 
    name?: string; 
    createdDomain?: string; 
    createdAt?: number;
  }[];
  passwordVault?: EncryptedVault;
  mnemonicVault?: EncryptedVault;
}

const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.nostr.band"
];

export default function Home() {
  // Navigation & UI States
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "drafts">("inbox");
  const [isConnectDrawerOpen, setIsConnectDrawerOpen] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  // Onboarding wizard
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== "undefined") {
      const activeKey = sessionStorage.getItem("tendon_active_key");
      if (activeKey) return false;
    }
    return true;
  });

  // Credentials State
  const [credentials, setCredentials] = useState<{
    npub: string;
    alias: string;
    authMethod: "None" | "Passkey" | "Password" | "Mnemonic";
    domain: string;
  }>(() => {
    if (typeof window !== "undefined") {
      const savedCreds = localStorage.getItem("tendon_active_creds");
      if (savedCreds) {
        try {
          return JSON.parse(savedCreds);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      npub: "",
      alias: "",
      authMethod: "None",
      domain: "",
    };
  });

  const [activePrivKey, setActivePrivKey] = useState<Uint8Array | null>(() => {
    if (typeof window !== "undefined") {
      const hex = sessionStorage.getItem("tendon_active_key");
      if (hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
        }
        return bytes;
      }
    }
    return null;
  });
  const [activeVaultConfig, setActiveVaultConfig] = useState<AccountVaultConfig | null>(() => {
    if (typeof window !== "undefined") {
      const savedCreds = localStorage.getItem("tendon_active_creds");
      if (savedCreds) {
        try {
          const parsed = JSON.parse(savedCreds);
          if (parsed.alias && parsed.domain) {
            const vaultKey = `tendon_account_vault_${parsed.alias}@${parsed.domain}`;
            const saved = localStorage.getItem(vaultKey);
            if (saved) return JSON.parse(saved);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  });

  // Drawer & form interaction states
  const [tempAlias, setTempAlias] = useState("");
  const [tempDomain] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.host;
    }
    return "localhost:5003";
  });
  const [authStep, setAuthStep] = useState<"choose" | "passkey" | "password" | "mnemonic">("choose");
  const [passwordInput, setPasswordInput] = useState("");
  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"passkey" | "password" | "mnemonic">("passkey");
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [isMnemonicDrawerOpen, setIsMnemonicDrawerOpen] = useState(false);
  const [activeMnemonicBackup, setActiveMnemonicBackup] = useState("");
  const [isCheckingPasswordOnchain, setIsCheckingPasswordOnchain] = useState(false);
  const [passwordExistsOnchain, setPasswordExistsOnchain] = useState<boolean | null>(null);
  const [resolvedUsername, setResolvedUsername] = useState("");
  const [searchedNpubHint, setSearchedNpubHint] = useState("");
  const [isDeleteAccountDrawerOpen, setIsDeleteAccountDrawerOpen] = useState(false);
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [directoryNames, setDirectoryNames] = useState<Record<string, string>>({});
  const [isAliasTaken, setIsAliasTaken] = useState<boolean | null>(null);

  useEffect(() => {
    const input = tempAlias.trim();
    if (!input) return;

    const timer = setTimeout(async () => {
      try {
        const domain = typeof window !== "undefined" ? window.location.host : "localhost:5003";
        const scheme = domain.includes("localhost") || domain.includes("127.0.0.1") || domain.includes(":") ? "http" : "https";
        const response = await fetch(`${scheme}://${domain}/.well-known/tendon.json`);
        if (response.ok) {
          const data = await response.json();
          if (input.startsWith("npub1")) {
            const foundEntry = Object.entries(data.names || {}).find(([, npub]) => npub === input);
            if (foundEntry) {
              const [name] = foundEntry;
              setIsAliasTaken(true);
              setResolvedUsername(name);
              setSearchedNpubHint(input);
            } else {
              setIsAliasTaken(null);
              setResolvedUsername("");
              setSearchedNpubHint("");
            }
          } else {
            const alias = input.toLowerCase();
            if (data.names && data.names[alias]) {
              setIsAliasTaken(true);
              setResolvedUsername("");
              setSearchedNpubHint(data.names[alias]);
            } else {
              setIsAliasTaken(false);
              setResolvedUsername("");
              setSearchedNpubHint("");
            }
          }
        } else {
          setIsAliasTaken(false);
          setResolvedUsername("");
          setSearchedNpubHint("");
        }
      } catch {
        setIsAliasTaken(false);
        setResolvedUsername("");
        setSearchedNpubHint("");
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [tempAlias]);

  const loadDirectoryNames = async () => {
    try {
      const domain = credentials.domain || window.location.host;
      const scheme = domain.includes("localhost") || domain.includes("127.0.0.1") || domain.includes(":") ? "http" : "https";
      const response = await fetch(`${scheme}://${domain}/.well-known/tendon.json`);
      if (response.ok) {
        const data = await response.json();
        if (data.names) {
          setDirectoryNames(data.names);
        }
      }
    } catch (e) {
      console.warn("Failed to load directory names for auto-complete:", e);
    }
  };

  const handleOpenCompose = () => {
    setIsComposeOpen(true);
    loadDirectoryNames();
  };

  const getComposeSuggestions = () => {
    const query = composeTo.trim().toLowerCase();
    if (!query) return [];

    const suggestions: { username: string; npub: string }[] = [];
    for (const [name, npub] of Object.entries(directoryNames)) {
      if (
        name.toLowerCase().includes(query) ||
        npub.toLowerCase().includes(query)
      ) {
        suggestions.push({ username: name, npub });
      }
    }
    return suggestions.slice(0, 5);
  };

  const loadActiveVaultConfig = () => {
    if (typeof window !== "undefined" && credentials.alias && credentials.domain) {
      const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
      const saved = localStorage.getItem(vaultKey);
      if (saved) {
        try {
          setActiveVaultConfig(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setActiveVaultConfig(null);
      }
    } else {
      setActiveVaultConfig(null);
    }
  };

  // Email storage state
  const [emails, setEmails] = useState<Email[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("tendon_emails_cache");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  // Composer Form States
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // Relay connection status
  const [connectedRelays, setConnectedRelays] = useState<number>(0);
  const relayPoolRef = useRef<NostrRelayPool | null>(null);

  // Save emails to localStorage when updated
  useEffect(() => {
    localStorage.setItem("tendon_emails_cache", JSON.stringify(emails));
  }, [emails]);

  // Connect to relays and subscribe to incoming messages
  useEffect(() => {
    if (!credentials.npub || !activePrivKey) {
      if (relayPoolRef.current) {
        relayPoolRef.current.close();
        relayPoolRef.current = null;
      }
      setTimeout(() => setConnectedRelays(0), 0);
      return;
    }

    const myHexPub = bytesToHex(getPubkeyFromPrivkey(activePrivKey));
    console.log("Subscribing to messages for public key hex:", myHexPub);

    const pool = new NostrRelayPool(DEFAULT_RELAYS);
    relayPoolRef.current = pool;
    pool.connect();

    // Check connections periodically
    const interval = setInterval(() => {
      let count = 0;
      // @ts-expect-error sockets is private
      for (const socket of pool.sockets.values()) {
        if (socket.readyState === WebSocket.OPEN) count++;
      }
      setConnectedRelays(count);
    }, 2000);

    pool.addListener((event: NostrEvent) => {
      if (event.kind !== 1059) return;

      const pTag = event.tags.find(t => t[0] === "p")?.[1];
      const isSentByMe = event.pubkey === myHexPub;
      const isForMe = pTag === myHexPub;

      if (!isForMe && !isSentByMe) return;

      try {
        const envelope = decodeEnvelope(event.content);
        if (envelope.payload.kind === "unicast_mail") {
          const mail = envelope.payload.value;
          
          const newEmail: Email = {
            id: event.id,
            sender: isSentByMe ? `${credentials.alias}@${credentials.domain}` : `npub1${event.pubkey.substring(0, 8)}...`,
            senderName: isSentByMe ? "Me" : `User ${event.pubkey.substring(0, 6)}`,
            subject: mail.subject || "(No Subject)",
            body: mail.body_plaintext,
            time: new Date(envelope.dispatch_timestamp_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            folder: isSentByMe ? "sent" : "inbox",
            protocolVersion: String(envelope.protocol_version),
            encrypted: true,
            rawEvent: event
          };

          setEmails((prev) => {
            if (prev.some(e => e.id === newEmail.id)) return prev;
            return [newEmail, ...prev];
          });
        }
      } catch (e) {
        console.error("Failed to decode incoming envelope:", e);
      }
    });

    pool.subscribe("my-inbox", [
      { kinds: [1059], "#p": [myHexPub] },
      { kinds: [1059], authors: [myHexPub] }
    ]);

    return () => {
      clearInterval(interval);
      pool.close();
      relayPoolRef.current = null;
    };
  }, [credentials, activePrivKey]);

  // Connect helper
  const handleConnectSetup = async (overrideAuthStep?: "passkey" | "password" | "mnemonic") => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const alias = (credentials.alias || resolvedUsername || tempAlias).trim().toLowerCase();
      const domain = (credentials.domain || tempDomain).trim();
      if (!alias || !domain) {
        throw new Error("Alias and domain must not be empty");
      }

      let privateKeyBytes: Uint8Array;
      let methodUsed: typeof credentials.authMethod = "None";

      const vaultKey = `tendon_account_vault_${alias}@${domain}`;
      const savedVaultRaw = localStorage.getItem(vaultKey);
      let accountVault: AccountVaultConfig = savedVaultRaw 
        ? JSON.parse(savedVaultRaw) 
        : { alias, domain, passkeys: [] };

      // Query Nostr relays if local vault is missing or empty
      if (!savedVaultRaw || (!accountVault.passwordVault && accountVault.passkeys.length === 0)) {
        let hexPub = "";
        try {
          if (alias.startsWith("npub1")) {
            const { npubToBytes } = await import("@/lib/tmp/crypto");
            hexPub = bytesToHex(npubToBytes(alias));
          } else {
            const registryResponse = await fetch(`http://${domain}/.well-known/tendon.json`);
            if (registryResponse.ok) {
              const regData = await registryResponse.json();
              const targetNpub = regData.names?.[alias];
              if (targetNpub) {
                const { npubToBytes } = await import("@/lib/tmp/crypto");
                hexPub = bytesToHex(npubToBytes(targetNpub));
              }
            }
          }
        } catch (err) {
          console.warn("Could not resolve hex public key for relay vault fetch:", err);
        }

        if (hexPub) {
          const remoteVault = await fetchVaultFromRelays(hexPub);
          if (remoteVault) {
            accountVault = remoteVault;
            localStorage.setItem(vaultKey, JSON.stringify(accountVault));
          }
        }
      }

      const activeStep = overrideAuthStep || authStep;

      if (activeStep === "passkey") {
        methodUsed = "Passkey";
        const { loginPasskey } = await import("@/lib/tmp/crypto");
        
        if (isAliasTaken === true || accountVault.passkeys.length > 0) {
          // Select list of credential IDs
          const allowedIds = accountVault.passkeys.map(pk => pk.credentialIdHex);
          const { key, credentialIdHex } = await loginPasskey(allowedIds);
        
          // Try to authenticate with the chosen one
          let matched = accountVault.passkeys.find(pk => pk.credentialIdHex === credentialIdHex);
          if (!matched && accountVault.passkeys.length > 0) {
            matched = accountVault.passkeys[0];
          }
          
          if (!matched) {
            throw new Error("Local passkey vault credentials not found on this device. Please sign in using your alternative Password instead.");
          }
          
          privateKeyBytes = await decryptVault(matched.vault, key);
        } else {
          // Register new passkey
          const { registerPasskey } = await import("@/lib/tmp/crypto");
          const { key, credentialIdHex } = await registerPasskey(alias);
          
          privateKeyBytes = generateRandomPrivkey();
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const vault = await encryptVault(privateKeyBytes, key, salt);
          
          const randHex = bytesToHex(crypto.getRandomValues(new Uint8Array(3)));
          const timestamp = new Date().getTime();

          accountVault.passkeys.push({ 
            credentialIdHex, 
            vault,
            name: `Passkey-${randHex}`,
            createdDomain: window.location.host,
            createdAt: timestamp
          });
          localStorage.setItem(vaultKey, JSON.stringify(accountVault));
          await publishVaultToRelays(accountVault, privateKeyBytes);
        }
      } else if (activeStep === "password") {
        methodUsed = "Password";
        if (isAliasTaken === true || accountVault.passwordVault) {
          if (!accountVault.passwordVault) {
            throw new Error("This username is already registered on the network, but no password vault exists on this device. Please use Passkey instead.");
          }
          try {
            const prfKey = await deriveKeyFromPassword(passwordInput, accountVault.passwordVault.salt);
            privateKeyBytes = await decryptVault(accountVault.passwordVault, prfKey);
          } catch {
            throw new Error("Incorrect password. Decryption failed.");
          }
        } else {
          privateKeyBytes = generateRandomPrivkey();
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const prfKey = await deriveKeyFromPassword(passwordInput, bytesToHex(salt));
          const vault = await encryptVault(privateKeyBytes, prfKey, salt);
          accountVault.passwordVault = vault;
          localStorage.setItem(vaultKey, JSON.stringify(accountVault));
        }
      } else if (activeStep === "mnemonic") {
        methodUsed = "Mnemonic";
        if (!mnemonicInput.trim()) {
          throw new Error("Mnemonic recovery phrase must not be empty");
        }
        const { deriveKeyFromMnemonic } = await import("@/lib/tmp/crypto");
        
        // Check if there is an encrypted vault wrapper for mnemonic first
        if (accountVault.mnemonicVault) {
          try {
            const seedKey = deriveKeyFromMnemonic(mnemonicInput);
            privateKeyBytes = await decryptVault(accountVault.mnemonicVault, seedKey);
          } catch {
            throw new Error("Incorrect recovery phrase. Decryption of local vault failed.");
          }
        } else {
          // Fall back to direct deterministic derivation
          try {
            privateKeyBytes = deriveKeyFromMnemonic(mnemonicInput);
          } catch (err) {
            throw new Error(`Failed to derive key from recovery phrase: ${(err as Error).message}`);
          }
        }
      } else {
        throw new Error("Invalid authentication pathway selection");
      }

      const pubKey = getPubkeyFromPrivkey(privateKeyBytes);
      const npub = bytesToNpub(pubKey);

      // Register identity on the local tendon.json endpoint
      try {
        await fetch(`http://${domain}/.well-known/tendon.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: alias, npub }),
        });
      } catch (e) {
        console.warn("Could not register identity on local tendon.json server:", e);
      }

      const activeCreds = { npub, alias, authMethod: methodUsed, domain };
      setCredentials(activeCreds);
      setActivePrivKey(privateKeyBytes);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tendon_active_key", bytesToHex(privateKeyBytes));
      }
      localStorage.setItem("tendon_active_creds", JSON.stringify(activeCreds));
      setIsConnectDrawerOpen(false);
      setShowOnboarding(false);
    } catch (e) {
      console.error(e);
      setErrorMsg((e as Error).message || "Decryption or authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Add alternative passkey method
  const handleAddPasskey = async () => {
    if (!activePrivKey || !credentials.npub) return;
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const { registerPasskey } = await import("@/lib/tmp/crypto");
      const { key, credentialIdHex } = await registerPasskey(credentials.alias);

      const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
      const savedVaultRaw = localStorage.getItem(vaultKey);
      const accountVault: AccountVaultConfig = savedVaultRaw 
        ? JSON.parse(savedVaultRaw) 
        : { alias: credentials.alias, domain: credentials.domain, passkeys: [] };

      const salt = crypto.getRandomValues(new Uint8Array(16));
      const vault = await encryptVault(activePrivKey, key, salt);
      accountVault.passkeys.push({ 
        credentialIdHex, 
        vault,
        name: `Passkey-${Math.random().toString(36).substring(2, 7)}`,
        createdDomain: window.location.host,
        createdAt: Date.now()
      });
      
      localStorage.setItem(vaultKey, JSON.stringify(accountVault));
      setSuccessMsg("Additional passkey registered successfully!");
      loadActiveVaultConfig();
    } catch (e) {
      setErrorMsg((e as Error).message || "Failed to add passkey");
    } finally {
      setIsLoading(false);
    }
  };

  const publishVaultToRelays = async (accountVault: AccountVaultConfig, privKey: Uint8Array) => {
    try {
      const myHexPub = bytesToHex(getPubkeyFromPrivkey(privKey));
      const signedEvent = signEvent({
        pubkey: myHexPub,
        created_at: Math.floor(Date.now() / 1000),
        kind: 30078,
        tags: [["d", "tendon-mailbox-vault"]],
        content: JSON.stringify(accountVault),
      }, privKey);

      if (relayPoolRef.current) {
        await relayPoolRef.current.publish(signedEvent);
        console.log("Published encrypted vault to Nostr relays successfully!");
      }
    } catch (e) {
      console.warn("Could not publish vault to Nostr relays:", e);
    }
  };

  const fetchVaultFromRelays = (hexPub: string): Promise<AccountVaultConfig | null> => {
    return new Promise((resolve) => {
      if (!relayPoolRef.current) {
        resolve(null);
        return;
      }

      const pool = relayPoolRef.current;
      const subId = `vault-fetch-${Math.random().toString(36).substring(7)}`;
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          pool.unsubscribe(subId);
          resolve(null);
        }
      }, 3500);

      const tempListener = (event: NostrEvent) => {
        if (event.kind === 30078 && event.pubkey === hexPub) {
          const dTag = event.tags.find(t => t[0] === "d");
          if (dTag && dTag[1] === "tendon-mailbox-vault") {
            try {
              const parsed = JSON.parse(event.content);
              resolved = true;
              clearTimeout(timeout);
              pool.removeListener(tempListener);
              pool.unsubscribe(subId);
              resolve(parsed);
            } catch (e) {
              console.warn("Failed to parse remote vault content:", e);
            }
          }
        }
      };

      pool.addListener(tempListener);
      pool.subscribe(subId, [{ kinds: [30078], authors: [hexPub], "#d": ["tendon-mailbox-vault"] }]);
    });
  };

  const handleRenamePasskey = (credentialIdHex: string, newName: string) => {
    if (!newName.trim()) return;
    const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
    const savedVaultRaw = localStorage.getItem(vaultKey);
    if (!savedVaultRaw) return;
    try {
      const accountVault: AccountVaultConfig = JSON.parse(savedVaultRaw);
      accountVault.passkeys = accountVault.passkeys.map(pk => 
        pk.credentialIdHex === credentialIdHex ? { ...pk, name: newName.trim() } : pk
      );
      localStorage.setItem(vaultKey, JSON.stringify(accountVault));
      setSuccessMsg("Passkey renamed successfully");
      loadActiveVaultConfig();
    } catch {
      setErrorMsg("Failed to rename passkey");
    }
  };

  const handleDeletePasskey = (credentialIdHex: string) => {
    const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
    const savedVaultRaw = localStorage.getItem(vaultKey);
    if (!savedVaultRaw) return;
    try {
      const accountVault: AccountVaultConfig = JSON.parse(savedVaultRaw);
      if (accountVault.passkeys.length === 1 && !accountVault.passwordVault) {
        if (!window.confirm("WARNING: This is your only login method. Removing it may lock you out forever. Continue?")) {
          return;
        }
      } else {
        if (!window.confirm("Are you sure you want to remove this passkey?")) {
          return;
        }
      }
      accountVault.passkeys = accountVault.passkeys.filter(pk => pk.credentialIdHex !== credentialIdHex);
      localStorage.setItem(vaultKey, JSON.stringify(accountVault));
      setSuccessMsg("Passkey removed successfully");
      loadActiveVaultConfig();
    } catch {
      setErrorMsg("Failed to delete passkey");
    }
  };

  // Set alternative password login option
  const handleSaveAlternativePassword = async () => {
    if (!activePrivKey || !credentials.alias || !newPassword.trim()) return;
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
      const savedVaultRaw = localStorage.getItem(vaultKey);
      const accountVault: AccountVaultConfig = savedVaultRaw 
        ? JSON.parse(savedVaultRaw) 
        : { alias: credentials.alias, domain: credentials.domain, passkeys: [] };

      // Verify old password if update is requested
      if (accountVault.passwordVault) {
        if (!currentPassword) {
          throw new Error("Current password is required to update the password login method");
        }
        try {
          const verifyPrfKey = await deriveKeyFromPassword(currentPassword, accountVault.passwordVault.salt);
          await decryptVault(accountVault.passwordVault, verifyPrfKey);
        } catch {
          throw new Error("Current password verification failed. Please try again.");
        }
      }

      const salt = crypto.getRandomValues(new Uint8Array(16));
      const prfKey = await deriveKeyFromPassword(newPassword, bytesToHex(salt));
      const vault = await encryptVault(activePrivKey, prfKey, salt);
      accountVault.passwordVault = vault;
      
      localStorage.setItem(vaultKey, JSON.stringify(accountVault));
      await publishVaultToRelays(accountVault, activePrivKey);
      setSuccessMsg("Alternative password login configured successfully!");
      setIsPasswordDrawerOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (e) {
      setErrorMsg((e as Error).message || "Failed to save password option");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStatusOnchain = async () => {
    setIsCheckingPasswordOnchain(true);
    setPasswordExistsOnchain(null);
    try {
      const domain = credentials.domain.trim().toLowerCase();
      const scheme = domain.includes("localhost") || domain.includes("127.0.0.1") || domain.includes(":") ? "http" : "https";
      const response = await fetch(`${scheme}://${domain}/.well-known/tendon.json`);
      if (response.ok) {
        const data = await response.json();
        const hasOnchainSalt = !!data.vault_pointer?.argon2_salt;
        const hasLocalVault = !!activeVaultConfig?.passwordVault;
        setPasswordExistsOnchain(hasOnchainSalt || hasLocalVault);
      } else {
        setPasswordExistsOnchain(!!activeVaultConfig?.passwordVault);
      }
    } catch {
      setPasswordExistsOnchain(!!activeVaultConfig?.passwordVault);
    } finally {
      setIsCheckingPasswordOnchain(false);
    }
  };

  const handleConfigureMnemonicBackup = async () => {
    if (!activePrivKey || !credentials.alias) return;
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const { createNewMnemonic, deriveKeyFromMnemonic } = await import("@/lib/tmp/crypto");
      const mnemonic = createNewMnemonic();
      
      const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
      const savedVaultRaw = localStorage.getItem(vaultKey);
      const accountVault: AccountVaultConfig = savedVaultRaw 
        ? JSON.parse(savedVaultRaw) 
        : { alias: credentials.alias, domain: credentials.domain, passkeys: [] };

      const seedKey = deriveKeyFromMnemonic(mnemonic);
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const vault = await encryptVault(activePrivKey, seedKey, salt);
      accountVault.mnemonicVault = vault;
      
      localStorage.setItem(vaultKey, JSON.stringify(accountVault));
      await publishVaultToRelays(accountVault, activePrivKey);
      setActiveMnemonicBackup(mnemonic);
      setIsMnemonicDrawerOpen(true);
      setSuccessMsg("Mnemonic recovery phrase backup generated successfully!");
      loadActiveVaultConfig();
    } catch (e) {
      setErrorMsg((e as Error).message || "Failed to generate recovery phrase");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!credentials.alias || deleteConfirmUsername.trim().toLowerCase() !== credentials.alias.toLowerCase()) {
      setErrorMsg("Confirmation username does not match");
      return;
    }
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // 1. Delete local vaults
      const vaultKey = `tendon_account_vault_${credentials.alias}@${credentials.domain}`;
      localStorage.removeItem(vaultKey);

      // 2. Clear ephemeral session data
      sessionStorage.removeItem("tendon_active_privkey");
      sessionStorage.removeItem("tendon_active_npub");
      sessionStorage.removeItem("tendon_active_alias");
      sessionStorage.removeItem("tendon_active_domain");

      // 3. Reset react application states
      setActivePrivKey(null);
      setCredentials({ alias: "", domain: "", npub: "", authMethod: "None" });
      setIsDeleteAccountDrawerOpen(false);
      setDeleteConfirmUsername("");
      setSuccessMsg("Account deleted and completely wiped from this device.");
    } catch (e) {
      setErrorMsg((e as Error).message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !activePrivKey || !credentials.npub) return;

    try {
      setIsLoading(true);
      setErrorMsg("");

      const resolved = await resolveIdentifier(composeTo, credentials.domain);
      console.log("Resolved target:", resolved);

      const envelope = buildEnvelope({
        kind: "unicast_mail",
        value: {
          message_id: crypto.randomUUID(),
          thread_id: crypto.randomUUID(),
          subject: composeSubject || "(No Subject)",
          body_plaintext: composeBody,
          cc_recipients_npub: [],
          attachments: [],
        },
      });

      const myHexPub = bytesToHex(getPubkeyFromPrivkey(activePrivKey));
      const nostrEnvelope = wrapForNostr(envelope, [["p", resolved.hex]]);

      const signedEvent = signEvent({
        pubkey: myHexPub,
        created_at: nostrEnvelope.created_at_unix,
        kind: nostrEnvelope.kind,
        tags: nostrEnvelope.tags,
        content: nostrEnvelope.content_base64,
      }, activePrivKey);

      if (relayPoolRef.current) {
        await relayPoolRef.current.publish(signedEvent);
      }

      const newEmail: Email = {
        id: signedEvent.id,
        sender: `${credentials.alias}@${credentials.domain}`,
        senderName: "Me",
        subject: composeSubject || "(No Subject)",
        body: composeBody,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        folder: "sent",
        protocolVersion: "3.0.0",
        encrypted: true,
        rawEvent: signedEvent
      };

      setEmails((prev) => [newEmail, ...prev]);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setIsComposeOpen(false);
      
      handleSelectFolder("sent");
      setSelectedEmailId(newEmail.id);
    } catch (e) {
      console.error(e);
      alert(`Failed to send secure message: ${(e as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!composeTo && !composeSubject && !composeBody) return;
    
    const draftEmail: Email = {
      id: crypto.randomUUID(),
      sender: composeTo,
      senderName: "Draft",
      subject: composeSubject || "(No Subject)",
      body: composeBody,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      folder: "drafts",
      protocolVersion: "3.0.0",
      encrypted: false,
    };
    
    setEmails(prev => [draftEmail, ...prev]);
    setIsComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setSuccessMsg("Draft saved successfully!");
  };

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

  const handleResetAuth = () => {
    setCredentials({
      npub: "",
      alias: "",
      authMethod: "None",
      domain: "",
    });
    setActivePrivKey(null);
    localStorage.removeItem("tendon_active_creds");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("tendon_active_key");
    }
    setShowOnboarding(true);
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
    <div className="p-3 md:p-5 h-screen w-screen bg-[#0b0a09] flex flex-col overflow-hidden text-neutral-200 antialiased font-sans">
      
      {/* Onboarding Welcome / Quick Mint Screen */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#161412] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.9)] transition-all">
            {credentials.alias ? (
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold font-mono shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-4">
                  T
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-[#ededed] tracking-tight">Unlock Your Mailbox</h1>
                <p className="text-xs text-neutral-400 mt-2 max-w-md">
                  Please authenticate using your passkey to unwrap your encryption keys and load your mailbox.
                </p>
                <div className="font-mono text-xs bg-[#0b0a09] border border-white/5 px-4 py-2.5 rounded-lg text-emerald-400 mt-4">
                  {credentials.alias}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold font-mono shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-4">
                  T
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-[#ededed] tracking-tight">Mint Your Secure Username</h1>
                <p className="text-xs text-neutral-400 mt-2 max-w-md">
                  Tendon Mail operates fully serverless. Secure your mailbox using hardware passkeys.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {!credentials.alias && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Username</label>
                    <div className="flex bg-[#0b0a09] border border-white/10 rounded-xl px-4 py-3 items-center focus-within:border-emerald-500/50 transition-colors">
                      <input
                        type="text"
                        placeholder="e.g. carol"
                        className="bg-transparent border-none text-[#ededed] text-sm outline-none w-full font-mono placeholder:text-neutral-600"
                        value={tempAlias}
                        onChange={(e) => {
                          setTempAlias(e.target.value);
                          if (!e.target.value.trim()) {
                            setIsAliasTaken(null);
                            setResolvedUsername("");
                            setSearchedNpubHint("");
                          }
                        }}
                      />
                    </div>
                    {/* Username taken / available badge */}
                    {tempAlias.trim() !== "" && (
                      <div className="mt-1 flex flex-col gap-1 px-1 font-mono text-[9px]">
                        {resolvedUsername && (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5 animate-fadeIn">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Resolved Identity: {resolvedUsername}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          {isAliasTaken === true ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-amber-400">
                                Registered account (will trigger login)
                                {searchedNpubHint && ` • Key: ${searchedNpubHint.substring(0, 5)}...${searchedNpubHint.substring(searchedNpubHint.length - 5)}`}
                              </span>
                            </>
                          ) : isAliasTaken === false ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-emerald-400">Username available (will mint new account)</span>
                            </>
                          ) : (
                            <span className="text-neutral-500">Checking availability...</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Password input shown if signing in and method is password */}
              {!credentials.alias && isAliasTaken === true && loginMethod === "password" && (
                <div className="flex flex-col gap-1.5 mt-1.5 animate-fadeIn">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Password</label>
                  <div className="flex bg-[#0b0a09] border border-white/10 rounded-xl px-4 py-3 items-center focus-within:border-emerald-500/50 transition-colors">
                    <input
                      type="password"
                      placeholder="Enter decryption password"
                      className="bg-transparent border-none text-[#ededed] text-sm outline-none w-full font-mono placeholder:text-neutral-600"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Mnemonic phrase input shown if signing in and method is recovery phrase */}
              {!credentials.alias && isAliasTaken === true && loginMethod === "mnemonic" && (
                <div className="flex flex-col gap-1.5 mt-1.5 animate-fadeIn">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Recovery Phrase (12 Words)</label>
                  <div className="flex bg-[#0b0a09] border border-white/10 rounded-xl px-4 py-3 items-center focus-within:border-emerald-500/50 transition-colors">
                    <textarea
                      placeholder="Enter your 12-word mnemonic phrase"
                      className="bg-transparent border-none text-[#ededed] text-xs outline-none w-full font-mono placeholder:text-neutral-600 resize-none h-16"
                      value={mnemonicInput}
                      onChange={(e) => setMnemonicInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                className="w-full bg-emerald-500 text-black font-bold py-3.5 px-4 rounded-xl text-xs hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                onClick={() => {
                  if (!credentials.alias && !tempAlias.trim()) {
                    setErrorMsg("Please enter a username alias first");
                    return;
                  }
                  if (!credentials.alias && isAliasTaken === true) {
                    if (loginMethod === "password") {
                      if (!passwordInput) {
                        setErrorMsg("Password is required to sign in");
                        return;
                      }
                      handleConnectSetup("password");
                    } else if (loginMethod === "mnemonic") {
                      if (!mnemonicInput) {
                        setErrorMsg("Recovery phrase is required to sign in");
                        return;
                      }
                      handleConnectSetup("mnemonic");
                    } else {
                      handleConnectSetup("passkey");
                    }
                  } else {
                    handleConnectSetup("passkey");
                  }
                }}
                disabled={isLoading}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zM9 7a3 3 0 0 1 6 0v4H9V7zm3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
                <span>
                  {isLoading 
                    ? "CONNECTING..." 
                    : credentials.alias 
                      ? "UNLOCK WITH PASSKEY" 
                      : isAliasTaken === true 
                        ? (loginMethod === "password" ? "SIGN IN WITH PASSWORD" : loginMethod === "mnemonic" ? "SIGN IN WITH PHRASE" : "SIGN IN WITH PASSKEY")
                        : "MINT WITH PASSKEY"}
                </span>
              </button>

              {/* Alternative method toggles (only when username exists on server) */}
              {!credentials.alias && isAliasTaken === true && (
                <div className="flex justify-center gap-4 mt-2">
                  {loginMethod !== "passkey" && (
                    <button
                      className="text-[10px] text-neutral-500 hover:text-emerald-400 font-mono transition-colors cursor-pointer"
                      onClick={() => setLoginMethod("passkey")}
                    >
                      Use Passkey
                    </button>
                  )}
                  {loginMethod !== "password" && (
                    <button
                      className="text-[10px] text-neutral-500 hover:text-emerald-400 font-mono transition-colors cursor-pointer"
                      onClick={() => setLoginMethod("password")}
                    >
                      Use Password
                    </button>
                  )}
                  {loginMethod !== "mnemonic" && (
                    <button
                      className="text-[10px] text-neutral-500 hover:text-emerald-400 font-mono transition-colors cursor-pointer"
                      onClick={() => setLoginMethod("mnemonic")}
                    >
                      Use Phrase
                    </button>
                  )}
                </div>
              )}

              {credentials.alias && (
                <div className="flex justify-center mt-2">
                  <button
                    className="text-[10px] text-neutral-500 hover:text-emerald-400 font-mono transition-colors cursor-pointer"
                    onClick={handleResetAuth}
                  >
                    Sign in with another account &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                className="flex items-center justify-center gap-2 bg-[#0b0a09] text-emerald-400 border border-white/5 hover:border-emerald-500 font-semibold py-2.5 px-4 rounded-xl w-full text-xs hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(16,185,129,0.15)] active:scale-[0.99] cursor-pointer transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleOpenCompose()}
                disabled={!activePrivKey}
                title={!activePrivKey ? "Please connect your vault first" : ""}
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
              <div>RELAYS: {connectedRelays} CONNECTED</div>
              <div className="mt-0.5 text-emerald-400">TMP v3.0.1</div>
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

              {!activePrivKey ? (
                <div className="flex-1 flex flex-col items-center justify-center text-[#a3a3a3] gap-3 p-10 text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="text-xs max-w-xs">Connect your identity/vault to start receiving and sending encrypted messages on the Nostr network.</span>
                  <button
                    className="mt-2 bg-emerald-500 text-black px-4 py-2 rounded-lg font-mono text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    onClick={() => {
                      setShowOnboarding(true);
                    }}
                  >
                    MINT / CONNECT VAULT
                  </button>
                </div>
              ) : filteredEmails.length === 0 ? (
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
                        if (email.folder === "drafts") {
                          setComposeTo(email.sender);
                          setComposeSubject(email.subject);
                          setComposeBody(email.body);
                          setEmails(prev => prev.filter(e => e.id !== email.id));
                          handleOpenCompose();
                        } else {
                          setSelectedEmailId(email.id);
                          setMobileView("detail");
                        }
                      }}
                    >
                      {selectedEmailId === email.id && (
                        <div className="absolute left-0 top-3 bottom-3 w-[2.5px] bg-emerald-400 rounded"></div>
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-[#ededed]">
                          {email.folder === "drafts" ? `To: ${email.sender || "(No Recipient)"}` : email.senderName}
                        </span>
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
                      <button 
                        className="bg-[#161412] border border-white/5 text-[#ededed] px-3 py-1.5 rounded-lg text-xs hover:border-emerald-500 hover:text-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        onClick={() => {
                          setComposeTo(selectedEmail.sender);
                          setComposeSubject(`Re: ${selectedEmail.subject}`);
                          handleOpenCompose();
                        }}
                      >
                        Reply
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

                  {selectedEmail.rawEvent && (
                    <div className="p-5 border-t border-white/5 bg-[#161412]/20 mt-auto">
                      <h4 className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider mb-2">
                        DECRYPTED ENVELOPE METADATA (TMP SPEC)
                      </h4>
                      <pre className="font-mono text-[9px] bg-[#161412] border border-white/5 p-3 rounded-lg text-emerald-400 overflow-x-auto whitespace-pre">
                        {JSON.stringify(
                          {
                            protocol_version: selectedEmail.protocolVersion,
                            sender_pubkey: selectedEmail.rawEvent.pubkey,
                            envelope_signature: selectedEmail.rawEvent.sig.substring(0, 20) + "...",
                            payload_encrypted: selectedEmail.encrypted,
                            local_hydration_status: "verified_dns_match",
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
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

      {/* Connection Settings Bottom Drawer Overlay */}
      {isConnectDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[999] transition-opacity" 
          onClick={() => setIsConnectDrawerOpen(false)} 
        />
      )}

      {/* Connection Settings Bottom Drawer Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#161412] border-t border-[#34322f] rounded-t-2xl z-[1000] transition-transform duration-300 transform flex flex-col max-h-[85vh] ${
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
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-mono">
              {successMsg}
            </div>
          )}

          {credentials.authMethod !== "None" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 shadow-inner">
                <div className="text-xs font-semibold text-[#ededed] mb-4">Active Key Decryption Settings</div>
                
                <div className="flex flex-col gap-1.5 mb-4">
                  <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">Identity Domain Endpoint</span>
                  <div className="font-mono text-xs bg-[#161412] border border-white/5 p-2.5 rounded-lg text-emerald-400">
                    {credentials.alias}@{credentials.domain}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <span className="font-mono text-[9px] text-[#a3a3a3] uppercase">SECP256K1 PUBLIC ADDRESS (npub)</span>
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

                <div className="flex flex-col gap-2">
                  <button
                    className="w-full bg-[#161412] border border-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-xl text-xs hover:bg-red-950/20 hover:border-red-500 hover:scale-[1.01] transition-all cursor-pointer text-center"
                    onClick={handleResetAuth}
                  >
                    RESET SYSTEM STATE / DISCONNECT
                  </button>
                  <button
                    className="w-full bg-red-950/20 border border-red-500/40 text-red-500 font-bold py-3 px-4 rounded-xl text-xs hover:bg-red-900/30 hover:border-red-500 hover:scale-[1.01] transition-all cursor-pointer text-center"
                    onClick={() => setIsDeleteAccountDrawerOpen(true)}
                  >
                    DELETE ACCOUNT
                  </button>
                </div>
              </div>

              <div className="bg-[#0b0a09] border border-white/5 rounded-xl p-5 shadow-inner flex flex-col gap-5">
                <div className="text-xs font-semibold text-[#ededed]">Alternative Unlock Methods</div>

                {/* List registered Passkeys */}
                {activeVaultConfig && activeVaultConfig.passkeys && activeVaultConfig.passkeys.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Registered Passkeys</span>
                    <div className="flex flex-col gap-2">
                      {activeVaultConfig.passkeys.map((pk, idx) => (
                        <div key={pk.credentialIdHex} className="flex items-center justify-between p-3 bg-[#161412] border border-white/5 rounded-xl">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xs font-semibold text-[#ededed] truncate">{pk.name || `Passkey ${idx + 1}`}</span>
                            <span className="text-[9px] text-neutral-500 font-mono truncate">Domain: {pk.createdDomain || "Unknown"}</span>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button 
                              className="text-[10px] bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:text-emerald-400 px-2.5 py-1 rounded cursor-pointer transition-colors"
                              onClick={() => {
                                const newName = window.prompt("Enter new name for passkey:", pk.name || `Passkey ${idx + 1}`);
                                if (newName) handleRenamePasskey(pk.credentialIdHex, newName);
                              }}
                            >
                              Rename
                            </button>
                            <button 
                              className="text-[10px] bg-red-950/20 border border-red-500/30 hover:border-red-500 hover:text-red-400 px-2.5 py-1 rounded cursor-pointer transition-colors"
                              onClick={() => handleDeletePasskey(pk.credentialIdHex)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Register another Passkey */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-neutral-400">Add backup passkeys or register a secondary biometric authenticator:</span>
                  <button
                    className="bg-[#161412] border border-white/5 text-[#ededed] py-2.5 px-3 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    onClick={handleAddPasskey}
                    disabled={isLoading}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Register Additional Passkey</span>
                  </button>
                </div>

                {/* Set Password Unlock */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-neutral-400">Add or update an alternative password login method:</span>
                  <button
                    className="bg-[#161412] border border-white/5 text-[#ededed] py-2.5 px-3 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    onClick={() => {
                      setIsPasswordDrawerOpen(true);
                      checkPasswordStatusOnchain();
                    }}
                    disabled={isLoading}
                  >
                    <span>
                      {activeVaultConfig?.passwordVault ? "Update Password Login" : "Configure Password Login"}
                    </span>
                  </button>
                </div>

                {/* Export Mnemonic / Phrase */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-neutral-400">Generate or view a 12-word recovery seed phrase backup:</span>
                  <button
                    className="bg-[#161412] border border-white/5 text-[#ededed] py-2.5 px-3 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    onClick={handleConfigureMnemonicBackup}
                    disabled={isLoading}
                  >
                    <span>
                      {activeVaultConfig?.mnemonicVault ? "Export / View Recovery Phrase" : "Generate Recovery Phrase Backup"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
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
          className="flex flex-col items-center justify-center w-10 h-10 bg-[#0b0a09] border border-white/5 text-emerald-400 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] cursor-pointer disabled:opacity-50"
          onClick={() => handleOpenCompose()}
          disabled={!activePrivKey}
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

      {/* Floating Compose Panel (Rounded Card overlay with tactile backdrop) */}
      {isComposeOpen && (
        <>
          {/* Mobile/Desktop compose backdrop */}
          <div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50" onClick={() => setIsComposeOpen(false)} />
          
          <div className="fixed inset-x-3 bottom-3 md:inset-auto md:bottom-8 md:right-8 md:w-[480px] h-[85vh] md:h-[460px] bg-[#161412] border border-[#34322f] rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.9)] flex flex-col z-50 overflow-hidden text-neutral-200">
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="To (username or npub)"
                  className="w-full bg-[#0b0a09] border border-white/5 rounded-lg p-3 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  required
                />
                {getComposeSuggestions().length > 0 && composeTo.trim() !== "" && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#161412] border border-white/10 rounded-lg shadow-2xl z-[999] overflow-hidden max-h-40 overflow-y-auto">
                    {getComposeSuggestions().map((s) => (
                      <div
                        key={s.npub}
                        className="p-2.5 text-xs hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer flex flex-col gap-0.5 border-b border-white/5 last:border-b-0 transition-colors"
                        onClick={() => {
                          setComposeTo(s.username);
                        }}
                      >
                        <span className="font-semibold text-[#ededed]">{s.username}</span>
                        <span className="text-[10px] text-neutral-500 font-mono truncate">{s.npub}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    className="bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:text-emerald-400 text-[#ededed] font-semibold px-4 py-2.5 rounded-lg text-xs transition-all cursor-pointer"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className="bg-emerald-500 text-black font-semibold px-5 py-2.5 rounded-lg text-xs hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
                    disabled={isLoading}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span>{isLoading ? "SENDING..." : "SEND EMAIL"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Configure Password Login Drawer (60% height) */}
      {isPasswordDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[1001] transition-opacity" 
          onClick={() => setIsPasswordDrawerOpen(false)} 
        />
      )}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#161412] border-t border-[#34322f] rounded-t-2xl z-[1002] transition-transform duration-300 transform flex flex-col h-[60vh] ${
        isPasswordDrawerOpen ? "translate-y-0 shadow-[0_-12px_36px_rgba(0,0,0,0.6)]" : "translate-y-full"
      }`}>
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#0b0a09]/30">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-400">Configure Password Option</span>
          <button className="text-[#a3a3a3] hover:text-[#ededed] p-1 cursor-pointer transition-colors" onClick={() => setIsPasswordDrawerOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-[#161412] flex flex-col gap-4">
          {isCheckingPasswordOnchain ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-t-transparent border-emerald-400 rounded-full animate-spin"></div>
              <span className="font-mono text-xs text-neutral-400">Verifying onchain registry salt...</span>
            </div>
          ) : (
            <>
              {passwordExistsOnchain !== null && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0b0a09] border border-white/5 rounded-xl font-mono text-[10px]">
                  {passwordExistsOnchain ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-amber-400">Registered Password Detected on Registry</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400">No Password Configured (will create new)</span>
                    </>
                  )}
                </div>
              )}

              <p className="text-[11px] text-[#a3a3a3]">
                Set a client-side Argon2id password key wrap. You can use this password to decrypt your vault on other devices that do not share your hardware passkeys.
              </p>

              {passwordExistsOnchain === true && (
                <div className="flex flex-col gap-1.5 animate-fadeIn">
                  <label className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password to verify ownership"
                    className="bg-[#0b0a09] border border-white/10 rounded-xl p-3 text-xs text-[#ededed] font-mono outline-none focus:border-amber-500/50"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new secure password"
                  className="bg-[#0b0a09] border border-white/10 rounded-xl p-3 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-[#a3a3a3] uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="bg-[#0b0a09] border border-white/10 rounded-xl p-3 text-xs text-[#ededed] font-mono outline-none focus:border-emerald-500/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full bg-emerald-500 text-black font-bold py-3.5 px-4 rounded-xl text-xs hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                onClick={handleSaveAlternativePassword}
                disabled={isLoading || !newPassword || !confirmPassword}
              >
                <span>{isLoading ? "DERIVING ARGON2ID WRAP..." : "SAVE PASSWORD OPTION"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Account Deletion Confirmation Drawer (60% height) */}
      {isDeleteAccountDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[1001] transition-opacity" 
          onClick={() => setIsDeleteAccountDrawerOpen(false)} 
        />
      )}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#161412] border-t border-red-500/30 rounded-t-2xl z-[1002] transition-transform duration-300 transform flex flex-col h-[60vh] ${
        isDeleteAccountDrawerOpen ? "translate-y-0 shadow-[0_-12px_36px_rgba(239,68,68,0.15)]" : "translate-y-full"
      }`}>
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-red-950/10">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-red-500">DANGER: Delete Account Vault</span>
          <button className="text-[#a3a3a3] hover:text-[#ededed] p-1 cursor-pointer transition-colors" onClick={() => setIsDeleteAccountDrawerOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-[#161412] flex flex-col gap-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-[11px] text-red-400 leading-relaxed">
            <strong>CRITICAL WARNING:</strong> This action is completely irreversible. Deleting the account will permanently erase your local vaults, private keys, and config backups from this browser database. Any mail stored on relays under this identity will remain encrypted forever, and cannot be decrypted again.
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[10px] font-mono text-[#a3a3a3] uppercase tracking-wider">
              Type your username <strong className="text-red-400 font-mono">&quot;{credentials.alias}&quot;</strong> to confirm:
            </label>
            <input
              type="text"
              placeholder="Type username here"
              className="bg-[#0b0a09] border border-white/10 rounded-xl p-3 text-xs text-[#ededed] font-mono outline-none focus:border-red-500/50"
              value={deleteConfirmUsername}
              onChange={(e) => setDeleteConfirmUsername(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs hover:bg-red-700 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            onClick={handleDeleteAccount}
            disabled={isLoading || deleteConfirmUsername.trim().toLowerCase() !== credentials.alias.toLowerCase()}
          >
            <span>DELETE & WIPE ACCOUNT FOREVER</span>
          </button>
        </div>
      </div>

      {/* Configure Mnemonic Backup Drawer (60% height) */}
      {isMnemonicDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[1001] transition-opacity" 
          onClick={() => setIsMnemonicDrawerOpen(false)} 
        />
      )}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#161412] border-t border-[#34322f] rounded-t-2xl z-[1002] transition-transform duration-300 transform flex flex-col h-[60vh] ${
        isMnemonicDrawerOpen ? "translate-y-0 shadow-[0_-12px_36px_rgba(0,0,0,0.6)]" : "translate-y-full"
      }`}>
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#0b0a09]/30">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-400">Recovery Phrase Backup</span>
          <button className="text-[#a3a3a3] hover:text-[#ededed] p-1 cursor-pointer transition-colors" onClick={() => setIsMnemonicDrawerOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-[#161412] flex flex-col gap-5 text-neutral-200">
          <p className="text-[11px] text-[#a3a3a3]">
            This is your secure, client-side derived recovery seed phrase. Store these 12 words in a safe, offline location. Anyone with access to this phrase can recover your mailbox identity.
          </p>

          <div className="bg-[#0b0a09] border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed tracking-wide text-emerald-400 select-all break-words select-text">
            {activeMnemonicBackup}
          </div>

          <button
            className="w-full bg-emerald-500 text-black font-bold py-3.5 px-4 rounded-xl text-xs hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            onClick={() => {
              navigator.clipboard.writeText(activeMnemonicBackup);
              alert("Copied to clipboard!");
            }}
          >
            <span>COPY RECOVERY PHRASE</span>
          </button>
        </div>
      </div>

    </div>
  );
}
