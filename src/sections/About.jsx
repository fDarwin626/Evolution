import { useRef, useMemo, memo } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import AnimatedTextLines from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About = memo(() => {
  const text = `I'm a passionate FullStack web/mobile app Developer with 
    expertise in crafting dynamic and responsive applications.`

  const aboutText = `Passionate about leveraging technology to solve real-world problems, I build scalable, high-performance web and mobile applications that deliver exceptional user experiences. My expertise spans both frontend and backend development, allowing me to create stunning UIs coupled with bulletproof backend systems. Let's collaborate to bring your ideas to life!


When I'm not coding?

- You can find me exploring the latest tech trends
- Crafting furniture (yes, I love woodworking) as a matter of fact, I'm also a carpenter
- Indulging in my love for travel`;
    
  const imgRef = useRef(null);
  const sectionRef = useRef(null);
  
  // Detect mobile for conditional animations
  const isMobile = useMemo(() => 
    typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );
    
  useGSAP(() => {
    if (!sectionRef.current || !imgRef.current) return;

    // Scale animation - lighter on mobile
    const scaleAnimation = gsap.to(sectionRef.current, {
      scale: isMobile ? 0.98 : 0.95, // Less aggressive on mobile
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: isMobile ? 0.5 : true, // Smooth scrub on mobile
        fastScrollEnd: true,
        preventOverlaps: true
      },
      ease: "power1.inOut",
    });
       
    // Image reveal animation
    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 75% 100%, 100% 100%, 0% 100%)",
    });
       
    const imgAnimation = gsap.to(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
      duration: isMobile ? 1.5 : 2.1, // Faster on mobile
      ease: "power4.out",
      scrollTrigger: {
        trigger: imgRef.current,
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
  }, { scope: sectionRef, dependencies: [isMobile] });
    
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
        <img
          ref={imgRef}
          src="images/my_img.jpg"
          alt="man image"
          className="w-full max-w-[280px]
            sm:max-w-[320px]
            md:max-w-[400px]
            lg:max-w-md
            rounded-2xl
            sm:rounded-2xl
            lg:rounded-3xl"
          loading="lazy"
          decoding="async"
          style={{
            transform: 'translateZ(0)',
            willChange: 'clip-path'
          }}
        />
        
        <AnimatedTextLines 
          text={aboutText}
          className="w-full max-w-full lg:max-w-none"
        />
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;