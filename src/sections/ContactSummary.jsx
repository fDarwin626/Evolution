import { useRef, useMemo, useEffect, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── SplitHeader: clip-from-below char stagger reveal ─── */
const SplitHeader = memo(({ text, style, className, delay = 0, triggerRef }) => {
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
      className={className}
      style={{ display: "block", overflow: "hidden", ...style }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="sh-char"
          style={{
            display: "inline-block",
            whiteSpace: ch === " " ? "pre" : undefined,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
});
SplitHeader.displayName = "SplitHeader";

const ContactSummary = () => {
  const sectionRef  = useRef(null);
  const headRef     = useRef(null);
  const subRef      = useRef(null);
  const ctaRef      = useRef(null);
  const lineRef     = useRef(null);

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  );

  const WHATSAPP_URL = "https://wa.me/2349128218436?text=Hello%20Darwin%2C%20I%20came%20across%20your%20portfolio%20and%20I%27d%20love%20to%20collaborate%20with%20you%20on%20a%20project.%20Let%27s%20build%20something%20remarkable%20together!";

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cleanups = [];

    // Line draws in
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      const a = gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    }

    if (subRef.current) {
      const a = gsap.from(subRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: subRef.current,
          start: "top 94%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    }

    if (ctaRef.current) {
      const a = gsap.from(ctaRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 95%",
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
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-24 lg:py-32"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>

      {/* Top rule */}
      <div className="px-5 lg:px-16 mb-10 sm:mb-14">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            opacity: 0.25,
            flexShrink: 0,
          }}>
            Let's talk
          </span>
          <div
            ref={lineRef}
            style={{ flex: 1, height: "1px", background: "currentColor", opacity: 0.1 }}
          />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            letterSpacing: ".15em",
            opacity: 0.12,
            flexShrink: 0,
          }}>
            FD / 2025
          </span>
        </div>
      </div>

      {/* Giant headline — now split-animated */}
      <div ref={headRef} className="px-5 lg:px-16">
        {/* "Got a" */}
        <SplitHeader
          text="Got a"
          triggerRef={headRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 15vw, 148px)",
            lineHeight: 0.88,
            letterSpacing: ".01em",
            opacity: 0.9,
          }}
        />

        {/* "Project" + "in mind?" inline */}
        <div className="overflow-hidden flex items-end gap-4 flex-wrap" style={{ lineHeight: 0.88 }}>
          <SplitHeader
            text="Project"
            delay={0.07}
            triggerRef={headRef}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(56px, 15vw, 148px)",
              lineHeight: 0.88,
              letterSpacing: ".01em",
              opacity: 0.18,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(11px, 1.4vw, 14px)",
              letterSpacing: ".06em",
              opacity: 0.35,
              paddingBottom: "clamp(8px, 1.5vw, 18px)",
              display: "inline-block",
            }}
          >
            in mind?
          </span>
        </div>

        {/* "Let's build." */}
        <SplitHeader
          text="Let's build."
          delay={0.14}
          triggerRef={headRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 15vw, 148px)",
            lineHeight: 0.88,
            letterSpacing: ".01em",
            opacity: 0.9,
          }}
        />
      </div>

      {/* Sub copy + CTA row */}
      <div ref={subRef} className="px-5 mt-8 sm:mt-12 lg:px-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:max-w-5xl">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(11px, 1.3vw, 13px)",
            lineHeight: 1.9,
            opacity: 0.35,
            maxWidth: "420px",
            letterSpacing: ".03em",
          }}>
            From MVP to production-grade SaaS — I bring the same precision<br className="hidden sm:block" />
            and passion to every engagement.
          </p>

          {/* CTA */}
          <div ref={ctaRef} style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "11px 20px",
                background: "#25D366",
                color: "#000",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp ↗
            </a>
          </div>
        </div>
      </div>

      {/* Bottom stat row */}
      <div className="px-5 mt-12 sm:mt-16 border-t lg:px-16" style={{ borderColor: "rgba(0,0,0,0.08)", paddingTop: "24px" }}>
        <div style={{ display: "flex", gap: "clamp(20px, 5vw, 60px)", flexWrap: "wrap" }}>
          {[
            { val: "3+",  label: "Years exp." },
            { val: "∞",   label: "Coffee consumed" },
            { val: "24h", label: "Response time" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                lineHeight: 0.9,
                opacity: 0.8,
              }}>
                {s.val}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                opacity: 0.25,
                marginTop: "5px",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSummary;