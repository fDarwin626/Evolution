import { useRef, useMemo, memo } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef([]);
  const bioRef = useRef(null);

  const isMobile = useMemo(() =>
    typeof window !== 'undefined' && window.innerWidth < 768, []
  );

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cleanups = [];

    // Scale-down on scroll out
    const scaleAnim = gsap.to(sectionRef.current, {
      scale: isMobile ? 0.98 : 0.95,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: isMobile ? 0.5 : true,
        fastScrollEnd: true,
        preventOverlaps: true,
      },
      ease: "power1.inOut",
    });
    cleanups.push(scaleAnim);

    // Hero title reveal
    if (heroRef.current) {
      const heroAnim = gsap.from(heroRef.current.querySelectorAll('.reveal-line'), {
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
      cleanups.push(heroAnim);
    }

    // Image clip-path reveal
    if (imgRef.current) {
      gsap.set(imgRef.current, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      });
      const imgAnim = gsap.to(imgRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: isMobile ? 1.2 : 1.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
        clearProps: "all",
      });
      cleanups.push(imgAnim);
    }

    // Bio fade in
    if (bioRef.current) {
      const bioAnim = gsap.from(bioRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(bioAnim);
    }

    // Stats stagger
    if (statsRef.current.length) {
      const statsAnim = gsap.from(statsRef.current.filter(Boolean), {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(statsAnim);
    }

    return () => {
      cleanups.forEach(a => {
        if (a.scrollTrigger) a.scrollTrigger.kill();
        a.kill();
      });
    };
  }, { dependencies: [isMobile] });

  const stats = [
    { value: "3+", label: "Years exp.", accent: false },
    { value: projects.length, label: "Projects shipped", accent: true },
    { value: "FS", label: "Web & Mobile", accent: false },
    { value: "∞", label: "Coffee consumed", accent: false },
  ];

  const offItems = [
    { icon: "clock", text: "Exploring the latest tech trends" },
    { icon: "tool", text: "Woodworking & carpentry" },
    { icon: "pin", text: "Travel & exploring new places" },
  ];

  return (
    <section
      ref={sectionRef}
      id="About"
      className="bg-black text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl lg:rounded-b-[2rem]"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-white/[0.07]">
        <span className="text-[10px] tracking-[.2em] uppercase text-white/30">Portfolio — About</span>
        <span className="text-[10px] text-white/15 tracking-[.1em]">FD / 2025</span>
      </div>

      {/* Hero title */}
      <div ref={heroRef} className="px-5 pt-8 pb-0 overflow-hidden">
        <div className="reveal-line overflow-hidden">
          <span
            className="block leading-[.88] tracking-[.01em] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 22vw, 120px)" }}
          >
            Full<span className="text-white/20">Stack</span>
          </span>
        </div>
        <div className="reveal-line overflow-hidden">
          <span
            className="block leading-[.88] tracking-[.01em] text-white/35"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 22vw, 120px)" }}
          >
            Dev.
          </span>
        </div>
        <div className="reveal-line mt-4 inline-flex items-center gap-2 border border-white/12 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47] animate-pulse flex-shrink-0" />
          <span className="text-[11px] tracking-[.18em] uppercase text-white/50">
            Web & Mobile — React · Flutter · Node
          </span>
        </div>
      </div>

      {/* Image + info grid */}
      <div className="mt-7 grid grid-cols-2 gap-px bg-white/[0.08]">
        {/* Photo cell */}
        <div className="bg-black relative overflow-hidden">
          <div ref={imgRef} className="w-full h-[220px] sm:h-[280px]">
            <LazyLoadImage
              src="images/my_img.jpg"
              alt="portrait"
              effect="blur"
              threshold={100}
              className="w-full h-full object-cover"
              style={{ transform: 'translateZ(0)', willChange: 'clip-path' }}
            />
          </div>
          <span className="absolute bottom-2.5 left-3 text-[9px] tracking-[.15em] uppercase text-white/25">
            my_img.jpg
          </span>
        </div>

        {/* Info cell */}
        <div className="bg-black px-4 py-5 flex flex-col justify-between">
          <div>
            <div className="text-[9px] tracking-[.2em] uppercase text-white/20 mb-1">Based in</div>
            <div
              className="text-white leading-none mb-1"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48 }}
            >
              NG
            </div>
            <div className="text-[10px] text-white/30 tracking-[.1em]">Nigeria · Open remote</div>
          </div>
          <div className="mt-6">
            <div className="text-[9px] tracking-[.2em] uppercase text-white/20 mb-2">Stack</div>
            {["React · Next.js", "Python · FastAPI", "Flutter · Go"].map(s => (
              <div key={s} className="text-[10px] text-white/35 tracking-[.1em] mb-1.5">{s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden border-t border-b border-white/[0.07] py-3.5 whitespace-nowrap">
        <div
          className="inline-block"
          style={{ animation: "marquee 18s linear infinite" }}
        >
          {["FullStack Development", "Mobile Apps", "Security & Optimization", "UI / UX", "SaaS Architecture"].concat(
            ["FullStack Development", "Mobile Apps", "Security & Optimization", "UI / UX", "SaaS Architecture"]
          ).map((item, i) => (
            <span key={i} className="inline-block text-[11px] tracking-[.2em] uppercase text-white/20 px-8">
              {item.split(" ")[0]} <strong className="text-white/45 font-normal">{item.split(" ").slice(1).join(" ")}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div ref={bioRef} className="px-5 py-7 border-b border-white/[0.07]">
        <p className="text-[13px] leading-[1.9] text-white/50 tracking-[.03em]">
          <strong className="text-white/85 font-normal">Passionate about building things that matter.</strong>{" "}
          I craft scalable, high-performance web and mobile apps — stunning UIs on the front,
          bulletproof systems on the back. Every line of code is written with purpose.
        </p>
      </div>

      {/* When not coding */}
      <div className="px-5 pt-6">
        <div className="text-[9px] tracking-[.2em] uppercase text-white/20 mb-4">When I'm not coding</div>
        <div className="flex flex-col">
          {offItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 py-3.5 text-[12px] text-white/40 tracking-[.05em] ${i > 0 ? "border-t border-white/[0.06]" : ""}`}
            >
              <span className="text-[9px] text-white/15 tracking-[.12em] w-5 flex-shrink-0">0{i + 1}</span>
              <span className="w-7 h-7 border border-white/10 flex items-center justify-center flex-shrink-0 text-[10px]">
                {item.icon === "clock" ? "◷" : item.icon === "tool" ? "⌧" : "◉"}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.08] mt-7">
        {stats.map((s, i) => (
          <div
            key={i}
            ref={el => statsRef.current[i] = el}
            className="bg-black px-4 py-5"
          >
            <div
              className={`leading-none tracking-[.01em] ${s.accent ? "text-[#e5ff47]" : "text-white"}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52 }}
            >
              {s.value}
            </div>
            <div className="text-[9px] tracking-[.18em] uppercase text-white/25 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between px-5 py-6 border-t border-white/[0.07] mt-px">
        <button
          className="text-[11px] tracking-[.18em] uppercase px-5 py-3 border border-white/20 text-white/70 bg-transparent hover:bg-white/5 hover:border-white/40 hover:text-white transition-all"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Let's build — ↗
        </button>
        <span className="flex items-center gap-2 text-[10px] text-white/20 tracking-[.1em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47]" />
          Available now
        </span>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
      `}</style>
    </section>
  );
});

About.displayName = 'About';
export default About;