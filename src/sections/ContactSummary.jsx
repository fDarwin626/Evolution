import { useRef, useMemo } from 'react';
import Marquee from '../components/Marquee';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ContactSummary = () => {
    const containerRef = useRef(null);
    
    // Memoize arrays to prevent recreating on each render
    const items = useMemo(() => [
        "Innovative Solutions",
        "User-Centric Design", 
        "Cutting-Edge Tech", 
        "Seamless Functionality"
    ], []);
    
    const items2 = useMemo(() => [
        "Contact me",
        "Let's Collaborate",
        "Contact me", 
        "Build Together",
        "Contact me", 
        "Get in Touch",
        "Contact me",
        "Contact me",
    ], []);
    
    // Detect mobile for optimized scroll settings
    const isMobile = useMemo(() => 
        typeof window !== 'undefined' && window.innerWidth < 768,
        []
    );
    
    useGSAP(() => {
      const scrollTriggerInstance = gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: isMobile ? "+=400" : "+=800", // Shorter pin on mobile
          scrub: isMobile ? 0.3 : 0.5, // Smoother scrub on mobile
          pin: true,
          pinSpacing: true,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        force3D: true,
      });
      
      return () => {
        if (scrollTriggerInstance.scrollTrigger) {
          scrollTriggerInstance.scrollTrigger.kill();
        }
        scrollTriggerInstance.kill();
      };
    }, { dependencies: [isMobile], scope: containerRef });
    
  return (
  <section 
    ref={containerRef} 
    className="flex flex-col items-center
    justify-between min-h-screen 
    gap-6 mt-8
    sm:gap-8 sm:mt-10
    md:gap-12 md:mt-16
    text-center px-4 sm:px-6"
  >
    <Marquee
      items={items}
    />
    
    <div className="overflow-hidden font-light text-center
      contact-text-responsive w-full max-w-full
      text-[28px] leading-tight
      sm:text-[36px] sm:leading-snug
      md:text-[48px] md:leading-normal
      lg:text-[56px]
      xl:text-[64px]"
    >
      <p className="px-2 sm:px-4"> 
        " Let's build a <br/>
        <span className='font-normal'>memorable</span> & <span className='italic'>inspiring</span><br/>
        <span className="block sm:inline">web and Mobile applications</span> <span className='text-gold'>together</span>"
      </p>
    </div>
    
    <Marquee
      items={items2}
      reverse={true}
      className='text-black bg-transparent border-y-2'
      IconclassName='stroke-gold stroke-2 text-primary
        w-6 h-6
        sm:w-8 sm:h-8
        md:w-10 md:h-10
        lg:w-12 lg:h-12'
      icon='material-symbols-light:square'
    />
  </section>
  );
};

export default ContactSummary;