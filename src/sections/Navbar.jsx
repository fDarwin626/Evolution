import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { socials } from "../constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Link } from "react-scroll"

const Navbar = () => {
    const navRef = useRef(null)
    const linksRef = useRef([])
    const contactRef = useRef(null)
    const topLineRef = useRef(null)
    const bottomLineRef = useRef(null)
    const tl = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const iconTl = useRef(null)
    const [showBurger, setShowBurger] = useState(true)

    // Detect mobile for optimizations
    const isMobile = useMemo(() => 
      typeof window !== 'undefined' && window.innerWidth < 768,
      []
    );

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10)
                    lastScrollY = currentScrollY
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', handleScroll, {
          passive: true,
        })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useGSAP(() => {
      gsap.set(navRef.current, {
          xPercent: 100
      })
      gsap.set([linksRef.current, contactRef.current], {
        autoAlpha: 0,
        x: isMobile ? -10 : -20,
      })
      
     tl.current =
      gsap.timeline({ paused: true }).to(navRef.current, {
        xPercent: 0,
        duration: isMobile ? 0.8 : 1.2,
        ease: "power3.out"
      }).to(linksRef.current, {
        autoAlpha: 1,
        x: 0,
        stagger: isMobile ? 0.08 : 0.1,
        duration: isMobile ? 0.4 : 0.5,
        ease: "power2.out",
      },
      "<"
    ).to(contactRef.current, {
      autoAlpha: 1,
      x: 0,
      duration: isMobile ? 0.4 : 0.5,
      ease: 'power2.out'
    },
    "<+0.2"
  )
  
   iconTl.current =
    gsap.timeline({ paused: true }).to(topLineRef.current, {
    rotate: 45,
    y: 3.3,
    duration: 0.3,
    ease: 'power2.inOut'
  }).to(bottomLineRef.current, {
      rotate: -45,
      y: -3.3,
      duration: 0.3,
      ease: 'power2.inOut'
  }, '<')
    }, [isMobile])

    const toggleMenu = useCallback(() => {
      if (isOpen) {
        tl.current.reverse()
        iconTl.current.reverse()
      } else {
        tl.current.play()
        iconTl.current.play()
      }
      setIsOpen(!isOpen)
    }, [isOpen])
    
    const handleLinkClick = useCallback(() => {
      if (isOpen) {
        tl.current.reverse()
        iconTl.current.reverse()
        setIsOpen(false)
      }
    }, [isOpen])

  return (
    <>
      <nav ref={navRef} className="fixed z-50 flex flex-col justify-between
      w-full h-full uppercase bg-black text-white/80
      px-6 py-20 gap-y-8
      sm:px-8 sm:py-24 sm:gap-y-9
      md:px-10 md:py-28 md:gap-y-10 md:left-1/2 left-1/2">
          <div className="flex flex-col gap-y-2
          text-3xl
          sm:text-4xl
          md:text-6xl
          lg:text-8xl">
            {['Home', 'Services', 'About', 'Projects', 'contact'].map((section, index) => (
              <div key={`nav-${section}-${index}`} 
                ref={(el) => (linksRef.current[index] = el)} 
                className="">
                <Link to={`${section}`}
                 smooth
                 offset={0}
                 duration={1000}
                 onClick={handleLinkClick}
                 className="transition-all duration-300 cursor-pointer
                 hover:text-white active:text-white/60 touch-manipulation">
                  {section}
                </Link>
              </div> 
            ))}
          </div>
          
          <div ref={contactRef} className="flex flex-col flex-wrap justify-between
          gap-6
          sm:gap-7
          md:gap-8 md:flex-row">
              <div className="font-light">
                <p className="tracking-wider text-white/50 text-sm sm:text-base">E-mail</p>
                <a 
                  href="mailto:fuoseighadarwin@gmail.com"
                  className="block lowercase transition-colors duration-300
                  hover:text-white active:text-white/60
                  text-base leading-relaxed
                  sm:text-lg sm:leading-relaxed
                  md:text-xl md:tracking-widest text-pretty break-all">
                  fuoseighadarwin@gmail.com
                </a>
              </div>
              
              <div className="font-light">
                <p className="tracking-wider text-white/50 text-sm sm:text-base">Social platforms</p>
                <div className="flex flex-col flex-wrap gap-x-2
                md:flex-row">
                    {socials.map((social, index) => (
                      <a key={`social-${social.name}-${index}`}
                      href={social.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="leading-loose tracking-widest 
                      uppercase hover:text-white active:text-white/60
                      transition-colors duration-300 touch-manipulation
                      text-xs
                      sm:text-sm">
                        {'{'}
                        {social.name}
                        {'}'}
                      </a>
                    ))}
                </div>
              </div>
          </div>
      </nav>
      
       <div className="fixed z-50 flex flex-col items-center justify-center
       gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer
       touch-manipulation
       w-12 h-12 top-3 right-4
       sm:w-14 sm:h-14 sm:top-4 sm:right-6
       md:w-20 md:h-20 md:top-4 md:right-10" 
       onClick={toggleMenu}
       style={showBurger
         ? { clipPath: "circle(50% at 50% 50%)" }
         : { clipPath: "circle(0% at 50% 50%)" }}>
        <span ref={topLineRef} className="block rounded-full origin-center
        w-6 h-0.5
        sm:w-7 sm:h-0.5
        md:w-8 md:h-0.5
        bg-white"/>
        <span ref={bottomLineRef} className="block rounded-full origin-center
        w-6 h-0.5
        sm:w-7 sm:h-0.5
        md:w-8 md:h-0.5
        bg-white"/>
       </div>
    </>
  )
}

export default Navbar