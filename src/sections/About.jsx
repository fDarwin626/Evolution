import { useRef, useMemo, memo, useEffect, useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_URL =
  "https://wa.me/2349128218436?text=Hello%20Darwin%2C%20I%20came%20across%20your%20portfolio%20and%20I%27d%20love%20to%20collaborate%20with%20you%20on%20a%20project.%20Let%27s%20build%20something%20remarkable%20together!";

/* ─── Info items for the panel ─── */
const infoItems = [
  {
    icon: "◎",
    label: "Based in",
    value: "Lagos, Nigeria",
    accent: false,
  },
  {
    icon: "⊹",
    label: "Availability",
    value: "Open to Remote",
    accent: true,
  },
  {
    icon: "◈",
    label: "Collaboration",
    value: "Startups & Studios",
    accent: false,
  },
  {
    icon: "◇",
    label: "Timezone",
    value: "WAT — UTC+1",
    accent: false,
  },
  {
    icon: "◉",
    label: "Focus",
    value: "FullStack · Mobile",
    accent: false,
  },
  {
    icon: "✦",
    label: "Status",
    value: "Available Now",
    accent: true,
  },
];

/* ─── Desktop Info Panel ─── */
const DesktopInfoPanel = memo(({ containerRef }) => {
  const panelRef        = useRef(null);
  const travDotRef      = useRef(null);
  const staticDotRefs   = useRef([]);
  const itemRefs        = useRef([]);
  const lineFillRef     = useRef(null);

  useEffect(() => {
    if (!containerRef?.current || !panelRef.current) return;

    const total = infoItems.length;

    // Set initial hidden state
    itemRefs.current.forEach((el) => { if (el) gsap.set(el, { opacity: 0, x: 20 }); });
    staticDotRefs.current.forEach((el) => { if (el) gsap.set(el, { scale: 0, opacity: 0 }); });
    gsap.set(travDotRef.current, { opacity: 0, top: "0%" });
    gsap.set(lineFillRef.current, { scaleY: 0, transformOrigin: "top center" });

    // Track which items have already been revealed
    const revealed = new Array(total).fill(false);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 58%",
      end: "bottom 72%",
      onEnter: () => gsap.to(travDotRef.current, { opacity: 1, duration: 0.2 }),
      onLeaveBack: () => {
        gsap.to(travDotRef.current, { opacity: 0, duration: 0.15 });
        gsap.to(lineFillRef.current, { scaleY: 0, duration: 0.3 });
        itemRefs.current.forEach((el) => { if (el) gsap.to(el, { opacity: 0, x: 20, duration: 0.2 }); });
        staticDotRefs.current.forEach((el) => { if (el) gsap.to(el, { scale: 0, opacity: 0, duration: 0.2 }); });
        revealed.fill(false);
      },
      onUpdate: (self) => {
        const p = self.progress; // 0 → 1, exact scroll position, no lag

        // 1. Move travelling dot directly — 1:1 with scroll
        gsap.set(travDotRef.current, { top: `${p * 100}%` });

        // 2. Grow line fill directly — 1:1 with scroll
        gsap.set(lineFillRef.current, { scaleY: p });

        // 3. Reveal each item when scroll passes its threshold
        infoItems.forEach((_, i) => {
          const threshold = i / (total - 1);

          if (p >= threshold && !revealed[i]) {
            revealed[i] = true;
            const sDot = staticDotRefs.current[i];
            if (sDot) gsap.to(sDot, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(3)" });
            const item = itemRefs.current[i];
            if (item) gsap.to(item, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" });
          }

          // Un-reveal if user scrolls back up past threshold
          if (p < threshold && revealed[i]) {
            revealed[i] = false;
            const sDot = staticDotRefs.current[i];
            if (sDot) gsap.to(sDot, { scale: 0, opacity: 0, duration: 0.2 });
            const item = itemRefs.current[i];
            if (item) gsap.to(item, { opacity: 0, x: 20, duration: 0.2 });
          }
        });
      },
    });

    return () => st.kill();
  }, [containerRef]);

  return (
    <div
      ref={panelRef}
      className="absolute inset-y-0 right-0 flex flex-col"
      style={{
        width: "clamp(240px, 32%, 360px)",
        background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 12%, rgba(0,0,0,0.9) 42%)",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: "1.8rem 1.8rem 1.2rem 3.6rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "7px",
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
          marginBottom: "7px",
        }}>
          Quick Info
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "24px",
          letterSpacing: ".05em",
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1,
        }}>
          Darwin<span style={{ color: "#e5ff47" }}>.</span>
        </div>
      </div>

      {/* ── Line + items body ── */}
      <div style={{ flex: 1, display: "flex", padding: "1.8rem 1.8rem 1.8rem 0", minHeight: 0 }}>

        {/* Vertical line column */}
        <div style={{
          position: "relative",
          width: "1px",
          alignSelf: "stretch",
          marginLeft: "2rem",
          marginRight: "1.6rem",
          flexShrink: 0,
        }}>
          {/* Dim static dotted line */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 4px, transparent 4px, transparent 10px)",
          }} />

          {/* Yellow fill that scrubs downward */}
          <div ref={lineFillRef} style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(to bottom, rgba(229,255,71,0.75) 0px, rgba(229,255,71,0.75) 4px, transparent 4px, transparent 10px)",
          }} />

          {/* Static dots — one per item, pop when travelling dot arrives */}
          {infoItems.map((item, i) => (
            <div
              key={i}
              ref={(el) => { staticDotRefs.current[i] = el; }}
              style={{
                position: "absolute",
                left: "50%",
                top: `${(i / (infoItems.length - 1)) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: item.accent ? "10px" : "7px",
                height: item.accent ? "10px" : "7px",
                borderRadius: "50%",
                background: item.accent ? "#e5ff47" : "rgba(255,255,255,0.5)",
                boxShadow: item.accent ? "0 0 10px rgba(229,255,71,0.7)" : "none",
                zIndex: 1,
              }}
            />
          ))}

          {/* Travelling dot */}
          <div ref={travDotRef} style={{
            position: "absolute",
            left: "50%",
            top: "0%",
            transform: "translate(-50%, -50%)",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#e5ff47",
            boxShadow: "0 0 0 4px rgba(229,255,71,0.15), 0 0 18px rgba(229,255,71,0.65)",
            zIndex: 2,
          }} />
        </div>

        {/* Info items — spaced to match dot positions */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignSelf: "stretch",
          paddingRight: "1.2rem",
        }}>
          {infoItems.map((item, i) => (
            <div key={i} ref={(el) => { itemRefs.current[i] = el; }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                marginBottom: "4px",
                lineHeight: 1,
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "13px",
                letterSpacing: ".03em",
                color: item.accent ? "#e5ff47" : "rgba(255,255,255,0.82)",
                lineHeight: 1.25,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{ opacity: 0.28, fontSize: "10px" }}>{item.icon}</span>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "0.7rem 1.8rem 0.9rem 3.6rem",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "7px",
        letterSpacing: ".22em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.07)",
      }}>
        FD_INFO.log
      </div>
    </div>
  );
});

/* ─── Mobile Overlay Panel ─── */
const MobileInfoPanel = memo(({ containerRef }) => {
  const panelRef = useRef(null);
  const pillRefs = useRef([]);
  const dotRefs  = useRef([]);

  useEffect(() => {
    if (!containerRef?.current || !panelRef.current) return;

    const ctx = gsap.context(() => {
      pillRefs.current.forEach((el, i) => {
        if (!el) return;
        const dot = dotRefs.current[i];
        const delay = i * 0.1;

        // Pill slides up + fades in
        gsap.set(el, { opacity: 0, y: 18, scale: 0.94 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        // Dot pops in just before pill
        if (dot) {
          gsap.set(dot, { scale: 0, opacity: 0 });
          gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            delay: delay - 0.04,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, panelRef);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <div
      ref={panelRef}
      className="absolute bottom-0 left-0 right-0"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.96) 40%, rgba(0,0,0,0.7) 70%, transparent 100%)",
        padding: "3.5rem 14px 14px 14px",
        pointerEvents: "none",
      }}
    >
      {/* Top accent rule */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{ width: "24px", height: "1px", background: "rgba(229,255,71,0.6)" }} />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "7px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
        }}>Profile</span>
      </div>

      {/* 2-column pill grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
        {infoItems.map((item, i) => (
          <div
            key={i}
            ref={(el) => { pillRefs.current[i] = el; }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "9px",
              background: item.accent
                ? "rgba(229,255,71,0.05)"
                : "rgba(255,255,255,0.03)",
              border: item.accent
                ? "1px solid rgba(229,255,71,0.2)"
                : "1px solid rgba(255,255,255,0.07)",
              padding: "10px 10px",
              pointerEvents: "auto",
            }}
          >
            {/* Dot */}
            <div
              ref={(el) => { dotRefs.current[i] = el; }}
              style={{
                width: item.accent ? "8px" : "6px",
                height: item.accent ? "8px" : "6px",
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: "3px",
                background: item.accent ? "#e5ff47" : "rgba(255,255,255,0.25)",
                boxShadow: item.accent
                  ? "0 0 8px rgba(229,255,71,0.55)"
                  : "none",
              }}
            />
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                marginBottom: "4px",
                lineHeight: 1,
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px",
                letterSpacing: ".03em",
                color: item.accent ? "#e5ff47" : "rgba(255,255,255,0.78)",
                lineHeight: 1.25,
              }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ─── Main Component ─── */
const About = memo(() => {
  const sectionRef = useRef(null);
  const imgRef     = useRef(null);
  const imgWrapRef = useRef(null); // ref for the photo+panel container
  const heroRef    = useRef(null);
  const introRef   = useRef(null);
  const stackRef   = useRef(null);
  const offRef     = useRef(null);
  const quoteRef   = useRef(null);
  const statsRef   = useRef([]);
  const ctaRef     = useRef(null);

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  );

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cleanups = [];

    if (heroRef.current) {
      const a = gsap.from(heroRef.current.querySelectorAll(".reveal-line"), {
        y: 80,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    }

    if (imgRef.current) {
      gsap.set(imgRef.current, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      });
      const a = gsap.to(imgRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: isMobile ? 1.2 : 1.8,
        ease: "power4.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: imgWrapRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      });
      cleanups.push(a);
    }

    [introRef, stackRef, offRef, quoteRef, ctaRef].forEach((ref) => {
      if (!ref.current) return;
      const a = gsap.from(ref.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    });

    const statEls = statsRef.current.filter(Boolean);
    if (statEls.length) {
      const a = gsap.from(statEls, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statEls[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    }

    return () => {
      cleanups.forEach((a) => {
        if (a.scrollTrigger) a.scrollTrigger.kill();
        a.kill();
      });
    };
  }, { dependencies: [isMobile] });

  const stats = [
    { value: "3+",            label: "Years exp.",       accent: false },
    { value: projects.length, label: "Projects shipped", accent: true  },
    { value: "FS",            label: "Web & Mobile",     accent: false },
    { value: "∞",             label: "Coffee consumed",  accent: false },
  ];

  const techStack = [
    "React", "Next.js", "TypeScript", "Python", "FastAPI", "Django",
    "Flutter", "Golang", "Firebase", "PostgreSQL", "MongoDB",
    "Supabase", "GSAP", "Docker", "Whisper AI", "GPT-4",
  ];

  const offItems = [
    {
      title: "Tech Explorer",
      desc: "Always diving into the latest trends — if a new framework is making noise, I'm already experimenting with it.",
    },
    {
      title: "Carpenter & Woodworker",
      desc: "Yes, I love woodworking. There's something deeply satisfying about crafting furniture with your hands — I'm not just a developer, I'm also a carpenter.",
    },
    {
      title: "Traveller",
      desc: "Exploring new places and cultures keeps the creativity flowing and the mind sharp.",
    },
  ];

  const marqueeItems = [
    "FullStack Development", "Mobile Apps", "Security & Optimization",
    "UI / UX", "SaaS Architecture", "Real-Time Systems",
    "FullStack Development", "Mobile Apps", "Security & Optimization",
    "UI / UX", "SaaS Architecture", "Real-Time Systems",
  ];

  return (
    <section
      ref={sectionRef}
      id="About"
      className="bg-black text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl lg:rounded-b-[2rem]"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .about-tag {
          display: inline-block;
          font-size: 9px;
          letter-spacing: .15em;
          text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 5px 10px;
          color: rgba(255,255,255,0.35);
          margin: 3px;
        }
        .section-label {
          font-size: 9px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 14px;
        }

        /* ── Desktop info panel: only show on lg+ ── */
        .info-panel-desktop { display: none; }
        .info-panel-mobile  { display: block; }

        @media (min-width: 1024px) {
          .info-panel-desktop { display: flex; }
          .info-panel-mobile  { display: none; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-white/[0.07] lg:px-16">
        <span className="text-[10px] tracking-[.2em] uppercase text-white/25">
          About Me
        </span>
        <span className="text-[10px] text-white/15 tracking-[.1em]">FD / 2025</span>
      </div>

      {/* ── Hero title ── */}
      <div ref={heroRef} className="px-5 pt-8 overflow-hidden lg:px-16 lg:pt-14">
        <div className="reveal-line overflow-hidden">
          <span
            className="block leading-[.88] text-white"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(68px, 18vw, 160px)",
            }}
          >
            Full<span className="text-white/20">Stack</span>
          </span>
        </div>
        <div className="reveal-line overflow-hidden">
          <span
            className="block leading-[.88] text-white/30"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(68px, 18vw, 160px)",
            }}
          >
            Dev.
          </span>
        </div>
        <div className="reveal-line mt-5 inline-flex items-center gap-2 border border-white/[0.12] px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47] animate-pulse flex-shrink-0" />
          <span className="text-[10px] sm:text-[11px] tracking-[.15em] uppercase text-white/45">
            Web & Mobile — React · Flutter · Node
          </span>
        </div>
      </div>

      {/* ── Photo section header ── */}
      <div className="flex items-center justify-between px-5 pt-8 pb-3 lg:px-16">
        <div className="flex items-center gap-3">
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}>
            The Developer
          </span>
          <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          letterSpacing: ".15em",
          color: "rgba(255,255,255,0.1)",
        }}>
          Lagos, NG — WAT
        </span>
      </div>

      {/* ── Full-width photo + info panels (image never touched) ── */}
      <div
        ref={imgWrapRef}
        className="w-full relative bg-black"
      >
        {/* Photo: natural height, full width, image untouched */}
        <div ref={imgRef}>
          <LazyLoadImage
            src="images/my_img.jpg"
            alt="Fuoseigha Darwin"
            effect="blur"
            threshold={100}
            className="w-full"
            style={{ display: "block", transform: "translateZ(0)", willChange: "clip-path" }}
          />
        </div>

        {/* Bottom meta overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-5 pb-3 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <span className="text-[9px] tracking-[.15em] uppercase text-white/30">
            my_img.jpg
          </span>
          <span className="text-[9px] tracking-[.1em] text-white/25">Lagos, NG</span>
        </div>

        {/* Mobile: overlay panel floats above photo at bottom */}
        <div
          className="info-panel-mobile"
          style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
        >
          <MobileInfoPanel containerRef={imgWrapRef} />
        </div>

        {/* Desktop: panel floats absolute over the right black area */}
        <div className="info-panel-desktop" style={{ zIndex: 3 }}>
          <DesktopInfoPanel containerRef={imgWrapRef} />
        </div>
      </div>

      {/* ── Who I am ── */}
      <div ref={introRef} className="px-5 py-8 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">Who I am</div>
        <p className="text-[14px] leading-[1.95] text-white/60 tracking-[.03em] lg:max-w-3xl">
          <span className="text-white/90">Passionate fullstack developer</span> with expertise
          in crafting dynamic, responsive web and mobile applications. I build scalable,
          high-performance products that deliver exceptional user experiences — stunning UIs
          on the front, bulletproof systems on the back.
        </p>
        <p className="mt-4 text-[13px] leading-[1.9] text-white/40 tracking-[.03em] lg:max-w-3xl">
          From production SaaS platforms with multi-layer security, to cross-platform mobile
          apps with real-time features — every line of code is written with{" "}
          <span className="text-white/65">intention</span>.
        </p>
      </div>

      {/* ── Tech stack ── */}
      <div ref={stackRef} className="px-5 py-7 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">Tech stack</div>
        <div className="flex flex-wrap -m-[3px]">
          {techStack.map((tag) => (
            <span key={tag} className="about-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-b border-white/[0.07] py-3 whitespace-nowrap">
        <div
          style={{
            display: "inline-block",
            animation: "marquee-scroll 20s linear infinite",
          }}
        >
          {marqueeItems.map((item, i) => {
            const [first, ...rest] = item.split(" ");
            return (
              <span
                key={i}
                className="inline-block text-[10px] tracking-[.2em] uppercase text-white/20 px-7"
              >
                {first}{" "}
                <span className="text-white/40">{rest.join(" ")}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── When not coding ── */}
      <div ref={offRef} className="px-5 py-7 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">When I'm not coding</div>
        <div className="flex flex-col">
          {offItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 py-4 ${
                i > 0 ? "border-t border-white/[0.05]" : ""
              }`}
            >
              <span className="text-[9px] text-white/15 tracking-[.12em] w-5 flex-shrink-0 mt-0.5">
                0{i + 1}
              </span>
              <div>
                <div className="text-[12px] text-white/65 tracking-[.08em] mb-1.5">
                  {item.title}
                </div>
                <div className="text-[11px] leading-[1.75] text-white/30 tracking-[.03em]">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Philosophy quote ── */}
      <div ref={quoteRef} className="px-5 py-7 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">Philosophy</div>
        <div className="border-l border-white/15 pl-4 lg:max-w-2xl">
          <p className="text-[13px] leading-[1.9] text-white/40 tracking-[.03em] italic">
            "I chose{" "}
            <span className="text-white/75 not-italic">security-first architecture</span>,
            not just CRUD apps. Every feature is built with scalability, security and user
            experience as the foundation — not an afterthought."
          </p>
          <div className="mt-3 text-[9px] tracking-[.15em] uppercase text-white/18">
            — Fuoseigha Darwin, on building Lyvo
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08]">
        {stats.map((s, i) => (
          <div
            key={i}
            ref={(el) => { statsRef.current[i] = el; }}
            className="bg-black px-5 py-5 lg:px-10 lg:py-7"
          >
            <div
              className={`leading-none ${s.accent ? "text-[#e5ff47]" : "text-white"}`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(44px, 6vw, 64px)",
              }}
            >
              {s.value}
            </div>
            <div className="text-[9px] tracking-[.18em] uppercase text-white/22 mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div ref={ctaRef} className="px-5 py-8 lg:px-16">
        <div className="section-label">Work with me</div>
        <p className="text-[13px] leading-[1.85] text-white/45 tracking-[.03em] mb-6 lg:max-w-xl">
          Whether it's a startup MVP, a production SaaS or a mobile app from scratch — I
          bring{" "}
          <span className="text-white/75">the same precision and passion</span> to every
          engagement. Let's build something remarkable together.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#25D366] text-black
              text-[11px] tracking-[.15em] uppercase transition-opacity hover:opacity-90"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Let's build — ↗
          </a>
          <span className="flex items-center gap-2 text-[10px] text-white/20 tracking-[.1em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47]" />
            Available now
          </span>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";
export default About;