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

/* ─────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────── */
const TARGET = "EVOLVE"

const TEXT_SYMBOLS = ["#", "$", "*", "@", "&"]

const ICON_DEFS = [
  { key: "android", el: <Icon icon="qlementine-icons:android-24" width="78" height="78" /> },
  { key: "tux",     el: <Icon icon="famicons:logo-tux"            width="78" height="78" /> },
  { key: "java",    el: <Icon icon="fluent-mdl2:java-logo"        width="78" height="78" /> },
  { key: "react",   el: <Icon icon="ion:logo-react"               width="78" height="78" /> },
  { key: "github",  el: <Icon icon="tdesign:logo-github"          width="78" height="78" /> },
  { key: "python",  el: <Icon icon="ion:logo-python"              width="78" height="78" /> },
  { key: "cypher",  el: <Icon icon="token:cypherock"              width="78" height="78" /> },
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
   ScrambleLoader
───────────────────────────────────────────────────────── */
const ScrambleLoader = ({ onDone, mode = "decrypt" }) => {
  const isEncrypt = mode === "encrypt"

  const [display, setDisplay] = useState(() =>
    Array(TARGET.length).fill(null).map(() => ({ entry: { type: "text", char: "@" }, glitch: false }))
  )
  const [locked, setLocked]   = useState(() => Array(TARGET.length).fill(false))
  const [lockedIcons] = useState(() => Array(TARGET.length).fill(null).map(() => rand(ICON_DEFS).key))
  const [showBtn, setShowBtn] = useState(false)
  const [fade, setFade]       = useState(false)
  const lockedRef             = useRef(Array(TARGET.length).fill(false))
  const glitchRef             = useRef(Array(TARGET.length).fill(false))
  const lockedCount           = useRef(0)

  useEffect(() => {
    lockedCount.current = 0
    lockedRef.current   = Array(TARGET.length).fill(false)
    glitchRef.current   = Array(TARGET.length).fill(false)

    TARGET.split("").forEach((_, i) => {
      setTimeout(() => {
        lockedRef.current[i] = true
        setLocked(prev => { const n = [...prev]; n[i] = true; return n })
        lockedCount.current += 1
        if (lockedCount.current === TARGET.length) {
          setTimeout(() => setShowBtn(true), 600)
        }
      }, 420 + i * 220)
    })
  }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      setDisplay(prev =>
        prev.map((item, i) => {
          if (lockedRef.current[i] && !glitchRef.current[i]) {
            if (isEncrypt) {
              return { entry: { type: "icon", key: lockedIcons[i] }, glitch: false }
            }
            return { entry: { type: "text", char: TARGET[i] }, glitch: false }
          }
          if (glitchRef.current[i]) return item
          return { entry: rand(POOL), glitch: false }
        })
      )
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

        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".38em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.2)", animation: "fadeUp 0.8s ease both",
        }}>
          Fuoseigha Darwin
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(64px, 18vw, 140px)",
          letterSpacing: ".14em", display: "flex", gap: "0.06em",
          alignItems: "center", position: "relative",
        }}>
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
              }}>
                {content}
              </span>
            )
          })}
          {showBtn && (
            <div style={{
              position: "absolute", left: 0, right: 0, height: "2px",
              background: "rgba(229,255,71,0.35)", animation: "scanline 2.8s linear infinite",
              pointerEvents: "none",
            }} />
          )}
        </div>

        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".22em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.15)",
          animation: "fadeUp 0.8s 0.4s ease both", textAlign: "center", lineHeight: 2,
        }}>
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
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px",
            letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)",
          }}>
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e",
              animation: "pulse 1.4s ease-in-out infinite", display: "inline-block",
            }} />
            {isEncrypt ? "Encrypting" : "Decrypting"}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Floating Encrypt Element
   — a mysterious, minimal tag that drifts with scroll
   — designed to make users curious, not look like a button
───────────────────────────────────────────────────────── */
const FloatingEncryptBtn = ({ onClick }) => {
  const elRef    = useRef(null)
  const posRef   = useRef({ x: 0, y: 0 })
  const velRef   = useRef({ x: 0, y: 0 })
  const angleRef = useRef(0)
  const frameRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Start bottom-right-ish
    posRef.current = {
      x: window.innerWidth - 200,
      y: window.innerHeight - 160,
    }

    let lastScroll = window.scrollY

    const onScroll = () => {
      const dy = window.scrollY - lastScroll
      lastScroll = window.scrollY
      setVisible(window.scrollY > 100)
      // Scroll gives a random nudge — more scroll = bigger kick
      velRef.current.x += (Math.random() - 0.5) * Math.abs(dy) * 0.5
      velRef.current.y += (Math.random() - 0.5) * Math.abs(dy) * 0.3
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    const tick = () => {
      angleRef.current += 0.008
      // Gentle organic drift even without scrolling
      velRef.current.x += Math.sin(angleRef.current * 1.1) * 0.15
      velRef.current.y += Math.cos(angleRef.current * 0.7) * 0.1
      // Damping
      velRef.current.x *= 0.93
      velRef.current.y *= 0.93

      posRef.current.x += velRef.current.x
      posRef.current.y += velRef.current.y

      // Soft bounce off edges
      const el = elRef.current
      const bw = el ? el.offsetWidth + 16 : 160
      const bh = el ? el.offsetHeight + 16 : 52
      const W = window.innerWidth
      const H = window.innerHeight

      if (posRef.current.x < 16)      { posRef.current.x = 16;      velRef.current.x *= -0.5 }
      if (posRef.current.x > W - bw)  { posRef.current.x = W - bw;  velRef.current.x *= -0.5 }
      if (posRef.current.y < 16)      { posRef.current.y = 16;       velRef.current.y *= -0.5 }
      if (posRef.current.y > H - bh)  { posRef.current.y = H - bh;  velRef.current.y *= -0.5 }

      if (el) {
        el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes encPulse { 0%,100%{opacity:0.55} 50%{opacity:1} }
        @keyframes encBlink { 0%,100%{opacity:1} 48%{opacity:0} 52%{opacity:0} }
        .enc-tag { transition: opacity 0.5s ease; }
        .enc-tag:hover .enc-label { letter-spacing: .32em; }
        .enc-tag:hover .enc-dot { background: #e5ff47 !important; }
        .enc-label { transition: letter-spacing 0.3s ease; }
      `}</style>

      {/* The element is position:fixed top:0 left:0, moved entirely by JS transform */}
      <div
        ref={elRef}
        onClick={onClick}
        className="enc-tag"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 500,
          cursor: "pointer",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "all" : "none",
          willChange: "transform",
          userSelect: "none",
        }}
      >
        {/* Outer ring — mimics a status indicator, not a button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 14px 9px 10px",
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(229,255,71,0.22)",
          outline: "1px solid rgba(229,255,71,0.06)",
          outlineOffset: "3px",
        }}>
          {/* Animated dot — makes it feel alive, like a status light */}
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px" }}>
            {/* Ping ring */}
            <span style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(229,255,71,0.4)",
              animation: "encPulse 2s ease-in-out infinite",
            }} />
            <span
              className="enc-dot"
              style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "rgba(229,255,71,0.7)",
                transition: "background 0.2s ease",
              }}
            />
          </span>

          {/* Text — small, monospace, feels like a system tag not a CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span
              className="enc-label"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "rgba(229,255,71,0.85)",
              }}
            >
              Encrypt
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "7px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              animation: "encBlink 3.5s ease-in-out infinite",
            }}>
              sys.active_
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   App
───────────────────────────────────────────────────────── */
const App = () => {
  const [isReady, setIsReady]         = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [loaderMode, setLoaderMode]   = useState("decrypt")
  const [showLoader, setShowLoader]   = useState(true)

  useEffect(() => {
    const onReady = () => document.fonts.ready.then(() => setFontsLoaded(true))
    if (document.readyState === "complete") {
      onReady()
    } else {
      window.addEventListener("load", onReady)
      return () => window.removeEventListener("load", onReady)
    }
  }, [])

  const handleEncrypt = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      setLoaderMode("encrypt")
      setIsReady(false)
      setShowLoader(true)
    }, 400)
  }, [])

  const handleLoaderDone = useCallback(() => {
    if (loaderMode === "decrypt") {
      setIsReady(true)
      setShowLoader(false)
    } else {
      setLoaderMode("decrypt")
      setIsReady(false)
      setShowLoader(true)
    }
  }, [loaderMode])

  return (
    <ErrorBoundary>
      <ReactLenis root style={{ position: "relative", width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>

        {fontsLoaded && showLoader && (
          <ScrambleLoader
            key={loaderMode + "-" + Date.now()}
            mode={loaderMode}
            onDone={handleLoaderDone}
          />
        )}

        <div style={{ opacity: isReady ? 1 : 0, transition: "opacity 1s ease" }}>
          <Navbar />
          <Hero />
          <ServiceSummary />
          <Services />
          <About />
          <Work />
          <ContactSummary />
          <Contact />
        </div>

        {isReady && <FloatingEncryptBtn onClick={handleEncrypt} />}

      </ReactLenis>
    </ErrorBoundary>
  )
}

export default App