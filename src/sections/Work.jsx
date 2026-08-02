import { Icon } from "@iconify/react"
import { projects } from "../constants"
import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

gsap.registerPlugin(ScrollTrigger)

/* ─── Particles bg ─── */
const CaseParticlesBg = () => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine) }).then(() => setReady(true))
  }, [])
  if (!ready) return null
  return (
    <Particles
      id="tsparticles-work"
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
          number: { density: { enable: true, area: 900 }, value: 50 },
          opacity: { value: 0.2, animation: { enable: true, speed: 0.4, minimumValue: 0.05, sync: false } },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 2.2 } },
        },
        detectRetina: true,
      }}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  )
}

/* ─── SplitHeader (unchanged) ─── */
const SplitHeader = memo(({ text, style, className, delay = 0 }) => {
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const chars = wrapRef.current.querySelectorAll(".sh-char")
    gsap.set(chars, { yPercent: 110, skewY: 6, opacity: 0 })
    const a = gsap.to(chars, {
      yPercent: 0, skewY: 0, opacity: 1,
      duration: 0.75, ease: "power4.out", stagger: 0.032, delay,
      scrollTrigger: { trigger: wrapRef.current, start: "top 92%", toggleActions: "play none none reverse" },
    })
    return () => { if (a.scrollTrigger) a.scrollTrigger.kill(); a.kill() }
  }, [delay])

  return (
    <span ref={wrapRef} className={className} style={{ display: "block", overflow: "hidden", ...style }} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} className="sh-char" style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  )
})
SplitHeader.displayName = "SplitHeader"

/* ─── CaseFile ───
   Always uses the same transition, open and close both animate through
   it now. No more instant-close hack — overflow-anchor on the parent
   list is what actually stops the page from jumping. ─── */
