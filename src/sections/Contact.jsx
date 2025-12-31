import { memo, useMemo, useCallback } from "react"
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { socials } from "../constants"
import Marquee from "../components/Marquee"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap/all"

const Contact = memo(() => {
  const text = `Got a question? Need a developer? how or project idea?
    Feel free to reach out. I'm always open to discussing further.`

  const items = useMemo(() => [
    `Now Just imagine , I code`,
    `Now Just imagine , I code`,
    `Now Just imagine , I code`,
    `Now Just imagine , I code`,
    `Now Just imagine , I code`,
    `Now Just imagine , I code`,
    `Now Just imagine , I code`,
  ], []);
  
  // Detect mobile with debouncing for performance
  const isMobile = useMemo(() => 
    typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );
    
  useGSAP(() => {
    const socialLinks = document.querySelectorAll(".social-link");
    if (!socialLinks.length) return;

    const anim = gsap.from(".social-link", {
      y: isMobile ? 30 : 100,
      opacity: 0,
      delay: 0.3,
      duration: isMobile ? 0.6 : 1,
      ease: isMobile ? "power2.out" : "back.out",
      stagger: isMobile ? 0.15 : 0.3,
      scrollTrigger: {
        trigger: ".social-link",
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        fastScrollEnd: true,
        preventOverlaps: true,
        once: false
      },
      clearProps: "all",
      force3D: true,
      willChange: "transform, opacity"
    });
       
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, { dependencies: [isMobile], scope: ".contact-section" });

  // Memoize email click handler
  const handleEmailClick = useCallback((e) => {
    e.preventDefault();
    window.location.href = "mailto:fuoseighadarwin@gmail.com";
  }, []);

  // Memoize phone click handler
  const handlePhoneClick = useCallback((e) => {
    e.preventDefault();
    window.location.href = "tel:+2349128218436";
  }, []);
    
  return (
    <section 
      id="contact" 
      className="contact-section flex flex-col justify-between min-h-screen bg-black"
    >
      <div>
        <AnimatedHeaderSection
          subtitle={"You Dream It, I Code It"}
          title={"Contact"}
          text={text}
          textcolor={"text-white"}
          withScrollTrigger={true}
        />
        
        <div className="flex px-4 font-light text-white uppercase
          leading-none mb-6
          sm:px-6 sm:mb-8
          md:px-10 md:mb-10
          text-[18px]
          sm:text-[22px]
          md:text-[24px]
          lg:text-[32px]"
        >
          <div className="flex flex-col w-full gap-4 sm:gap-6 md:gap-10">
            
            {/* Email Section */}
            <div className="social-link">
              <h2 className="mb-1 text-[18px] sm:text-[22px] md:text-[24px] lg:text-[32px]">
                E-mail
              </h2>
              <div className="w-full h-px my-2 bg-white/80"/>
              <a 
                href="mailto:fuoseighadarwin@gmail.com"
                onClick={handleEmailClick}
                className="block text-[14px] tracking-wider lowercase break-words
                  transition-colors duration-200 hover:text-white/80
                  sm:text-[16px]
                  md:text-xl
                  lg:text-2xl
                  xl:text-3xl
                  active:text-white/60"
              >
                fuoseighadarwin@gmail.com
              </a>
            </div>

            {/* Phone Section */}
            <div className="social-link">
              <h2 className="mb-1 text-[18px] sm:text-[22px] md:text-[24px] lg:text-[32px]">
                Phone
              </h2>
              <div className="w-full h-px my-2 bg-white/80"/>
              <a 
                href="tel:+2349128218436"
                onClick={handlePhoneClick}
                className="block text-[14px] lowercase
                  transition-colors duration-200 hover:text-white/80
                  sm:text-[16px]
                  md:text-xl
                  lg:text-2xl
                  xl:text-3xl
                  active:text-white/60"
              >
                +234 912 821 8436
              </a>
            </div>

            {/* Social Platforms Section */}
            <div className="social-link">
              <h2 className="mb-1 text-[18px] sm:text-[22px] md:text-[24px] lg:text-[32px]">
                Social Platforms
              </h2>
              <div className="w-full h-px my-2 bg-white/80"/>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {socials.map((social, index) => (
                  <a 
                    key={`${social.name}-${index}`}
                    className="text-[11px] leading-loose tracking-widest 
                      uppercase transition-colors duration-200
                      hover:text-white/80 active:text-white/60
                      touch-manipulation
                      sm:text-xs
                      md:text-sm"
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {"{"}
                    {social.name}
                    {"}"}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Marquee */}
      <Marquee
        items={items}
        className="text-white bg-transparent"
        icon="simple-icons:creativetechnology"
        IconclassName="w-12 h-12 text-gold
          sm:w-16 sm:h-16
          md:w-20 md:h-20
          lg:w-24 lg:h-24"
      />
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;