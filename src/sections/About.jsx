import { useRef, useMemo, memo, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const currentYear = new Date().getFullYear();

const WHATSAPP_URL =
  "https://wa.me/2349128218436?text=Hello%20Darwin%2C%20I%20came%20across%20your%20portfolio%20and%20I%27d%20love%20to%20collaborate%20with%20you%20on%20a%20project.%20Let%27s%20build%20something%20remarkable%20together!";

/* ─── Developer Feed: photo/ascii pairs, native size never forced to match ───
   Auto-cycles through all three portraits. A SCAN toggle flips the
   current one between the real photo and its ascii render — a source
   swap with a crossfade, not a shared canvas, so neither image is
   ever resized to match the other. */
const feedItems = [
  { photo: "images/Image1.jpeg", ascii: "images/ascii.png" },
  { photo: "images/image2.jpeg", ascii: "images/ascii_art2.png" },
  { photo: "images/image3.jpeg", ascii: "images/ascii_art3.png" },
];

const DeveloperFeed = memo(() => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("photo"); // "photo" | "ascii"
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % feedItems.length);
      setMode("photo");
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const jumpTo = (i) => {
    clearInterval(intervalRef.current);
    setIndex(i);
    setMode("photo");
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % feedItems.length);
      setMode("photo");
    }, 5000);
  };

  const current = feedItems[index];

  return (
    <div className="relative w-full" style={{ aspectRatio: "3 / 4", background: "#000" }}>
      {/* HUD corner brackets */}
      <div style={{ position: "absolute", top: "10px", left: "10px", width: "18px", height: "18px", borderTop: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10px", right: "10px", width: "18px", height: "18px", borderTop: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10px", left: "10px", width: "18px", height: "18px", borderBottom: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "18px", height: "18px", borderBottom: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", zIndex: 4, pointerEvents: "none" }} />

      {/* photo layer */}
      <img
        src={current.photo}
        alt="Fuoseigha Darwin"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "contain",
          opacity: mode === "photo" ? 1 : 0,
          transition: "opacity 0.35s steps(3, end)",
          zIndex: 1,
        }}
        draggable={false}
      />

      {/* ascii layer, own native resolution, crisp blocks preserved */}
      <img
        src={current.ascii}
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "contain",
          opacity: mode === "ascii" ? 1 : 0,
          transition: "opacity 0.35s steps(3, end)",
          zIndex: 1,
        }}
        draggable={false}
      />

      {/* top meta row */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-3" style={{ zIndex: 5 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          {mode === "photo" ? "feed // live" : "feed // scan"}
        </span>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "photo" ? "ascii" : "photo"))}
          className="glitch-hover"
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: ".16em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.8)",
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", padding: "5px 10px",
          }}
        >
          {mode === "photo" ? "Scan" : "Revert"}
        </button>
      </div>

      {/* thumbnail selector strip */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-3" style={{ zIndex: 5 }}>
        {feedItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => jumpTo(i)}
            style={{
              flex: 1, height: "2px",
              background: i === index ? "#e5ff47" : "rgba(255,255,255,0.15)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "background 0.2s",
            }}
            aria-label={`View portrait ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
});
DeveloperFeed.displayName = "DeveloperFeed";

/* ─── Quick Info: compact terminal readout, replaces the old scroll-driven dot line ─── */
const infoItems = [
  { label: "Based in", value: "Lagos, Nigeria" },
  { label: "Availability", value: "Open to Remote", accent: true },
  { label: "Collaboration", value: "Startups & Studios" },
  { label: "Timezone", value: "WAT — UTC+1" },
  { label: "Focus", value: "FullStack · Mobile" },
  { label: "Status", value: "Available Now", accent: true },
];

const QuickInfo = memo(() => (
  <div className="grid grid-cols-2 sm:grid-cols-3">
    {infoItems.map((item, i) => (
      <div key={i} className="px-4 py-3 border-t border-r border-white/[0.06]">
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "4px" }}>
          {item.label}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".02em", color: item.accent ? "#e5ff47" : "rgba(255,255,255,0.8)" }}>
          {item.value}
        </div>
      </div>
    ))}
  </div>
));
QuickInfo.displayName = "QuickInfo";

/* ─── Philosophy quotes ───
   Add more any time by appending an object to this array — nothing
   else in the code needs to change. `highlight` is optional; if a
   quote has a phrase worth emphasizing, put its exact text there
   and it'll render bolder inline. */
const philosophyQuotes = [
  {
    quote: "I chose security-first architecture, not just CRUD apps. Every feature is built with scalability, security and user experience as the foundation — not an afterthought.",
    highlight: "security-first architecture",
    author: "— Fuoseigha Darwin, on building Lyvo",
  },
  {
    quote: "When a founder came to me with the vision for Snatched Africa, it wasn't just 'build me a fitness app.' It was a real problem: African women deserved a space built around their bodies and their routines, not a copy-paste template with a different logo. My job was to take that vision and turn it into something real, architecture, features, and all, built to fit into someone's actual life, not just look good in a demo.",
    author: "— Fuoseigha Darwin, on building Snatched Africa",
  },
  {
    quote: "A marketplace lives or dies on trust. I didn't just build a platform for sellers to list products, I built the systems underneath it: verification, dispute handling, and a fair pricing model that protects both sides. That's the difference between a marketplace and just another storefront.",
    author: "— Fuoseigha Darwin, on building Nexo",
  },
];

const PhilosophyRotator = memo(() => {
  const [index, setIndex] = useState(0);
  const quoteRef  = useRef(null);
  const authorRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % philosophyQuotes.length);
    }, 8500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!quoteRef.current || !authorRef.current) return;
    const tl = gsap.fromTo(
      [quoteRef.current, authorRef.current],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
    return () => tl.kill();
  }, [index]);

  const current = philosophyQuotes[index];

  const renderQuote = () => {
    if (!current.highlight) return `"${current.quote}"`;
    const [before, after] = current.quote.split(current.highlight);
    return (
      <>
        "{before}
        <span className="text-white/75 not-italic">{current.highlight}</span>
        {after}"
      </>
    );
  };

  return (
    <div className="border-l border-white/15 pl-4 lg:max-w-2xl">
      <p ref={quoteRef} className="text-[13px] leading-[1.9] text-white/40 tracking-[.03em] italic">
        {renderQuote()}
      </p>
      <div ref={authorRef} className="mt-3 text-[9px] tracking-[.15em] uppercase text-white/18">
        {current.author}
      </div>
      <div className="flex gap-1 mt-4">
        {philosophyQuotes.map((_, i) => (
          <span key={i} style={{
            width: "16px", height: "2px",
            background: i === index ? "#e5ff47" : "rgba(255,255,255,0.12)",
            transition: "background 0.2s",
          }} />
        ))}
      </div>
    </div>
  );
});
PhilosophyRotator.displayName = "PhilosophyRotator";

/* ─── Main Component ─── */
const About = memo(() => {
  const sectionRef = useRef(null);
  const heroRef    = useRef(null);
  const feedWrapRef = useRef(null);
  const introRef   = useRef(null);
  const stackRef   = useRef(null);
  const offRef     = useRef(null);
  const quoteRef   = useRef(null);
  const statsRef   = useRef([]);
  const ctaRef     = useRef(null);
  const scanRef    = useRef(null);

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  );

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cleanups = [];

    if (heroRef.current) {
      const a = gsap.from(heroRef.current.querySelectorAll(".reveal-line"), {
        y: 80, opacity: 0, stagger: 0.08, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: heroRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      });
      cleanups.push(a);
    }

    if (feedWrapRef.current) {
      const a = gsap.from(feedWrapRef.current, {
        opacity: 0, y: 30, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: feedWrapRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      });
      cleanups.push(a);
    }

    [introRef, stackRef, offRef, quoteRef, ctaRef].forEach((ref) => {
      if (!ref.current) return;
      const a = gsap.from(ref.current, {
        y: 30, opacity: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
      });
      cleanups.push(a);
    });

    const statEls = statsRef.current.filter(Boolean);
    if (statEls.length) {
      const a = gsap.from(statEls, {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: statEls[0], start: "top 85%", toggleActions: "play none none reverse" },
      });
      cleanups.push(a);
    }

    if (scanRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
      tl.set(scanRef.current, { top: "-4%", opacity: 0 })
        .to(scanRef.current, { opacity: 0.5, duration: 0.25 })
        .to(scanRef.current, { top: "104%", duration: 1.7, ease: "power1.inOut" }, "<")
        .to(scanRef.current, { opacity: 0, duration: 0.3 }, "-=0.3");
      cleanups.push(tl);
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
    "Flutter", "Firebase", "PostgreSQL", "MongoDB",
    "Supabase", "GSAP", "Docker", "Whisper AI", "Node.js", "Express", "Redis",
  ];

  const offItems = [
    { title: "Tech Explorer", desc: "Always diving into the latest trends — if a new framework is making noise, I'm already experimenting with it." },
    { title: "Carpenter & Woodworker", desc: "Yes, I love woodworking. There's something deeply satisfying about crafting furniture with your hands — I'm not just a developer, I'm also a carpenter." },
    { title: "Traveller", desc: "Exploring new places and cultures keeps the creativity flowing and the mind sharp." },
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
      className="bg-black text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl lg:rounded-b-[2rem] relative"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes glitchFlicker {
          0%, 100% { transform: translate(0,0); text-shadow: none; }
          20% { transform: translate(-1px, 0); text-shadow: 1px 0 rgba(255,255,255,0.5), -1px 0 rgba(0,0,0,0.6); }
          40% { transform: translate(1px, 0); opacity: 0.85; }
          60% { transform: translate(-1px, 0); text-shadow: -1px 0 rgba(255,255,255,0.5), 1px 0 rgba(0,0,0,0.6); }
          80% { transform: translate(1px, 0); opacity: 0.92; }
        }
        .glitch-hover:hover { animation: glitchFlicker 0.35s steps(2, end) 1; }
        .about-tag {
          display: inline-block; font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.1); padding: 5px 10px; color: rgba(255,255,255,0.35); margin: 3px;
        }
        .section-label {
          font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); margin-bottom: 14px;
        }
        .sh-chrome {
          color: rgba(255,255,255,0.96) !important;
          text-shadow: 0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.4), 0 3px 10px rgba(255,255,255,0.08);
        }
      `}</style>

      {/* HUD corner brackets */}
      <div style={{ position: "absolute", top: "18px", left: "18px", width: "26px", height: "26px", borderTop: "1px solid rgba(255,255,255,0.15)", borderLeft: "1px solid rgba(255,255,255,0.15)", zIndex: 5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "18px", right: "18px", width: "26px", height: "26px", borderTop: "1px solid rgba(255,255,255,0.15)", borderRight: "1px solid rgba(255,255,255,0.15)", zIndex: 5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "18px", left: "18px", width: "26px", height: "26px", borderBottom: "1px solid rgba(255,255,255,0.15)", borderLeft: "1px solid rgba(255,255,255,0.15)", zIndex: 5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "18px", right: "18px", width: "26px", height: "26px", borderBottom: "1px solid rgba(255,255,255,0.15)", borderRight: "1px solid rgba(255,255,255,0.15)", zIndex: 5, pointerEvents: "none" }} />

      {/* one-time scan sweep */}
      <div ref={scanRef} style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
        zIndex: 6, pointerEvents: "none",
      }} />

      {/* ── Top bar ── */}
      <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-white/[0.07] lg:px-16" style={{ position: "relative", zIndex: 1 }}>
        <span className="text-[10px] tracking-[.2em] uppercase text-white/25">About Me</span>
        <span className="text-[10px] text-white/15 tracking-[.1em]">FD / {currentYear}</span>
      </div>

      {/* ── Hero title ── */}
      <div ref={heroRef} className="px-5 pt-8 overflow-hidden lg:px-16 lg:pt-14" style={{ position: "relative", zIndex: 1 }}>
        <div className="reveal-line overflow-hidden">
          <span className="block leading-[.88] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(68px, 18vw, 160px)" }}>
            Full<span className="text-white/20">Stack</span>
          </span>
        </div>
        <div className="reveal-line overflow-hidden">
          <span className="sh-chrome block leading-[.88]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(68px, 18vw, 160px)" }}>
            Dev.
          </span>
        </div>
        <div className="reveal-line glitch-hover mt-5 inline-flex items-center gap-2 border border-white/[0.12] px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47] animate-pulse flex-shrink-0" />
          <span className="text-[10px] sm:text-[11px] tracking-[.15em] uppercase text-white/45">
            Web & Mobile — React · Flutter · Node
          </span>
        </div>
      </div>

      {/* ── Developer feed + quick info, side by side on desktop ── */}
      <div ref={feedWrapRef} className="px-5 pt-8 pb-2 lg:px-16 grid lg:grid-cols-[minmax(0,380px)_1fr] gap-6" style={{ position: "relative", zIndex: 1 }}>
        <DeveloperFeed />