const CaseFile = memo(({ project, index, isOpen, onToggle }) => {
  return (
    <div className="relative border-b" style={{ borderColor: "rgba(0,0,0,0.08)", fontFamily: "'IBM Plex Mono', monospace" }}>
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full flex items-center gap-3 sm:gap-6 px-4 sm:px-6 md:px-10 py-5 md:py-7 text-left bg-transparent"
        style={{ border: "none", cursor: "pointer" }}
      >
        <span className="flex-shrink-0" style={{ fontSize: "9px", letterSpacing: ".14em", color: isOpen ? "#000" : "rgba(0,0,0,0.28)", transition: "color .3s" }}>
          NO.{String(project.id).padStart(3, "0")}
        </span>

        <span className="hidden sm:block flex-shrink-0" style={{
          width: "24px", height: "1px",
          background: "linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.45), rgba(0,0,0,0.03))",
        }} />

        <span className="glitch-hover flex-1 leading-none uppercase truncate" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(24px, 4.5vw, 38px)",
          letterSpacing: ".01em", color: "#000",
        }}>
          {project.name}
        </span>

        {/* Live / Archived badge — orange border + pulsing dot for Live */}
        {project.href ? (
          <span className="hidden sm:inline-flex flex-shrink-0 items-center gap-2" style={{
            fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase",
            padding: "4px 10px", transform: "rotate(-2deg)",
            border: "1px solid rgba(249,115,22,0.85)", color: "rgba(249,115,22,0.95)",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#f97316", flexShrink: 0,
              boxShadow: "0 0 0 rgba(249,115,22,0.6)",
              animation: "livePulse 1.8s ease-in-out infinite",
            }} />
            Live
          </span>
        ) : (
          <span className="hidden sm:inline-flex flex-shrink-0" style={{
            fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase",
            padding: "4px 10px", transform: "rotate(-2deg)",
            border: "1px dashed rgba(0,0,0,0.3)", color: "rgba(0,0,0,0.35)",
          }}>
            Archived
          </span>
        )}

        <span className="flex-shrink-0 flex items-center justify-center" style={{
          width: "26px", height: "26px", border: "1px solid rgba(0,0,0,0.15)",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform .35s ease",
        }}>
          <Icon icon="iconoir:plus" style={{ width: "12px", height: "12px" }} />
        </span>
      </button>

      <div style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows .5s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div className="px-4 sm:px-6 md:px-10 pb-10">
            <div className="grid md:grid-cols-[1fr,1.2fr] gap-6 md:gap-10">

              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", border: "1px solid rgba(0,0,0,0.15)", background: "#000" }}>
                <img
                  src={project.bgImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.4) grayscale(0.25)" }}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={project.image}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-contain p-6"
                  loading="lazy"
                  decoding="async"
                />
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
                }} />
                <span className="absolute top-2 left-2" style={{ width: "12px", height: "12px", borderTop: "1.5px solid rgba(255,255,255,0.55)", borderLeft: "1.5px solid rgba(255,255,255,0.55)" }} />
                <span className="absolute bottom-2 right-2" style={{ width: "12px", height: "12px", borderBottom: "1.5px solid rgba(255,255,255,0.55)", borderRight: "1.5px solid rgba(255,255,255,0.55)" }} />
                <span style={{
                  position: "absolute", top: "10px", right: "10px",
                  fontSize: "7px", letterSpacing: ".18em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}>
                  EXHIBIT {String(project.id).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-5">
                <p style={{ fontSize: "11px", lineHeight: 1.9, letterSpacing: ".02em", opacity: 0.62, whiteSpace: "pre-line" }}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.frameworks.map((fw) => (
                    <span key={fw.id} style={{
                      fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase",
                      padding: "4px 9px", border: "1px solid rgba(0,0,0,0.15)", opacity: 0.55,
                    }}>
                      {fw.name}
                    </span>
                  ))}
                </div>

                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glitch-hover inline-flex items-center gap-2 self-start"
                    style={{ fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", padding: "10px 20px", background: "#e5ff47", color: "#000" }}
                  >
                    Visit Live Site
                    <Icon icon="iconoir:arrow-up-right" style={{ width: "12px", height: "12px" }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
CaseFile.displayName = "CaseFile"

/* ─── Main Work component ─── */
const Work = () => {
  const sectionRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

  const sortedProjects = useMemo(() => [...projects].sort((a, b) => a.id - b.id), [])

  // Simple accordion toggle — closing and opening both go through the
  // same animated transition now, no instant-snap logic needed.
  const handleToggle = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  useGSAP(() => {
    const anim = gsap.from(sectionRef.current, {
      y: 60, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 92%", fastScrollEnd: true },
    })
    return () => { if (anim.scrollTrigger) anim.scrollTrigger.kill(); anim.kill() }
  }, [])

  return (
    <section ref={sectionRef} id="Projects" className="relative flex flex-col min-h-screen overflow-hidden">
      <style>{`
        @keyframes glitchFlicker {
          0%, 100% { transform: translate(0,0); text-shadow: none; }
          20% { transform: translate(-1px, 0); text-shadow: 1px 0 rgba(0,0,0,0.45), -1px 0 rgba(255,255,255,0.7); }
          40% { transform: translate(1px, 0); opacity: 0.85; }
          60% { transform: translate(-1px, 0); text-shadow: -1px 0 rgba(0,0,0,0.45), 1px 0 rgba(255,255,255,0.7); }
          80% { transform: translate(1px, 0); opacity: 0.92; }
        }
        .glitch-hover:hover { animation: glitchFlicker 0.35s steps(2, end) 1; }
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.55); }
          70%  { box-shadow: 0 0 0 5px rgba(249,115,22,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
      `}</style>

      <CaseParticlesBg />

      <div className="relative z-10 flex justify-between items-center px-4 pt-50 pb-4 border-b sm:px-6 md:px-10" style={{ borderColor: "rgba(0,0,0,0.08)", fontFamily: "'IBM Plex Mono', monospace" }}>
        <span style={{ fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.25 }}>My-Projects</span>
        <span style={{ fontSize: "10px", letterSpacing: ".1em", opacity: 0.15 }}>FD / 2025</span>
      </div>

      <div className="relative z-10 px-4 pt-7 pb-2 sm:px-6 md:px-10">
        <SplitHeader text="Selected" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px, 14vw, 130px)", lineHeight: 0.88, opacity: 0.9 }} />
        <SplitHeader text="Work." delay={0.08} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px, 14vw, 130px)", lineHeight: 0.88, opacity: 0.18 }} />

        <div className="mt-4 mb-6 inline-flex items-center gap-2" style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "5px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e5ff47", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", opacity: 0.45 }}>
            Tap any case file to open it
          </span>
        </div>
      </div>

      {/* overflow-anchor: none is the actual fix for the footer-jump bug —
          it stops the browser's scroll-anchoring from repositioning the
          page when a panel above/below the viewport changes height */}
      <div className="relative z-10 flex flex-col" style={{ overflowAnchor: "none" }}>
        {sortedProjects.map((project, i) => (
          <CaseFile
            key={project.id}
            project={project}
            index={i}
            isOpen={openIndex === i}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  )
}

export default Work