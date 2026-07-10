"use strict";

import { createClient } from "microqr"

// This will be our built-in JWT-based auth solution
const SECRET_KEY = "congosoles-secret-key-dev-2026"

// Simple JWT implementation (no heavy dependencies)
function signToken(payload: any, expiresIn: number = 24 * 60 * 60): string {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Date.now()
  const exp = now + expiresIn * 1000

  const token = {
    h: btoa(JSON.stringify(header)),
    p: btoa(JSON.stringify({ ...payload, exp })),
    s: await hash(`${header}h${payload}exp${exp}` + SECRET_KEY)
  }

  return `${token.h}.${token.p}.${token.s}`
}

function verifyToken(token: string): any {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) throw new Error("Invalid token")

    const [headerB64, payloadB64, signature] = parts
    const payload = JSON.parse(atob(payloadB64))

    if (payload.exp < Date.now()) {
      throw new Error("Token expired")
    }

    const expectedSig = await hash(`${headerB64}.${payloadB64}` + SECRET_KEY)
    if (signature !== expectedSig) throw new Error("Invalid signature")

    return payload
  } catch (e) {
    console.error("Token verification failed:", e)
    throw new Error("Invalid token")
  }
}

async function hash(data: string): Promise<string> {
  // Simple SHA-256 alternative for demo
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

function generatePassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export { signToken, verifyToken, generatePassword }
