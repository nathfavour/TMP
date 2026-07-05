import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { schnorr } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";

export const dynamic = "force-dynamic";

const DIRECTORY_FILE = path.join(process.cwd(), "tendon_directory.json");

const DOMAIN_PRIV_KEY = new Uint8Array([
  0xdb, 0x4a, 0x1f, 0x22, 0xc1, 0x5a, 0xd0, 0x76, 0xa3, 0xf6, 0x1e, 0x8b, 0x3d, 0x2c, 0xb9, 0xf1,
  0x07, 0x4d, 0x93, 0x11, 0x1d, 0xe4, 0x78, 0x29, 0x11, 0x87, 0x50, 0x4d, 0xa4, 0x5f, 0x9d, 0x01
]);
const DOMAIN_PUB_KEY = Buffer.from(schnorr.getPublicKey(DOMAIN_PRIV_KEY)).toString("hex");

function signVerification(username: string, npub: string): string {
  const encoder = new TextEncoder();
  const hash = sha256(encoder.encode(username + ":" + npub));
  const signature = schnorr.sign(hash, DOMAIN_PRIV_KEY);
  return Buffer.from(signature).toString("hex");
}

function readDirectory(): Record<string, string> {
  try {
    if (fs.existsSync(DIRECTORY_FILE)) {
      const content = fs.readFileSync(DIRECTORY_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Failed to read directory file:", e);
  }
  return {
    "nathfavour": "npub17x6p2q9m6a5s8d3f8g0h2j4k6l8m9n0p2q4r6s8t0u2v4w6x8y0szqpq2a" // fallback placeholder
  };
}

function writeDirectory(dir: Record<string, string>) {
  try {
    fs.writeFileSync(DIRECTORY_FILE, JSON.stringify(dir, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write directory file:", e);
  }
}

export async function GET() {
  const names = readDirectory();
  const names_v31: Record<string, { npub: string; signature: string }> = {};
  for (const [username, npub] of Object.entries(names)) {
    names_v31[username] = {
      npub,
      signature: signVerification(username, npub)
    };
  }

  return NextResponse.json({
    names,
    names_v31,
    domain_pubkey: DOMAIN_PUB_KEY,
    vault_pointer: {
      relays: [
        "wss://relay.damus.io",
        "wss://nos.lol",
        "wss://relay.nostr.band"
      ]
    }
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}

export async function POST(request: Request) {
  try {
    const { username, npub } = await request.json();
    if (!username || !npub) {
      return NextResponse.json({ error: "Missing username or npub" }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const dir = readDirectory();
    dir[cleanUsername] = npub.trim();
    writeDirectory(dir);

    return NextResponse.json({ success: true, registered: { [cleanUsername]: npub } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const dir = readDirectory();
    if (dir[cleanUsername]) {
      delete dir[cleanUsername];
      writeDirectory(dir);
      return NextResponse.json({ success: true, message: `Username ${cleanUsername} deleted` });
    }
    return NextResponse.json({ error: "Username not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
