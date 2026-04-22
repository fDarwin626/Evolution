import { useRef, useMemo, useEffect, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { servicesData } from "../constants";

gsap.registerPlugin(ScrollTrigger);

/* ─── SplitHeader ─── */
const SplitHeader = memo(({ text, style, delay = 0, triggerRef }) => {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const chars = wrapRef.current.querySelectorAll(".sh-char");
    gsap.set(chars, { yPercent: 110, skewY: 6, opacity: 0 });
    const a = gsap.to(chars, {
      yPercent: 0,
      skewY: 0,
      opacity: 1,
      duration: 0.75,
      ease: "power4.out",
      stagger: 0.032,
      delay,
      scrollTrigger: {
        trigger: triggerRef?.current || wrapRef.current,
        start: "top 92%",
        toggleActions: "play none none reverse",
      },
    });
    return () => {
      if (a.scrollTrigger) a.scrollTrigger.kill();
      a.kill();
    };
  }, [delay, triggerRef]);

  return (
    <span
      ref={wrapRef}
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
  );
});
SplitHeader.displayName = "SplitHeader";

const Services = () => {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const rowRefs     = useRef([]);
  const numRefs     = useRef([]);

  const currentYear = new Date().getFullYear();

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  );

  const text = `I build secure, high-performance full-stack mobile
and web applications with smooth UX to drive growth and productivity —
tailored to your business needs.`;

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cleanups = [];

    // Sub text + badge (non-header elements in headerRef)
    if (headerRef.current) {
      const a = gsap.from(headerRef.current.querySelectorAll(".srv-reveal"), {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current, start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    }

    // Each service row
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const a = gsap.from(el, {
        y: isMobile ? 50 : 80, opacity: 0,
        duration: isMobile ? 0.6 : 0.85,
        ease: "power3.out", clearProps: "all", force3D: true,
        scrollTrigger: {
          trigger: el, start: "top 88%",
          toggleActions: "play none none reverse", fastScrollEnd: true,
        },
      });
      cleanups.push(a);

      const numEl = numRefs.current[i];
      if (numEl) {
        const b = gsap.from(numEl, {
          opacity: 0, y: 20, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
        cleanups.push(b);
      }
    });

    return () => {
      cleanups.forEach((a) => {
        if (a.scrollTrigger) a.scrollTrigger.kill();
        a.kill();
      });
    };
  }, { dependencies: [isMobile] });

  return (
    <section
      ref={sectionRef}
      id="Services"
      className="bg-black text-white overflow-hidden rounded-t-2xl sm:rounded-t-3xl lg:rounded-t-[2rem]"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        .srv-section-label { font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
        .srv-item-row {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: border-color 0.2s;
        }
        .srv-item-row:last-child { border-bottom: none; }
        .srv-item-row:hover { border-color: rgba(255,255,255,0.12); }
        .srv-item-row:hover .srv-item-title { color: rgba(255,255,255,0.95); }
        .srv-item-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(12px, 1.4vw, 15px); letter-spacing: .05em;
          color: rgba(255,255,255,0.65); transition: color 0.2s; line-height: 1.4;
        }
        @keyframes srv-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-white/[0.07] lg:px-16">
        <span className="text-[10px] tracking-[.2em] uppercase text-white/25">My - Services</span>
        <span className="text-[10px] text-white/15 tracking-[.1em]">FD / {currentYear}</span>
      </div>

      {/* ── Hero header — split animated ── */}
      <div ref={headerRef} className="px-5 pt-8 pb-2 lg:px-16 lg:pt-14">
        <SplitHeader
          text="What I"
          triggerRef={headerRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(60px, 16vw, 150px)",
            lineHeight: 0.88,
            color: "#fff",
          }}
        />
        <SplitHeader
          text="Build."
          delay={0.08}
          triggerRef={headerRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(60px, 16vw, 150px)",
            lineHeight: 0.88,
            color: "rgba(255,255,255,0.2)",
          }}
        />

        {/* Sub text */}
        <div className="srv-reveal mt-6 lg:max-w-2xl">
          <p className="text-[12px] leading-[1.9] text-white/35 tracking-[.04em]">{text}</p>
        </div>

        {/* Badge */}
        <div className="srv-reveal mt-5 inline-flex items-center gap-2 border border-white/[0.12] px-3 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47] animate-pulse flex-shrink-0" />
          <span className="text-[10px] tracking-[.15em] uppercase text-white/45">
            Web · Mobile · SaaS · Security
          </span>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-y border-white/[0.06] py-3 whitespace-nowrap mb-0">
        <div style={{ display: "inline-block", animation: "srv-marquee 22s linear infinite" }}>
          {[
            "FullStack Dev", "Mobile Apps", "SaaS Platforms", "Security & Auth",
            "REST & GraphQL", "Real-Time Systems", "UI / UX Engineering", "DevOps & Docker",
            "FullStack Dev", "Mobile Apps", "SaaS Platforms", "Security & Auth",
            "REST & GraphQL", "Real-Time Systems", "UI / UX Engineering", "DevOps & Docker",
          ].map((item, i) => {
            const [first, ...rest] = item.split(" ");
            return (
              <span key={i} className="inline-block text-[10px] tracking-[.2em] uppercase text-white/20 px-6">
                {first} <span className="text-white/40">{rest.join(" ")}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Services list ── */}
      <div>
        {servicesData.map((service, index) => (
          <div
            key={`service-${index}`}
            ref={(el) => { rowRefs.current[index] = el; }}
            className="border-b border-white/[0.07] px-5 lg:px-16"
            style={{ paddingTop: "2.2rem", paddingBottom: "2.2rem" }}
          >
            <div className="flex items-start justify-between gap-6 mb-5">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div
                  ref={(el) => { numRefs.current[index] = el; }}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(36px, 5vw, 56px)",
                    lineHeight: 0.85,
                    color: "rgba(255,255,255,0.06)",
                    flexShrink: 0, userSelect: "none", letterSpacing: ".02em",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h2 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(26px, 4vw, 46px)",
                    lineHeight: 0.95, color: "rgba(255,255,255,0.88)",
                    letterSpacing: ".03em", marginBottom: "10px",
                  }}>
                    {service.title}
                  </h2>
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "clamp(11px, 1.2vw, 13px)", lineHeight: 1.85,
                    color: "rgba(255,255,255,0.38)", letterSpacing: ".03em", maxWidth: "520px",
                  }}>
                    {service.description}
                  </p>
                </div>
              </div>

              <div style={{
                flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", padding: "4px 9px",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: ".18em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap",
                alignSelf: "flex-start", marginTop: "6px",
              }}>
                {String(index + 1).padStart(2, "0")} / {String(servicesData.length).padStart(2, "0")}
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "18px" }} />

            <div>
              {service.items.map((item, itemIndex) => (
                <div key={`item-${index}-${itemIndex}`} className="srv-item-row">
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                    color: "rgba(255,255,255,0.15)", letterSpacing: ".12em",
                    flexShrink: 0, width: "22px", paddingTop: "2px",
                  }}>
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    width: "4px", height: "4px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)", flexShrink: 0, marginTop: "6px",
                  }} />
                  <span className="srv-item-title flex-1">{item.title}</span>
                  <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "10px", flexShrink: 0, paddingTop: "2px", transition: "color 0.2s" }}>↗</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom CTA strip ── */}
      <div className="px-5 py-8 flex items-center justify-between flex-wrap gap-4 lg:px-16">
        <div>
          <div className="srv-section-label mb-2">Ready to build?</div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: ".03em" }}>
            Let's talk about your project.
          </p>
        </div>
        <a
          href="#Contact"
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".18em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)",
            padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s", textDecoration: "none",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#e5ff47"; e.currentTarget.style.borderColor = "rgba(229,255,71,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
        >
          Start a project <span>↗</span>
        </a>
      </div>
    </section>
  );
};

export default Services;