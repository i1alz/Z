// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════════
export const SB = "https://rgbzximweiafgdukppbf.supabase.co"
export const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnp4aW13ZWlhZmdkdWtwcGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDU5MDcsImV4cCI6MjA4ODYyMTkwN30.fMGcuP-E2mxG_LHCq4TLaI8087pi17oIMoQuNlNspUs"

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════
export const C = {
  bg:       "#06080f",
  surface:  "#0c1019",
  surface2: "#121827",
  surface3: "#1a2236",
  border:   "#1c2540",
  borderHi: "#2a3a5a",
  gold:     "#c8a044",
  goldLt:   "#e0be5c",
  goldDk:   "#a07828",
  goldBg:   "rgba(200,160,68,0.10)",
  goldBg2:  "rgba(200,160,68,0.06)",
  text:     "#e2e8f4",
  textSec:  "#9aa8c4",
  muted:    "#536080",
  blue:     "#4a90d9",
  blueBg:   "rgba(74,144,217,0.10)",
  green:    "#34d399",
  greenBg:  "rgba(52,211,153,0.10)",
  orange:   "#f59e0b",
  orangeBg: "rgba(245,158,11,0.10)",
  red:      "#ef4444",
  redBg:    "rgba(239,68,68,0.10)",
  purple:   "#a78bfa",
  purpleBg: "rgba(167,139,250,0.10)",
  cyan:     "#22d3ee",
  cyanBg:   "rgba(34,211,238,0.10)",
}

// ═══════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════
const hdrs = (token) => ({
  "apikey": KEY,
  "Content-Type": "application/json",
  ...(token && { "Authorization": `Bearer ${token}` })
})

export const api = {
  async signIn(email, password) {
    const r = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: hdrs(null),
      body: JSON.stringify({ email, password })
    })
    return r.json()
  },
  async signOut(token) {
    await fetch(`${SB}/auth/v1/logout`, { method: "POST", headers: hdrs(token) })
  },
  async resetPassword(email) {
    const r = await fetch(`${SB}/auth/v1/recover`, {
      method: "POST", headers: hdrs(null),
      body: JSON.stringify({ email })
    })
    return { ok: r.ok, status: r.status }
  },
  async profile(uid, token) {
    const r = await fetch(`${SB}/rest/v1/profiles?id=eq.${uid}&select=*`, { headers: hdrs(token) })
    const d = await r.json(); return d[0] || null
  },
  async query(table, token, qs = "") {
    const r = await fetch(`${SB}/rest/v1/${table}?select=*${qs}`, { headers: hdrs(token) })
    return r.json()
  },
  async count(table, token) {
    const r = await fetch(`${SB}/rest/v1/${table}?select=id&limit=1`, {
      headers: { ...hdrs(token), "Prefer": "count=exact" }
    })
    return parseInt(r.headers.get("content-range")?.split("/")?.[1] || "0")
  },
  async countTable(table, token, pk = "id") {
    const r = await fetch(`${SB}/rest/v1/${encodeURIComponent(table)}?select=${pk}&limit=1`, {
      headers: { ...hdrs(token), "Prefer": "count=exact" }
    })
    return parseInt(r.headers.get("content-range")?.split("/")?.[1] || "0")
  }
}
