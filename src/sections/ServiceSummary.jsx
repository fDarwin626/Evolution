import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  const sectionRef = useRef(null);
  const lineRef    = useRef(null);

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  );

  const rows = [
    { id: "svc-1", text: "Architecture",                dir: 1,   italic: false, offset: "0px"   },
    { id: "svc-2", text: "Development",                 dir: -1,  italic: false, offset: "0px"   },
    { id: "svc-3", text: "Deployment",                  dir: 1,   italic: true,  offset: "0px"   },
    { id: "svc-4", text: "APIs & Integration",          dir: -1,  italic: false, offset: "0px"   },
    { id: "svc-5", text: "FullStack · Mobile",          dir: 1,   italic: false, offset: "0px"   },
    { id: "svc-6", text: "Scalability",                 dir: -1,  italic: true,  offset: "0px"   },
  ];

  useGSAP(() => {
    const anims = [];

    rows.forEach(({ id, dir }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const a = gsap.to(el, {
        xPercent: dir * (isMobile ? 12 : 28),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scrub: isMobile ? 0.6 : 1,
          fastScrollEnd: true,
        },
        force3D: true,
      });
      anims.push(a);
    });

    // Thin line draws on scroll
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      const a = gsap.to(lineRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
        },
      });
      anims.push(a);
    }

    return () => {
      anims.forEach((a) => {
        if (a.scrollTrigger) a.scrollTrigger.kill();
        a.kill();
      });
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-24"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .svc-row {
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
          line-height: 0.88;
          padding: 0.1em 0;
        }
        .svc-divider {
          display: inline-block;
          height: 3px;
          background: currentColor;
          opacity: 0.15;
          flex-shrink: 0;
        }
      `}</style>

      {/* Section label */}
      <div className="flex items-center gap-4 px-5 mb-10 lg:px-16">
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          opacity: 0.3,
        }}>
          What I do
        </span>
        <div
          ref={lineRef}
          style={{ flex: 1, height: "1px", background: "currentColor", opacity: 0.1 }}
        />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          letterSpacing: ".15em",
          opacity: 0.15,
        }}>
          FD / 2025
        </span>
      </div>

      {/* Kinetic text rows */}
      <div style={{ overflow: "hidden" }}>
        {rows.map((row, i) => (
          <div
            key={row.id}
            id={row.id}
            className="svc-row"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(44px, 12vw, 130px)",
              letterSpacing: ".02em",
              opacity: i % 2 === 0 ? 0.9 : 0.22,
              fontStyle: row.italic ? "italic" : "normal",
              gap: "clamp(12px, 2vw, 32px)",
              transform: `translateX(${row.dir * (i * 3)}px)`,
            }}
          >
            {/* Decorative dot for alternating rows */}
            {i % 3 === 1 && (
              <span
                className="svc-divider"
                style={{ width: "clamp(20px, 4vw, 60px)" }}
              />
            )}
            <span>{row.text}</span>
            {i % 3 === 2 && (
              <span
                className="svc-divider"
                style={{ width: "clamp(20px, 4vw, 60px)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom micro label */}
      <div className="flex justify-center mt-10">
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          opacity: 0.18,
        }}>
          Scroll to explore services ↓
        </span>
      </div>
    </section>
  );
};

export default ServiceSummary;