import { useMediaQuery } from "react-responsive"
import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import * as THREE from "three"

const currentYear = new Date().getFullYear()

/* ─────────────────────────────────────────────────────────
   Particles — tsparticles v3
───────────────────────────────────────────────────────── */
const ParticlesBg = () => {
  const [engineReady, setEngineReady] = useState(false)
  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine) })
      .then(() => setEngineReady(true))
  }, [])
  if (!engineReady) return null
  return (
    <Particles
      id="tsparticles"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
          events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } },
          modes: { grab: { distance: 140, links: { opacity: 0.4 } }, push: { quantity: 2 } },
        },
        particles: {
          color: { value: "#000000" },
          links: { color: "#000000", distance: 150, enable: true, opacity: 0.08, width: 0.7 },
          move: { enable: true, speed: 0.4, random: true, outModes: { default: "bounce" } },
          number: { density: { enable: true, area: 900 }, value: 55 },
          opacity: { value: 0.22, animation: { enable: true, speed: 0.4, minimumValue: 0.05, sync: false } },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 2.2 } },
        },
        detectRetina: true,
      }}
      style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  )
}

/* ─────────────────────────────────────────────────────────
   Floating 3D Icosahedron — Three.js wireframe
───────────────────────────────────────────────────────── */
const FloatingShape = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.offsetWidth || 300
    const h = canvas.offsetHeight || 300

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.z = 4

    const geo     = new THREE.IcosahedronGeometry(1.2, 1)
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, opacity: 0.12, transparent: true })
    const wireMesh = new THREE.Mesh(geo, wireMat)
    scene.add(wireMesh)

    const solidMat  = new THREE.MeshPhongMaterial({ color: 0xe8e4da, shininess: 60, opacity: 0.6, transparent: true })
    const solidMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), solidMat)
    scene.add(solidMesh)

    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dir = new THREE.DirectionalLight(0xffffff, 1.2)
    dir.position.set(3, 3, 3)
    scene.add(dir)
    const pt = new THREE.PointLight(0xe5ff47, 0.8, 20)
    pt.position.set(-3, -2, 2)
    scene.add(pt)

    let frameId, t = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      t += 0.005
      wireMesh.rotation.x  = t * 0.4
      wireMesh.rotation.y  = t * 0.6
      solidMesh.rotation.x = t * 0.4
      solidMesh.rotation.y = t * 0.6
      wireMesh.position.y  = Math.sin(t * 1.2) * 0.12
      solidMesh.position.y = Math.sin(t * 1.2) * 0.12
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!canvas) return
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight
      renderer.setSize(nw, nh)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", onResize)
      renderer.dispose(); geo.dispose(); wireMat.dispose(); solidMat.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
}

/* ─────────────────────────────────────────────────────────
   useHopeSound — plays hope.mp3 with a gentle fade-in
   the moment animate flips to true (hero becomes visible)
───────────────────────────────────────────────────────── */
const useHopeSound = (animate) => {
  const audioRef  = useRef(null)
  const firedRef  = useRef(false)

  // Preload on mount
  useEffect(() => {
    const audio = new Audio("/audio/hope.mp3")
    audio.preload = "auto"
    audio.volume  = 0
    audioRef.current = audio
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    }
  }, [])

  // Fire once when animate becomes true
  useEffect(() => {
    if (!animate || firedRef.current) return
    firedRef.current = true
    const audio = audioRef.current
    if (!audio) return

    try {
      audio.currentTime = 0
      audio.volume = 0
      const p = audio.play()
      if (p !== undefined) {
        p.then(() => {
          // Fade in hope.mp3 from 0 → 0.65 over ~1.4s in sync with the hero animation
          let vol = 0
          const fadeIn = setInterval(() => {
            vol = Math.min(vol + 0.04, 0.65)
            if (audioRef.current) audioRef.current.volume = vol
            if (vol >= 0.65) clearInterval(fadeIn)
          }, 80)
        }).catch(() => {
          // Fallback: play without fade if promise rejected
          try {
            const fb = new Audio("/audio/hope.mp3")
            fb.volume = 0.65
            fb.play().catch(() => {})
          } catch (e) {}
        })
      }
    } catch (e) {}
  }, [animate])
}