<div className="flex flex-col border border-white/[0.06]">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
              Quick Info
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: ".1em", color: "rgba(255,255,255,0.1)" }}>
              Lagos, NG — WAT
            </span>
          </div>
          <QuickInfo />

          {/* fills the leftover space left by the grid stretching this
              column to match the photo's height */}
          <div className="px-4 py-5 flex-1 flex flex-col justify-start border-t border-white/[0.06]">
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(20px, 2.4vw, 30px)",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.4)",
                lineHeight: 1.2,
                marginBottom: "16px",
                border: "1px dashed rgba(255,255,255,0.15)",
                display: "inline-block",
                alignSelf: "flex-start",
                padding: "10px 14px",
              }}
            >
              About Me
            </div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              lineHeight: 1.85,
              letterSpacing: ".02em",
              color: "rgba(255,255,255,0.5)",
            }}>
              I am a full-stack developer based in Lagos, Nigeria, building products
              people actually use. Working primarily in Django, Flutter, and React, I
              designs polished, responsive interfaces backed by resilient, well-engineered
              systems. I lead product development on Snatched Africa, a fitness and
              wellness app live on the Play Store for African women, and Nexo, a
              multi-tenant SaaS marketplace platform, while taking on freelance projects
              for clients across Nigeria and Africa. From secure, production grade
              platforms to cross-platform mobile apps with real time features, every
              product I builds is crafted with intention purposeful, scalable, and
              made to perform.
            </p>
          </div>
        </div>
      </div>

      {/* ── What I do ── */}
      <div ref={introRef} className="px-5 py-8 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">What I do</div>
        <p className="text-[14px] leading-[1.95] text-white/60 tracking-[.03em] lg:max-w-3xl">
          <span className="text-white/90">Passionate fullstack developer</span> with expertise
          in crafting dynamic, responsive web and mobile applications. I build scalable,
          high-performance products that deliver exceptional user experiences with stunning UIs
          on the front, bulletproof systems on the back.
        </p>
        <p className="mt-4 text-[13px] leading-[1.9] text-white/40 tracking-[.03em] lg:max-w-3xl">
          From production SaaS platforms with multi-layer security, to cross-platform mobile
          apps with real-time features every line of code is written with{" "}
          <span className="text-white/65">intention</span>.
        </p>
      </div>

      {/* ── Tech stack ── */}
      <div ref={stackRef} className="px-5 py-7 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">Tech stack</div>
        <div className="flex flex-wrap -m-[3px]">
          {techStack.map((tag) => (
            <span key={tag} className="about-tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-b border-white/[0.07] py-3 whitespace-nowrap">
        <div style={{ display: "inline-block", animation: "marquee-scroll 20s linear infinite" }}>
          {marqueeItems.map((item, i) => {
            const [first, ...rest] = item.split(" ");
            return (
              <span key={i} className="inline-block text-[10px] tracking-[.2em] uppercase text-white/20 px-7">
                {first} <span className="text-white/40">{rest.join(" ")}</span>
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
            <div key={i} className={`flex items-start gap-4 py-4 ${i > 0 ? "border-t border-white/[0.05]" : ""}`}>
              <span className="text-[9px] text-white/15 tracking-[.12em] w-5 flex-shrink-0 mt-0.5">0{i + 1}</span>
              <div>
                <div className="text-[12px] text-white/65 tracking-[.08em] mb-1.5">{item.title}</div>
                <div className="text-[11px] leading-[1.75] text-white/30 tracking-[.03em]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    {/* ── Philosophy quote ── */}
      <div ref={quoteRef} className="px-5 py-8 border-b border-white/[0.07] lg:px-16">
        <div className="section-label">Philosophy</div>
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-10 items-start">
          {/* ascii portrait, framed HUD-style to match DeveloperFeed */}
        <div
            className="relative mx-auto lg:mx-0 w-full max-w-[320px] lg:max-w-none"
            style={{ aspectRatio: "3 / 4", background: "#000", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div style={{ position: "absolute", top: "8px", left: "8px", width: "14px", height: "14px", borderTop: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "8px", right: "8px", width: "14px", height: "14px", borderTop: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "14px", height: "14px", borderBottom: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "14px", height: "14px", borderBottom: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", pointerEvents: "none" }} />
            <span style={{
              position: "absolute", top: "8px", left: "28px",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px", letterSpacing: ".16em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.25)", zIndex: 2,
            }}>
              archive // 01
            </span>
              <img
              src="/images/ascii_art.png"
              alt="image of the Developer"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{
                objectFit: "contain",
                mixBlendMode: "screen",
                opacity: 0.85,
              }}
            />

          </div>

          <PhilosophyRotator />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08]">
        {stats.map((s, i) => (
          <div key={i} ref={(el) => { statsRef.current[i] = el; }} className="bg-black px-5 py-5 lg:px-10 lg:py-7">
            <div className={`leading-none ${s.accent ? "text-[#e5ff47]" : "text-white"}`} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px, 6vw, 64px)" }}>
              {s.value}
            </div>
            <div className="text-[9px] tracking-[.18em] uppercase text-white/22 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div ref={ctaRef} className="px-5 py-8 lg:px-16">
        <div className="section-label">Work with me</div>
        <p className="text-[13px] leading-[1.85] text-white/45 tracking-[.03em] mb-6 lg:max-w-xl">
          Whether it's a startup MVP, a production SaaS or a mobile app from scratch — I bring{" "}
          <span className="text-white/75">the same precision and passion</span> to every
          engagement. Let's build something remarkable together.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glitch-hover inline-flex items-center gap-2.5 px-5 py-3 bg-[#25D366] text-black text-[11px] tracking-[.15em] uppercase transition-opacity hover:opacity-90"
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