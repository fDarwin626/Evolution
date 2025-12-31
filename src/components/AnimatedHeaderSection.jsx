import { useRef, memo } from "react"
import AnimatedTextLines from "../components/AnimatedTextLines"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const AnimatedHeaderSection = memo(({
  subtitle, 
  title, 
  text, 
  textcolor, 
  withScrollTrigger = false
}) => {
  const contextRef = useRef(null)
  const headerRef = useRef(null)

  useGSAP(() => {
    // Early return if refs aren't ready
    if (!contextRef.current || !headerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: withScrollTrigger ? {
        trigger: contextRef.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        // Improve mobile performance
        fastScrollEnd: true,
        preventOverlaps: true
      } : undefined
    });

    tl.from(contextRef.current, {
      y: '50vh',
      duration: 1,
      ease: 'circ.out',
      // Use will-change sparingly
      willChange: 'transform'
    })
    .from(headerRef.current, {
      opacity: 0,
      y: 200,
      duration: 1,
      ease: "circ.out",
      clearProps: "all" // Clean up inline styles after animation
    }, "<+0.2");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, { scope: contextRef, dependencies: [withScrollTrigger] });

  return (
    <div ref={contextRef} className="will-change-auto">
      <div 
        style={{ clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)' }} 
        className="overflow-hidden"
      >
        <div 
          ref={headerRef} 
          className="flex flex-col justify-center gap-12 pt-16 sm:gap-16"
        >
          <p className={`text-sm font-light tracking-[0.5rem] uppercase px-10 ${textcolor}`}>
            {subtitle}
          </p>
          <div className="px-10 py-6 md:py-8">
            <h1 className={`flex flex-col flex-wrap gap-12 ${textcolor} uppercase banner-text-responsive sm:gap-16 md:block`}>
              {title}
            </h1>
          </div>
        </div>
      </div>
      
      <div className={`relative px-10 mt-8 ${textcolor}`}>
        <div className="absolute inset-x-0 border-t-2" />
        <div className="py-12 sm:py-16 text-end">
          <AnimatedTextLines 
            text={text}
            className={`font-light uppercase value-text-responsive ${textcolor}`}
          />
        </div>
      </div>
    </div>    
  );
});

AnimatedHeaderSection.displayName = 'AnimatedHeaderSection';

export default AnimatedHeaderSection;