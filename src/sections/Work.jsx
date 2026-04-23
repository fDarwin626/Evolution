import { Icon } from "@iconify/react"
import { projects } from "../constants"
import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ─── SplitHeader ─── */
const SplitHeader = memo(({ text, style, className, delay = 0 }) => {
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const chars = wrapRef.current.querySelectorAll(".sh-char")
    gsap.set(chars, { yPercent: 110, skewY: 6, opacity: 0 })
    const a = gsap.to(chars, {
      yPercent: 0, skewY: 0, opacity: 1,
      duration: 0.75, ease: "power4.out", stagger: 0.032, delay,
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top 92%",
        toggleActions: "play none none reverse",
      },
    })
    return () => { if (a.scrollTrigger) a.scrollTrigger.kill(); a.kill() }
  }, [delay])

  return (
    <span
      ref={wrapRef}
      className={className}
      style={{ display: "block", overflow: "hidden", ...style }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="sh-char"
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  )
})
SplitHeader.displayName = "SplitHeader"

/* ─── Desktop ProjectItem ─── */
const ProjectItemDesktop = memo(({ project, index, onMouseEnter, onMouseLeave, overlayRef }) => (
  <div
    className="relative flex flex-col py-5 cursor-pointer group gap-0"
    onMouseEnter={() => onMouseEnter(index)}
    onMouseLeave={() => onMouseLeave(index)}
  >
    <div
      ref={overlayRef}
      className="absolute inset-0 duration-200 bg-black -z-10 clip-path will-change-transform"
    />

    {/* Project name + arrow */}
    <div className="flex justify-between items-center px-10 group-hover:px-12 transition-all duration-500">
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="leading-none text-[26px] lg:text-[32px] text-black group-hover:text-white transition-colors duration-500"
      >
        {project.name}
      </a>
      <Icon
        icon="iconoir:arrow-up-right"
        className="flex-shrink-0 size-6 text-black group-hover:text-white transition-colors duration-500"
      />
    </div>

    <div className="w-full h-0.5 bg-black/80" />

    {/* Frameworks */}
    <div className="flex uppercase px-10 group-hover:px-12 gap-x-5 text-sm leading-loose flex-wrap transition-all duration-500">
      {project.frameworks.map((fw) => (
        <p
          key={fw.id}
          className="font-normal text-black group-hover:text-white transition-colors duration-500"
        >
          {fw.name}
        </p>
      ))}
    </div>

    {/* Description */}
    <div className="flex px-10 group-hover:px-12 transition-all duration-500">
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          letterSpacing: ".03em",
          lineHeight: "1.85",
          opacity: 0.6,
        }}
        className="text-black group-hover:text-white transition-colors duration-500 text-pretty"
      >
        {project.description.split("\n").map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <><br /><br /></>}
          </span>
        ))}
      </p>
    </div>
  </div>
))
ProjectItemDesktop.displayName = "ProjectItemDesktop"

/* ─── Mobile ProjectItem ─── */
const ProjectItemMobile = memo(({ project, index }) => {
  const itemRef = useRef(null)

  useEffect(() => {
    if (!itemRef.current) return
    gsap.set(itemRef.current, { opacity: 0, y: 30 })
    const a = gsap.to(itemRef.current, {
      opacity: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "all",
      scrollTrigger: {
        trigger: itemRef.current,
        start: "top 92%",
        toggleActions: "play none none reverse",
        fastScrollEnd: true,
      },
    })
    return () => { if (a.scrollTrigger) a.scrollTrigger.kill(); a.kill() }
  }, [])

  return (
    <div
      ref={itemRef}
      className="border-b"
      style={{ borderColor: "rgba(0,0,0,0.08)", fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
        <img
          src={project.bgImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
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
          position: "absolute", top: "12px", left: "12px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px", letterSpacing: ".18em",
          color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "15px", letterSpacing: ".02em",
              lineHeight: 1.3, textDecoration: "none", color: "inherit",
            }}
          >
            {project.name}
          </a>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0, width: "28px", height: "28px",
              border: "1px solid rgba(0,0,0,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "inherit",
            }}
          >
            <Icon icon="iconoir:arrow-up-right" style={{ width: "14px", height: "14px" }} />
          </a>
        </div>

        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px", letterSpacing: ".03em",
          lineHeight: 1.85, opacity: 0.45, marginBottom: "10px",
        }}>
          {project.description.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <><br /><br /></>}
            </span>
          ))}
        </p>

        <div className="flex flex-wrap gap-1">
          {project.frameworks.map((fw) => (
            <span
              key={fw.id}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "7px", letterSpacing: ".14em", textTransform: "uppercase",
                padding: "3px 7px", border: "1px solid rgba(0,0,0,0.1)", opacity: 0.5,
              }}
            >
              {fw.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})
ProjectItemMobile.displayName = "ProjectItemMobile"

/* ─── Main Work component ─── */
const Work = () => {
  const overlayRefs = useRef([])
  const mouse       = useRef({ x: 0, y: 0 })
  const [currentIndex, setCurrentIndex] = useState(null)
  const previewRef  = useRef(null)
  const moveX       = useRef(null)
  const moveY       = useRef(null)
  const sectionRef  = useRef(null)

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  )

  const handleMouseEnter = useCallback((index) => {
    if (isMobile) return
    setCurrentIndex(index)
    const el = overlayRefs.current[index]
    if (!el) return
    gsap.killTweensOf(el)
    gsap.fromTo(el,
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
      { clipPath: "polygon(0 100%, 100% 100%, 99% 0, 0 0)", duration: 0.15, ease: "power2.out" }
    )
    if (previewRef.current) {
      gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" })
    }
  }, [isMobile])

  const handleMouseLeave = useCallback((index) => {
    if (isMobile) return
    setCurrentIndex(null)
    const el = overlayRefs.current[index]
    if (!el) return
    gsap.killTweensOf(el)
    gsap.to(el, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", duration: 0.2, ease: "power2.out" })
    if (previewRef.current) {
      gsap.to(previewRef.current, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.out" })
    }
  }, [isMobile])

  const handleMouseMove = useCallback((e) => {
    if (isMobile || !moveX.current || !moveY.current) return
    mouse.current.x = e.clientX + 24
    mouse.current.y = e.clientY + 120
    moveX.current(mouse.current.x)
    moveY.current(mouse.current.y)
  }, [isMobile])

  useGSAP(() => {
    if (!isMobile && previewRef.current) {
      moveX.current = gsap.quickTo(previewRef.current, "x", { duration: 1.2, ease: "power3.out" })
      moveY.current = gsap.quickTo(previewRef.current, "y", { duration: 1.5, ease: "power3.out" })
    }
    const anim = gsap.from(sectionRef.current, {
      y: isMobile ? 30 : 80, opacity: 0,
      duration: isMobile ? 0.5 : 0.9, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 92%", fastScrollEnd: true },
      force3D: true,
    })
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill()
      anim.kill()
      if (previewRef.current) gsap.killTweensOf(previewRef.current)
    }
  }, [isMobile])

  useEffect(() => {
    return () => {
      if (previewRef.current) gsap.killTweensOf(previewRef.current)
      overlayRefs.current.forEach(el => { if (el) gsap.killTweensOf(el) })
    }
  }, [])

  return (
    <section ref={sectionRef} id="Projects" className="flex flex-col min-h-screen">

      {/* Header */}
      <div
        className="flex justify-between items-center px-4 pt-50 pb-4 border-b sm:px-6 md:px-10"
        style={{ borderColor: "rgba(0,0,0,0.08)", fontFamily: "'IBM Plex Mono', monospace" }}
      >
        <span style={{ fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.25 }}>
          My-Projects
        </span>
        <span style={{ fontSize: "10px", letterSpacing: ".1em", opacity: 0.15 }}>FD / 2025</span>
      </div>

      {/* Title */}
      <div className="px-4 pt-7 pb-2 sm:px-6 md:px-10">
        <SplitHeader
          text="Selected"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px, 14vw, 130px)", lineHeight: 0.88, opacity: 0.9 }}
        />
        <SplitHeader
          text="Work."
          delay={0.08}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px, 14vw, 130px)", lineHeight: 0.88, opacity: 0.18 }}
        />

        {/* Hint */}
        <div className="mt-4 mb-6 inline-flex items-center gap-2" style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "5px 10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e5ff47", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", opacity: 0.45 }}>
            Click any project title to visit the live site
          </span>
        </div>
      </div>

      {/* Project list */}
      {isMobile ? (
        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectItemMobile key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="relative flex flex-col font-light" onMouseMove={handleMouseMove}>
          {projects.map((project, index) => (
            <ProjectItemDesktop
              key={project.id}
              project={project}
              index={index}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              overlayRef={(el) => { overlayRefs.current[index] = el }}
            />
          ))}

          <div
            ref={previewRef}
            className="fixed top-0 left-0 z-50 overflow-hidden border-8 border-black pointer-events-none opacity-0 w-[600px] lg:w-[720px] xl:w-[800px] will-change-transform"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            {currentIndex !== null && (
              <img
                src={projects[currentIndex].image}
                alt="preview"
                className="object-cover w-full h-full"
                loading="eager"
                decoding="async"
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Work