import ReactLenis from "lenis/react"
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"
import Services from "./sections/Services"
import ServiceSummary from "./sections/ServiceSummary"
import About from "./sections/About"
import Work from "./sections/Work"
import ContactSummary from "./sections/ContactSummary"
import Contact from "./sections/Contact"
import ErrorBoundary from "./ErrorBoundary"
import { useEffect, useState, useRef, useCallback } from "react"
import { Icon } from '@iconify/react'

const TARGET = "EVOLVE"
const TEXT_SYMBOLS = ["#", "$", "*", "@", "&"]

const ICON_DEFS = [
  { key: "android", el: <Icon icon="qlementine-icons:android-24"  width="78" height="78" /> },
  { key: "tux",     el: <Icon icon="famicons:logo-tux"             width="78" height="78" /> },
  { key: "java",    el: <Icon icon="fluent-mdl2:java-logo"         width="78" height="78" /> },
  { key: "react",   el: <Icon icon="ion:logo-react"                width="78" height="78" /> },
  { key: "github",  el: <Icon icon="tdesign:logo-github"           width="78" height="78" /> },
  { key: "python",  el: <Icon icon="ion:logo-python"               width="78" height="78" /> },
  { key: "cypher",  el: <Icon icon="token:cypherock"               width="78" height="78" /> },
]

const POOL = [
  ...ICON_DEFS.map(d => ({ type: "icon", key: d.key })),
  ...ICON_DEFS.map(d => ({ type: "icon", key: d.key })),
  ...ICON_DEFS.map(d => ({ type: "icon", key: d.key })),
  ...ICON_DEFS.map(d => ({ type: "icon", key: d.key })),
  ...TEXT_SYMBOLS.map(c => ({ type: "text", char: c })),
]

const ICON_MAP = Object.fromEntries(ICON_DEFS.map(d => [d.key, d.el]))
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]

const resolveChar = (entry) => {
  if (!entry) return "@"
  if (typeof entry === "string") return entry
  if (entry.type === "text") return entry.char
  if (entry.type === "icon") return ICON_MAP[entry.key] ?? "@"
  return "@"
}

/* ─────────────────────────────────────────────────────────
   Module-level audio cache — persists across re-renders.
   Keyed by name so we always reuse the SAME Audio element
   that was unlocked during the user gesture.
───────────────────────────────────────────────────────── */
const audioCache = {}

const AUDIO_DEFS = {
  intro:       { src: "/audio/intro.wav",       volume: 0.55 },
  glitch:      { src: "/audio/glitch.wav",       volume: 0.35 },
  buttonclick: { src: "/audio/buttonclick.mp3",  volume: 0.9  },
  hope:        { src: "/audio/hope.mp3",         volume: 0.7  },
}

/* ─────────────────────────────────────────────────────────
   preloadAudio — creates Audio elements and waits for
   canplaythrough (fully buffered). Caches them so the
   same element instance is reused after the gesture unlock.
───────────────────────────────────────────────────────── */
const preloadAudio = () =>
  Promise.all(
    Object.entries(AUDIO_DEFS).map(([key, { src, volume }]) =>
      new Promise((resolve) => {
        if (audioCache[key]) { resolve(); return }
        const audio = new Audio()
        audio.preload = "auto"
        audio.volume  = volume
        audio.src     = src
        const done = () => { audioCache[key] = audio; resolve() }
        audio.addEventListener("canplaythrough", done, { once: true })
        audio.addEventListener("error",          done, { once: true })
        setTimeout(done, 6000)   // safety timeout — never block the app
        audio.load()
      })
    )
  )

/* ─────────────────────────────────────────────────────────
   unlockCachedAudio — MUST be called synchronously inside
   a real user-gesture handler (tap / click / keydown).
   Plays + immediately pauses each element — the only
   reliable way to satisfy iOS Safari's gesture requirement.
───────────────────────────────────────────────────────── */
const unlockCachedAudio = () => {
  Object.values(audioCache).forEach(audio => {
    const p = audio.play()
    if (p !== undefined) {
      p.then(() => {
        audio.pause()
        audio.currentTime = 0
      }).catch(() => {})
    }
  })
  window._audioUnlocked = true
}

