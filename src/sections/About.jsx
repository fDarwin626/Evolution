import { useRef, useMemo, memo } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import AnimatedTextLines from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
  const text = `I'm a passionate FullStack web/mobile app Developer with 
    expertise in crafting dynamic and responsive applications.`

  const aboutText = `Passionate about leveraging technology to solve real-world problems, I build scalable, high-performance web and mobile applications that deliver exceptional user experiences. My expertise spans both frontend and backend development, allowing me to create stunning UIs coupled with bulletproof backend systems. Let's collaborate to bring your ideas to life!


When I'm not coding?

- You can find me exploring the latest tech trends
- Crafting furniture (yes, I love woodworking) as a matter of fact, I'm also a carpenter
- Indulging in my love for travel`;

  const imgWrapperRef = useRef(null);
  const sectionRef = useRef(null);

  const isMobile = useMemo(() =>
    typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );

  useGSAP(() => {
    if (!sectionRef.current || !imgWrapperRef.current) return;

    const scaleAnimation = gsap.to(sectionRef.current, {
      scale: isMobile ? 0.98 : 0.95,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: isMobile ? 0.5 : true,
        fastScrollEnd: true,
        preventOverlaps: true
      },
      ease: "power1.inOut",
    });

    const imgElement = imgWrapperRef.current.querySelector('img');
    if (!imgElement) return;

    gsap.set(imgElement, {
      clipPath: "polygon(0 100%, 75% 100%, 100% 100%, 0% 100%)",
    });

    const imgAnimation = gsap.to(imgElement, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
      duration: isMobile ? 1.5 : 2.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: imgWrapperRef.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        fastScrollEnd: true
      },
      clearProps: "all"
    });

    return () => {
      if (scaleAnimation.scrollTrigger) scaleAnimation.scrollTrigger.kill();
      scaleAnimation.kill();
      if (imgAnimation.scrollTrigger) imgAnimation.scrollTrigger.kill();
      imgAnimation.kill();
    };
  }, { dependencies: [isMobile] });

  return (
    <section
      ref={sectionRef}
      id='About'
      className="min-h-screen bg-black rounded-b-2xl sm:rounded-b-3xl lg:rounded-b-4xl"
    >
      <AnimatedHeaderSection
        subtitle={"Code with purpose, Built to scale"}
        title={'About'}
        text={text}
        textcolor={"text-white"}
        withScrollTrigger={true}
      />

      <div className="flex flex-col items-center justify-between
        gap-8 px-6 pb-12
        sm:gap-12 sm:px-8 sm:pb-14
        md:gap-16 md:px-10 md:pb-16
        lg:flex-row lg:gap-16
        text-base font-light tracking-wide
        sm:text-lg
        md:text-xl
        lg:text-2xl
        xl:text-3xl
        text-white/60"
      >
        <div
          ref={imgWrapperRef}
          className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-md"
        >
          <LazyLoadImage
            src="images/my_img.jpg"
            alt="man image"
            effect="blur"
            threshold={100}
            className="w-full rounded-2xl sm:rounded-2xl lg:rounded-3xl"
            style={{
              transform: 'translateZ(0)',
              willChange: 'clip-path'
            }}
          />
        </div>

        <AnimatedTextLines
          text={aboutText}
          className="w-full max-w-full lg:max-w-none"
        />
      </div>

      {/* Stats strip */}
      <div className="flex border-t border-white/10">
        <div className="flex-1 px-6 py-5 border-r border-white/10
          sm:px-8 md:px-10">
          <span className="block font-light text-white
            text-3xl sm:text-4xl md:text-5xl mb-1">
            3+
          </span>
          <span className="text-xs tracking-widest uppercase text-white/30">
            Years exp.
          </span>
        </div>

        <div className="flex-1 px-6 py-5 border-r border-white/10
          sm:px-8 md:px-10">
          <span className="block font-light text-white
            text-3xl sm:text-4xl md:text-5xl mb-1">
            {projects.length}
          </span>
          <span className="text-xs tracking-widest uppercase text-white/30">
            Projects shipped
          </span>
        </div>

        <div className="flex-1 px-6 py-5 border-r border-white/10
          sm:px-8 md:px-10">
          <span className="block font-light text-white
            text-3xl sm:text-4xl md:text-5xl mb-1">
            FS
          </span>
          <span className="text-xs tracking-widest uppercase text-white/30">
            Web &amp; Mobile
          </span>
        </div>

        <div className="flex-1 px-6 py-5 sm:px-8 md:px-10">
          <span className="block font-light text-white
            text-3xl sm:text-4xl md:text-5xl mb-1">
            ∞
          </span>
          <span className="text-xs tracking-widest uppercase text-white/30">
            Coffee consumed
          </span>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;