/* ─────────────────────────────────────────────────────────
   MOBILE HERO
───────────────────────────────────────────────────────── */
const MobileHero = ({ animate }) => {
  const sectionRef = useRef(null)
  const nameRef    = useRef(null)
  const restRef    = useRef(null)

  // hope.mp3 plays when hero animates in
  useHopeSound(animate)

  useGSAP(() => {
    if (!animate || !sectionRef.current || !nameRef.current || !restRef.current) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(nameRef.current.children, {
      y: 40,
      opacity: 0,
      stagger: 0.07,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(restRef.current.children, {
      y: 24,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.4")
    return () => tl.kill()
  }, { scope: sectionRef, dependencies: [animate] })

  return (
    <section
      id="Home"
      ref={sectionRef}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 22px", borderBottom: "1px solid rgba(0,0,0,0.07)",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(0,0,0,0.28)" }}>
          Fuoseigha Darwin
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "8px", letterSpacing: ".18em", textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,0,0,0.1)", padding: "4px 10px",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", animation: "blink 2.4s ease-in-out infinite" }} />
          Available
        </span>
      </div>

      {/* ── Giant name block ── */}
      <div style={{
        padding: "20px 22px 0", borderBottom: "1px solid rgba(0,0,0,0.07)",
        position: "relative", zIndex: 5, overflow: "hidden",
      }}>
        <div style={{ fontSize: "8px", letterSpacing: ".36em", textTransform: "uppercase", color: "rgba(0,0,0,0.28)", marginBottom: "6px" }}>
          404 No Bugs Found!
        </div>
        <h1
          ref={nameRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(88px, 26vw, 148px)",
            lineHeight: 0.84, letterSpacing: ".01em",
            color: "rgba(0,0,0,0.87)", margin: "0 0 16px",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {"DARWIN".split("").map((letter, i) => (
            <span key={i} style={{ display: "inline-block" }}>{letter}</span>
          ))}
        </h1>
      </div>

      {/* ── Yellow ticker ── */}
      <div style={{
        background: "#e5ff47", padding: "8px 0", overflow: "hidden",
        whiteSpace: "nowrap", flexShrink: 0, zIndex: 5,
      }}>
        <div style={{ display: "inline-flex", animation: "ticker 16s linear infinite" }}>
          {Array(10).fill("Premium Websites · Mobile Apps · Results-Driven · ").map((t, i) => (
            <span key={i} style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px",
              letterSpacing: ".2em", textTransform: "uppercase", color: "#000", paddingRight: "28px",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Middle ── */}
      <div ref={restRef} style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{
          width: "100%", height: "260px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", position: "relative",
        }}>
          <div style={{ width: "240px", height: "240px" }}>
            <FloatingShape />
          </div>
          <div style={{
            position: "absolute", bottom: "10px", right: "14px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "7px", letterSpacing: ".2em", textTransform: "uppercase",
            color: "rgba(0,0,0,0.18)",
          }}>
            3JS / WEBGL
          </div>
        </div>

        <div style={{
          padding: "20px 22px", display: "flex", flexDirection: "column",
          gap: "16px", borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}>
          <p style={{
            fontSize: "9px", lineHeight: 1.9, letterSpacing: ".05em",
            textTransform: "uppercase", fontWeight: 300,
            color: "rgba(0,0,0,0.45)", margin: 0,
          }}>
            I help brands & startups gain an unfair advantage through premium digital products
          </p>
          <div>
            <p style={{ fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(0,0,0,0.2)", margin: "0 0 4px", lineHeight: 1.8 }}>
              <span style={{ color: "rgba(0,0,0,0.08)" }}>// </span>Python · Node · Go · React
            </p>
            <p style={{ fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(0,0,0,0.2)", margin: 0, lineHeight: 1.8 }}>
              <span style={{ color: "rgba(0,0,0,0.08)" }}>// </span>Next.js · Flutter · Django
            </p>
          </div>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px",
            color: "rgba(0,0,0,0.05)", letterSpacing: ".06em",
            lineHeight: 1, userSelect: "none", alignSelf: "flex-end",
          }}>
            {currentYear}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <a href="/darwin_cv.pdf" download style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px", letterSpacing: ".16em", textTransform: "uppercase",
            padding: "16px 10px", background: "#e5ff47", color: "#000",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            textDecoration: "none", borderRight: "1px solid rgba(0,0,0,0.1)",
          }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="1" x2="7" y2="9" /><polyline points="4,6 7,9 10,6" />
              <path d="M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
            </svg>
            Download CV
          </a>
          <a href="#Projects" style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px", letterSpacing: ".16em", textTransform: "uppercase",
            padding: "16px 10px", background: "transparent", color: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            textDecoration: "none",
          }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" /><circle cx="7" cy="7" r="1.5" />
            </svg>
            View Work ↓
          </a>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   DESKTOP HERO
───────────────────────────────────────────────────────── */
const DesktopHero = ({ animate }) => {
  const sectionRef  = useRef(null)
  const topBarRef   = useRef(null)
  const eyebrowRef  = useRef(null)
  const nameWrapRef = useRef(null)
  const nameRef     = useRef(null)
  const dividerRef  = useRef(null)
  const taglineRef  = useRef(null)
  const bottomRef   = useRef(null)
  const shapeRef    = useRef(null)

  // hope.mp3 plays when hero animates in
  useHopeSound(animate)

  useGSAP(() => {
    if (!animate || !sectionRef.current) return
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
    tl.from(topBarRef.current,  { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" })
      .from(eyebrowRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.1")
      .from(nameRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.07,
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.3")
      .from(dividerRef.current, { scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(taglineRef.current, { y: 28, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(bottomRef.current.children, { y: 18, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.4")
      .from(shapeRef.current, { opacity: 0, scale: 0.88, duration: 1.0, ease: "power2.out" }, "-=0.8")
    return () => tl.kill()
  }, { scope: sectionRef, dependencies: [animate] })

  return (
    <section
      id="Home"
      ref={sectionRef}
      style={{
        position: "relative", minHeight: "100svh", display: "flex",
        flexDirection: "column", justifyContent: "space-between",
        overflow: "hidden", fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes scrollSlide { 0%{left:-100%} 50%{left:0} 100%{left:100%} }
      `}</style>

      <ParticlesBg />

      {/* Side label */}
      <div style={{
        position: "absolute", right: "52px", top: "50%", transform: "translateY(-50%)",
        zIndex: 10, writingMode: "vertical-rl", fontSize: "8px", letterSpacing: ".22em",
        textTransform: "uppercase", color: "rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", pointerEvents: "none",
      }}>
        <span style={{ display: "block", width: "1px", height: "48px", background: "rgba(0,0,0,0.12)" }} />
        Scroll to explore
        <span style={{ display: "block", width: "1px", height: "48px", background: "rgba(0,0,0,0.12)" }} />
      </div>


      {/* 3JS Shape */}
      <div
        ref={shapeRef}
        style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          marginLeft: "25%",
          width: "clamp(280px, 28vw, 480px)",
          height: "clamp(280px, 28vw, 480px)",
          zIndex: 3, pointerEvents: "none",
        }}
      >
        <FloatingShape />
      </div>

      {/* Top bar */}
      <div ref={topBarRef} style={{
        position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "22px clamp(24px, 5vw, 52px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{ fontSize: "9px", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)" }}>
          Fuoseigha Darwin
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "9px", letterSpacing: ".16em", color: "rgba(0,0,0,0.18)" }}>FD / {currentYear}</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "9px",
            letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)",
            border: "1px solid rgba(0,0,0,0.1)", padding: "5px 13px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, animation: "blink 2.4s ease-in-out infinite" }} />
            Available
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <div ref={eyebrowRef} style={{ padding: "0 clamp(24px, 5vw, 52px)", marginBottom: "10px" }}>
          <span style={{ fontSize: "11px", fontWeight: 300, letterSpacing: ".44em", textTransform: "uppercase", color: "rgba(0,0,0,0.32)" }}>
            404 No Bugs Found!
          </span>
        </div>
        <div ref={nameWrapRef} style={{ overflow: "hidden", padding: "0 clamp(24px, 5vw, 48px)", marginBottom: "clamp(16px, 3vh, 28px)" }}>
          <h1
            ref={nameRef}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(88px, 18vw, 200px)",
              lineHeight: 0.86, letterSpacing: ".01em",
              color: "rgba(0,0,0,0.87)", margin: 0,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {"DARWIN".split("").map((letter, i) => (
              <span key={i} style={{ display: "inline-block" }}>{letter}</span>
            ))}
          </h1>
        </div>
        <div ref={dividerRef} style={{ margin: "0 clamp(24px, 5vw, 52px) clamp(14px, 2.5vh, 22px)", height: "1px", background: "rgba(0,0,0,0.08)" }} />
        <div ref={taglineRef} style={{ padding: "0 clamp(24px, 5vw, 52px)", display: "flex", justifyContent: "flex-end", marginBottom: "clamp(20px, 3.5vh, 32px)" }}>
          <p style={{ fontSize: "clamp(10px, 1.1vw, 13px)", lineHeight: 1.9, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 300, color: "rgba(0,0,0,0.4)", margin: 0, textAlign: "right", maxWidth: "440px" }}>
            I help brands and startups gain an unfair advantage<br />through premium results-driven websites and mobile apps
          </p>
        </div>
        <div ref={bottomRef} style={{
          padding: "18px clamp(24px, 5vw, 52px) clamp(28px, 5vh, 52px)",
          borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex",
          alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "9px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(0,0,0,0.22)", margin: "0 0 5px", lineHeight: 1.7 }}>
              <span style={{ color: "rgba(0,0,0,0.1)" }}>// </span>Python · Node.js · React · Flutter
            </p>
            <p style={{ fontSize: "9px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(0,0,0,0.22)", margin: 0, lineHeight: 1.7 }}>
              <span style={{ color: "rgba(0,0,0,0.1)" }}>// </span>Next.js · TypeScript · Django · Vite
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <a href="/darwin_cv.pdf" download style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".18em",
              textTransform: "uppercase", padding: "12px 26px", background: "#e5ff47", color: "#000",
              display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none",
              transition: "opacity 0.2s", flexShrink: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="1" x2="7" y2="9" /><polyline points="4,6 7,9 10,6" /><path d="M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
              </svg>
              Download CV
            </a>
            <a href="#Projects" style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".18em",
              textTransform: "uppercase", padding: "12px 26px", background: "transparent", color: "rgba(0,0,0,0.45)",
              display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none",
              border: "1px solid rgba(0,0,0,0.18)", transition: "all 0.2s", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.32)"; e.currentTarget.style.color = "rgba(0,0,0,0.78)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)"; e.currentTarget.style.color = "rgba(0,0,0,0.45)" }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" /><circle cx="7" cy="7" r="1.5" />
              </svg>
              View Work ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   Hero — routes mobile vs desktop
───────────────────────────────────────────────────────── */
const Hero = ({ animate }) => {
  const isMobile = useMediaQuery({ maxWidth: 853 })
  return isMobile ? <MobileHero animate={animate} /> : <DesktopHero animate={animate} />
}

export default Hero