/* ─────────────────────────────────────────────────────────
   MobileGate — shown on mobile BEFORE the scramble loader.

   Key audio fix: unlockCachedAudio() is called FIRST,
   synchronously inside handleTap, AND intro starts playing
   right there — before any state update or setTimeout.
   This is the only approach that satisfies iOS Safari's
   strict "play must start in gesture call stack" rule.
───────────────────────────────────────────────────────── */
const MobileGate = ({ onEnter, audioReady }) => {
  const [fade, setFade]       = useState(false)
  const [glitch, setGlitch]   = useState(false)
  const [waiting, setWaiting] = useState(false)

  // Occasional glitch flicker on the lock icon
  useEffect(() => {
    const schedule = () => {
      const delay = 1800 + Math.random() * 2400
      return setTimeout(() => {
        setGlitch(true)
        setTimeout(() => { setGlitch(false); schedule() }, 120 + Math.random() * 80)
      }, delay)
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  const handleTap = () => {
    if (fade) return

    // ── STEP 1: Unlock ALL cached Audio elements synchronously
    //    in the gesture call stack — this is what iOS Safari needs.
    unlockCachedAudio()

    // ── STEP 2: Start intro playing RIGHT NOW, still inside the gesture.
    //    ScrambleLoader will attach to this same already-playing element.
    if (audioCache.intro) {
      audioCache.intro.currentTime = 0
      audioCache.intro.play().catch(() => {})
    }

    if (!audioReady) {
      setWaiting(true)
      return
    }

    setFade(true)
    setTimeout(onEnter, 700)
  }

  // Auto-proceed once audio finishes loading if user already tapped
  useEffect(() => {
    if (waiting && audioReady) {
      setFade(true)
      setTimeout(onEnter, 700)
    }
  }, [waiting, audioReady, onEnter])

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999, background: "#000",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "32px",
      opacity: fade ? 0 : 1, transition: "opacity 0.7s ease",
      pointerEvents: fade ? "none" : "all",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes mgFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mgPulse  { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes mgGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(229,255,71,0)} 50%{box-shadow:0 0 0 8px rgba(229,255,71,0.12)} }
        @keyframes mgSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", animation: "mgFadeUp 0.8s ease both" }}>

        {/* Name */}
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".38em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          Fuoseigha Darwin
        </div>

        {/* Lock icon */}
        <div style={{
          width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${glitch ? "#e5ff47" : "rgba(255,255,255,0.12)"}`,
          transition: "border-color 0.08s",
          filter: glitch ? "drop-shadow(0 0 6px #e5ff47)" : "none",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke={glitch ? "#e5ff47" : "rgba(255,255,255,0.5)"}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.08s" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* Headline */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 8vw, 48px)", letterSpacing: ".12em", color: "#fff", lineHeight: 1.1 }}>
            SITE LOCKED
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginTop: "10px", lineHeight: 2 }}>
            Click to enter decryption password
          </div>
        </div>

        {/* Tap button */}
        <button
          onClick={handleTap}
          disabled={fade}
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".28em",
            textTransform: "uppercase", padding: "16px 40px",
            background: "#e5ff47", color: "#000", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
            marginTop: "8px", transition: "opacity 0.2s",
            animation: "mgGlow 2.4s ease-in-out infinite",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {waiting ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" style={{ animation: "mgSpin 1s linear infinite" }}>
                <circle cx="6" cy="6" r="5" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
                <path d="M6 1A5 5 0 0 1 11 6" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Decrypting...
            </>
          ) : (
            <>
              Tap to Decrypt
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="1" x2="7" y2="11" />
                <polyline points="3,8 7,12 11,8" />
              </svg>
            </>
          )}
        </button>

        {/* Status indicator */}
        {!audioReady && !waiting && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#e5ff47", animation: "mgPulse 1.2s ease-in-out infinite", display: "inline-block" }} />
            Initialising audio
          </div>
        )}
        {audioReady && !waiting && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Systems ready
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   ScrambleLoader

   Audio fix: pulls from audioCache instead of creating
   new Audio() elements. On mobile, intro is already playing
   (started synchronously in MobileGate's handleTap).
   On desktop, we attach an unlock listener and play on
   first gesture — using the same cached element.
───────────────────────────────────────────────────────── */
const ScrambleLoader = ({ onDone, mode = "decrypt" }) => {
  const isEncrypt = mode === "encrypt"
  const [display, setDisplay] = useState(() =>
    Array(TARGET.length).fill(null).map(() => ({ entry: { type: "text", char: "@" }, glitch: false }))
  )
  const [locked, setLocked]     = useState(() => Array(TARGET.length).fill(false))
  const [lockedIcons]           = useState(() => Array(TARGET.length).fill(null).map(() => rand(ICON_DEFS).key))
  const [showBtn, setShowBtn]   = useState(false)
  const [fade, setFade]         = useState(false)
  const lockedRef               = useRef(Array(TARGET.length).fill(false))
  const glitchRef               = useRef(Array(TARGET.length).fill(false))
  const lockedCount             = useRef(0)

  const introAudioRef    = useRef(null)
  const glitchAudioRef   = useRef(null)
  const btnClickAudioRef = useRef(null)

  useEffect(() => {
    // ── Attach to cached elements — do NOT create new Audio() instances.
    //    On mobile these are already unlocked + intro is already playing.
    introAudioRef.current    = audioCache.intro       ?? null
    glitchAudioRef.current   = audioCache.glitch      ?? null
    btnClickAudioRef.current = audioCache.buttonclick ?? null

    if (window._audioUnlocked) {
      // Mobile path: intro already started in MobileGate handleTap — nothing to do.
      // Desktop path (encrypt re-entry): play intro now.
      if (!introAudioRef.current) return
      introAudioRef.current.currentTime = 0
      introAudioRef.current.play().catch(() => {})
      return
    }

    // Desktop first-load path: unlock + play on first gesture.
    const unlockAndPlay = () => {
      if (window._audioUnlocked) return
      unlockCachedAudio()
      if (introAudioRef.current) {
        introAudioRef.current.currentTime = 0
        introAudioRef.current.play().catch(() => {})
      }
      document.removeEventListener("click",    unlockAndPlay)
      document.removeEventListener("keydown",  unlockAndPlay)
      document.removeEventListener("touchend", unlockAndPlay)
    }
    document.addEventListener("click",    unlockAndPlay, { once: true })
    document.addEventListener("keydown",  unlockAndPlay, { once: true })
    document.addEventListener("touchend", unlockAndPlay, { once: true })

    return () => {
      document.removeEventListener("click",    unlockAndPlay)
      document.removeEventListener("keydown",  unlockAndPlay)
      document.removeEventListener("touchend", unlockAndPlay)
      // Pause intro when loader unmounts
      if (introAudioRef.current) {
        introAudioRef.current.pause()
        introAudioRef.current.currentTime = 0
      }
    }
  }, [mode])

  const playGlitchSound = () => {
    try {
      if (!glitchAudioRef.current) return
      // Clone so overlapping glitch sounds don't cut each other off
      const clone = glitchAudioRef.current.cloneNode()
      clone.volume = 0.35
      const p = clone.play()
      if (p !== undefined) p.catch(() => {})
    } catch (e) {}
  }

  useEffect(() => {
    lockedCount.current = 0
    lockedRef.current   = Array(TARGET.length).fill(false)
    glitchRef.current   = Array(TARGET.length).fill(false)
    TARGET.split("").forEach((_, i) => {
      setTimeout(() => {
        lockedRef.current[i] = true
        setLocked(prev => { const n = [...prev]; n[i] = true; return n })
        lockedCount.current += 1
        if (lockedCount.current === TARGET.length) setTimeout(() => setShowBtn(true), 600)
      }, 420 + i * 220)
    })
  }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      setDisplay(prev => prev.map((item, i) => {
        if (lockedRef.current[i] && !glitchRef.current[i]) {
          if (isEncrypt) return { entry: { type: "icon", key: lockedIcons[i] }, glitch: false }
          return { entry: { type: "text", char: TARGET[i] }, glitch: false }
        }
        if (glitchRef.current[i]) return item
        return { entry: rand(POOL), glitch: false }
      }))
    }, 80)
    return () => clearInterval(id)
  }, [mode, isEncrypt, lockedIcons])

  useEffect(() => {
    if (!showBtn) return
    const scheduleGlitch = () => {
      const delay = 700 + Math.random() * 1000
      return setTimeout(() => {
        const idx = Math.floor(Math.random() * TARGET.length)
        if (!lockedRef.current[idx]) { scheduleGlitch(); return }
        playGlitchSound()
        glitchRef.current[idx] = true
        setDisplay(prev => { const n = [...prev]; n[idx] = { entry: rand(POOL), glitch: true }; return n })
        const flickers = Math.random() > 0.4 ? 3 : 2
        let flick = 0
        const flickInterval = setInterval(() => {
          flick++
          setDisplay(prev => { const n = [...prev]; n[idx] = { entry: rand(POOL), glitch: true }; return n })
          if (flick >= flickers) {
            clearInterval(flickInterval)
            setTimeout(() => {
              glitchRef.current[idx] = false
              setDisplay(prev => {
                const n = [...prev]
                n[idx] = isEncrypt
                  ? { entry: { type: "icon", key: lockedIcons[idx] }, glitch: false }
                  : { entry: { type: "text", char: TARGET[idx] }, glitch: false }
                return n
              })
              scheduleGlitch()
            }, 140)
          }
        }, 80)
      }, delay)
    }
    const t = scheduleGlitch()
    return () => clearTimeout(t)
  }, [showBtn, isEncrypt, lockedIcons])

  const handleBtn = () => {
    try {
      const btn = btnClickAudioRef.current
      if (btn) {
        btn.currentTime = 0
        const p = btn.play()
        if (p !== undefined) p.catch(() => {
          // Fallback: fresh element if cached one fails
          const fb = new Audio("/audio/buttonclick.mp3")
          fb.volume = 0.9
          fb.play().catch(() => {})
        })
      }
    } catch (e) {}
    setFade(true)
    setTimeout(onDone, 900)
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999, background: "#000",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "28px", opacity: fade ? 0 : 1, transition: "opacity 0.9s ease",
      pointerEvents: fade ? "none" : "all",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btnIn       { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes arrowBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes glitchFlash { 0%{opacity:1} 40%{opacity:0.3} 100%{opacity:1} }
        @keyframes scanline    { 0%{top:0%} 100%{top:100%} }
      `}</style>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
      }} />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".38em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", animation: "fadeUp 0.8s ease both" }}>
          Fuoseigha Darwin
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(64px, 18vw, 140px)", letterSpacing: ".14em", display: "flex", gap: "0.06em", alignItems: "center", position: "relative" }}>
          {display.map((item, i) => {
            const isIcon = item.entry?.type === "icon"
            const content = resolveChar(item.entry)
            return (
              <span key={i} style={{
                color: locked[i] ? (item.glitch ? "#e5ff47" : (isEncrypt ? "rgba(229,255,71,0.85)" : "#fff")) : "rgba(255,255,255,0.12)",
                transition: item.glitch ? "none" : (locked[i] ? "color 0.22s ease" : "none"),
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: isIcon ? "0.72em" : "0.58em", minHeight: "1em",
                animation: item.glitch ? "glitchFlash 0.09s ease infinite" : "none",
                textShadow: item.glitch ? "0 0 8px #e5ff47, 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5)" : "none",
                filter: item.glitch && isIcon ? "drop-shadow(0 0 6px #e5ff47)" : "none",
                lineHeight: 1,
              }}>{content}</span>
            )
          })}
          {showBtn && (
            <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(229,255,71,0.35)", animation: "scanline 2.8s linear infinite", pointerEvents: "none" }} />
          )}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", animation: "fadeUp 0.8s 0.4s ease both", textAlign: "center", lineHeight: 2 }}>
          {isEncrypt ? "Site encrypted — data secured" : "Premium websites & mobile apps"}
        </div>
        {showBtn && (
          <button onClick={handleBtn} style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".28em",
            textTransform: "uppercase", padding: "14px 36px",
            background: isEncrypt ? "rgba(229,255,71,0.15)" : "#e5ff47",
            color: isEncrypt ? "#e5ff47" : "#000",
            border: isEncrypt ? "1px solid #e5ff47" : "none",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
            animation: "btnIn 0.6s ease both", marginTop: "8px", transition: "opacity 0.2s",
            WebkitTapHighlightColor: "transparent",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {isEncrypt ? "Decrypt" : "Let's Explore"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: "arrowBounce 1.2s ease-in-out infinite" }}>
              <line x1="7" y1="1" x2="7" y2="11" />
              <polyline points="3,8 7,12 11,8" />
            </svg>
          </button>
        )}
        {!showBtn && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.4s ease-in-out infinite", display: "inline-block" }} />
            {isEncrypt ? "Encrypting" : "Decrypting"}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   CorruptedQR — DESKTOP ONLY
───────────────────────────────────────────────────────── */
const QR_GRID = [
  [1,1,1,1,1,1,0],
  [1,0,0,0,1,0,1],
  [1,0,1,0,1,1,0],
  [1,0,0,0,1,0,0],
  [1,1,1,1,1,0,1],
  [0,1,0,0,0,1,0],
  [1,0,1,1,0,0,1],
]

const GLITCH_OFFSETS = [
  [ [-3,-2], [-1,3], [2,-1], [3,2],  [-2,-3], [1,-2], [0,0]  ],
  [ [2,3],  [0,0],  [0,0],  [0,0],  [-3,1],  [0,0],  [3,-2] ],
  [ [-1,2], [0,0],  [-2,3], [0,0],  [2,-1],  [3,2],  [0,0]  ],
  [ [3,-3], [0,0],  [0,0],  [0,0],  [-1,3],  [0,0],  [0,0]  ],
  [ [-2,1], [1,-3], [3,2],  [-3,1], [2,3],   [0,0],  [-1,-2]],
  [ [0,0],  [2,-2], [0,0],  [0,0],  [0,0],   [-3,3], [0,0]  ],
  [ [3,1],  [0,0],  [-2,-3],[1,2],  [0,0],   [0,0],  [-3,2] ],
]

const CorruptedQR = ({ onClick, isMobile }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById("Contact")
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const glitchCSS = QR_GRID.flatMap((row, r) =>
    row.map((filled, c) => {
      if (!filled) return ""
      const [dx, dy] = GLITCH_OFFSETS[r][c]
      const cellIdx = r * 7 + c
      const vanish = (cellIdx % 7 === 0 || cellIdx % 11 === 0) ? "opacity: 0;" : "opacity: 1;"
      return `.qr-wrap:hover .qr-cell[data-cell="${cellIdx}"] { transform: translate(${dx}px, ${dy}px); ${vanish} }`
    })
  ).join("\n")

  if (isMobile) {
    return (
      <>
        <style>{`
          @keyframes mobileBadgePulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(229,255,71,0); }
            50%     { box-shadow: 0 0 0 5px rgba(229,255,71,0.18); }
          }
          @keyframes mobileBadgeFade {
            from { opacity:0; transform: scale(0.85); }
            to   { opacity:1; transform: scale(1); }
          }
          .mobile-badge {
            position: fixed; top: 72px; right: 16px; z-index: 500;
            display: flex; align-items: center; gap: 6px;
            padding: 5px 10px; background: rgba(0,0,0,0.75);
            backdrop-filter: blur(6px); border: 1px solid rgba(229,255,71,0.2);
            cursor: pointer; user-select: none; opacity: 0; pointer-events: none;
            transition: opacity 0.6s ease; animation: mobileBadgePulse 3s ease-in-out infinite;
            -webkit-tap-highlight-color: transparent;
          }
          .mobile-badge.visible {
            opacity: 1; pointer-events: all;
            animation: mobileBadgeFade 0.6s ease both, mobileBadgePulse 3s 0.6s ease-in-out infinite;
          }
          .mobile-badge:active { opacity: 0.7; }
        `}</style>
        <div className={`mobile-badge${visible ? " visible" : ""}`} onClick={onClick}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e5ff47", flexShrink: 0, boxShadow: "0 0 6px rgba(229,255,71,0.6)" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(229,255,71,0.7)", whiteSpace: "nowrap" }}>
            sys.enc_
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes qrFadeIn      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes qrBreathe     { 0%,100%{box-shadow:0 0 0px rgba(229,255,71,0);border-color:rgba(255,255,255,0.07)} 35%,65%{box-shadow:0 0 14px rgba(229,255,71,0.35),0 0 28px rgba(229,255,71,0.12);border-color:rgba(229,255,71,0.3)} 50%{box-shadow:0 0 8px rgba(229,255,71,0.2),0 0 18px rgba(229,255,71,0.08);border-color:rgba(229,255,71,0.18)} }
        @keyframes qrCellBreathe { 0%,100%{background:rgba(255,255,255,0.15)} 35%,65%{background:rgba(229,255,71,0.4)} 50%{background:rgba(229,255,71,0.28)} }
        @keyframes qrFlicker     { 0%,100%{opacity:1} 82%{opacity:1} 84%{opacity:0.1} 86%{opacity:1} 96%{opacity:0.35} 98%{opacity:1} }
        @keyframes qrBlink       { 0%,100%{opacity:1} 50%{opacity:0} }
        .qr-wrap { position:fixed; bottom:40px; right:24px; z-index:500; cursor:pointer; user-select:none; display:flex; flex-direction:column; align-items:flex-end; gap:6px; opacity:0; pointer-events:none; transition:opacity 0.7s ease; }
        .qr-wrap.visible { opacity:1; pointer-events:all; animation:qrFadeIn 0.7s ease both; }
        .qr-grid { display:grid; grid-template-columns:repeat(7,7px); grid-template-rows:repeat(7,7px); gap:2px; padding:8px; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.07); animation:qrBreathe 3s ease-in-out infinite; transition:border-color 0.15s ease; }
        .qr-wrap:hover .qr-grid { animation:none; border-color:rgba(229,255,71,0.4); box-shadow:0 0 20px rgba(229,255,71,0.2),0 0 40px rgba(229,255,71,0.08),inset 0 0 12px rgba(229,255,71,0.04); }
        .qr-cell { width:7px; height:7px; transition:transform 0.12s ease,opacity 0.1s ease,background 0.15s ease; will-change:transform; }
        .qr-cell.filled { animation:qrCellBreathe 3s ease-in-out infinite; }
        .qr-cell.empty  { background:transparent; }
        .qr-cell[data-cell="2"]  { animation-delay:0.1s; }
        .qr-cell[data-cell="9"]  { animation-delay:0.2s; }
        .qr-cell[data-cell="20"] { animation-delay:0.05s; }
        .qr-cell[data-cell="33"] { animation-delay:0.15s; }
        .qr-cell[data-cell="14"] { animation:qrCellBreathe 3s ease-in-out infinite,qrFlicker 5.7s 1.2s ease-in-out infinite; }
        .qr-cell[data-cell="41"] { animation:qrCellBreathe 3s ease-in-out infinite,qrFlicker 6.2s 2.1s ease-in-out infinite; }
        .qr-wrap:hover .qr-cell.filled { background:#e5ff47; filter:drop-shadow(0 0 3px rgba(229,255,71,0.7)); animation:none; }
        ${glitchCSS}
        .qr-label { font-family:'IBM Plex Mono',monospace; font-size:7px; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,0); transition:color 0.2s ease; white-space:nowrap; }
        .qr-wrap:hover .qr-label { color:rgba(229,255,71,0.55); animation:qrBlink 1.1s step-end infinite; }
      `}</style>
      <div className={`qr-wrap${visible ? " visible" : ""}`} onClick={onClick} title="sys.enc_">
        <div className="qr-grid">
          {QR_GRID.flatMap((row, r) =>
            row.map((filled, c) => {
              const idx = r * 7 + c
              return <div key={idx} data-cell={idx} className={`qr-cell ${filled ? "filled" : "empty"}`} />
            })
          )}
        </div>
        <span className="qr-label">sys.enc_</span>
      </div>
    </>
  )
}

/* ── App ── */
const App = () => {
  const [isReady, setIsReady]         = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [gateCleared, setGateCleared] = useState(false)
  const [loaderMode, setLoaderMode]   = useState("decrypt")
  const [showLoader, setShowLoader]   = useState(true)
  const [isMobile, setIsMobile]       = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Gate 1: fonts
  useEffect(() => {
    const onReady = () => document.fonts.ready.then(() => setFontsLoaded(true))
    if (document.readyState === "complete") { onReady() }
    else {
      window.addEventListener("load", onReady)
      return () => window.removeEventListener("load", onReady)
    }
  }, [])

  // Gate 2: audio — preload into Audio element cache.
  // On mobile this runs while gate screen is visible so
  // files are ready before or right when user taps.
  useEffect(() => {
    preloadAudio().then(() => setAudioLoaded(true))
  }, [])

  const handleEncrypt = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => { setLoaderMode("encrypt"); setIsReady(false); setShowLoader(true) }, 400)
  }, [])

  const handleLoaderDone = useCallback(() => {
    if (loaderMode === "decrypt") { setIsReady(true); setShowLoader(false) }
    else { setLoaderMode("decrypt"); setIsReady(false); setShowLoader(true) }
  }, [loaderMode])

  const handleGateEnter = useCallback(() => {
    // Note: unlockCachedAudio() + intro.play() already called
    // synchronously inside MobileGate's handleTap before this runs.
    window._audioUnlocked = true
    setGateCleared(true)
  }, [])

  const showMobileGate = isMobile && fontsLoaded && !gateCleared
  const canShowLoader  = isMobile
    ? fontsLoaded && gateCleared
    : fontsLoaded && audioLoaded

  return (
    <ErrorBoundary>
      <ReactLenis root style={{ position: "relative", width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>

        {/* Mobile gate */}
        {showMobileGate && (
          <MobileGate onEnter={handleGateEnter} audioReady={audioLoaded} />
        )}

        {/* Scramble loader */}
        {canShowLoader && showLoader && (
          <ScrambleLoader key={loaderMode + "-" + Date.now()} mode={loaderMode} onDone={handleLoaderDone} />
        )}

        <div style={{ opacity: isReady ? 1 : 0, transition: "opacity 1s ease" }}>
          <Navbar />
          <Hero animate={isReady} />
          <ServiceSummary />
          <Services />
          <About />
          <Work />
          <ContactSummary />
          <Contact />
        </div>

        {isReady && <CorruptedQR onClick={handleEncrypt} isMobile={isMobile} />}
      </ReactLenis>
    </ErrorBoundary>
  )
}

export default App