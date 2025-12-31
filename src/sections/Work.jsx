import { Icon } from "@iconify/react"
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { projects } from "../constants"
import { useMediaQuery } from "react-responsive"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Work = () => {
    const overlayRefs = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });
    const text = `Featured projects that have been crafted with precision and creativity, showcasing a blend of innovative design and robust functionality. Each project reflects a commitment to excellence and a passion for delivering impactful solutions. Explore these highlights to see how we bring ideas to life through meticulous planning, cutting-edge technology, and a user centric approach. {CLICK ON THE PROJECT TITLE TO SEE FULL LIVE SITE OF PROJECT}`
    const isMobile = useMediaQuery({ maxWidth: 853 })
    const [currentIndex, setCurrentIndex] = useState(null);
    const previewRef = useRef(null);
    const moveX = useRef(null);
    const moveY = useRef(null);
    
    // Memoize mobile text
    const displayText = useMemo(() => 
      isMobile ? "Featured projects that have been crafted with precision and creativity" : text,
      [isMobile, text]
    );

    const handleMouseEnter = useCallback((index) => {
      if (window.innerWidth < 768) return;
      setCurrentIndex(index);
      const el = overlayRefs.current[index];
      if (!el) return;
      
      gsap.killTweensOf(el);
      gsap.fromTo(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)"
      },
      {
        clipPath: "polygon(0 100%, 100% 100%, 99% 0, 0 0)",
        duration: 0.15,
        ease: "power2.out",
      })

      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }, []);

    useGSAP(() => {
      if (window.innerWidth >= 768) {
        moveX.current = gsap.quickTo(previewRef.current, "x", {
          duration: 1.2,
          ease: "power3.out", 
        })

        moveY.current = gsap.quickTo(previewRef.current, "y", {
          duration: 1.5,
          ease: "power3.out", 
        })
      }
     
      const anim = gsap.from("#Projects", {
        y: isMobile ? 50 : 100,
        opacity: 0,
        delay: 0.3,
        duration: isMobile ? 0.7 : 1,
        stagger: 0.3,
        ease: "back.out",
        scrollTrigger: {
          trigger: "#Projects",
          start: "top 85%",
          fastScrollEnd: true,
        },
        force3D: true,
      })
      
      return () => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill()
        anim.kill()
        if (previewRef.current) {
          gsap.killTweensOf(previewRef.current)
        }
      }
    }, [isMobile])

    const handleMouseLeave = useCallback((index) => {
      if (window.innerWidth < 768) return;
      setCurrentIndex(null);
      const el = overlayRefs.current[index];
      if (!el) return;
      
      gsap.killTweensOf(el);
      gsap.to(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.2,
        ease: "power2.out",
      })
      
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.out",
      })
    }, []);
    
    const handleMouseMove = useCallback((e) => {
      if (window.innerWidth < 768 || !moveX.current || !moveY.current) return;
      
      // CRITICAL FIX: Offset the image downward so users can see it properly
      mouse.current.x = e.clientX + 24;
      mouse.current.y = e.clientY + 120; // Changed from +24 to +120 for better visibility
      
      moveX.current(mouse.current.x);
      moveY.current(mouse.current.y);
    }, []);
    
    useEffect(() => {
      return () => {
        if (previewRef.current) {
          gsap.killTweensOf(previewRef.current)
        }
        overlayRefs.current.forEach(el => {
          if (el) gsap.killTweensOf(el)
        })
      }
    }, [])

    return (
    <section id="Projects" className="flex flex-col min-h-screen">
        <AnimatedHeaderSection
         subtitle={"Logic meets Asthetics, Seamlessly"}
         title={"Projects"}
         text={displayText}
         textcolor={"text-black"}
         withScrollTrigger={true}
        />
        <div className="relative flex flex-col font-light"
        onMouseMove={handleMouseMove}>
            {projects.map((project, index) => (
                <div key={project.id}
                 className="relative flex flex-col py-5
                 cursor-pointer group
                 gap-1
                 sm:gap-1
                 md:gap-0"
                 onMouseEnter={() => handleMouseEnter(index)}
                 onMouseLeave={() => handleMouseLeave(index)}>
                  <div ref={(el) => {
                    overlayRefs.current[index] = el
                  }}
                  className="absolute inset-0 hidden md:block 
                  duration-200 bg-black -z-10 clip-path will-change-transform"/>
                  
                  <div className="flex justify-between text-black
                  transition-all duration-500 md:group-hover:text-white
                  px-4
                  sm:px-6
                  md:px-10 md:group-hover:px-12">
                    <a href={project.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="leading-none
                     text-xl
                     sm:text-2xl
                     md:text-[26px]
                     lg:text-[32px]">
                      {project.name}
                    </a>
                    <Icon icon="iconoir:arrow-up-right"
                    className="flex-shrink-0
                    size-4
                    sm:size-5
                    md:size-6"/>
                  </div>
                  
                  <div className="w-full h-0.5 bg-black/80"/>
                  
                  <div className="flex uppercase transition-all duration-500
                  px-4 gap-3 text-xs
                  sm:px-6 sm:gap-4 sm:text-xs
                  md:px-10 md:gap-x-5 md:text-sm md:group-hover:px-12
                  leading-loose flex-wrap">
                    {project.frameworks.map((framework) => (
                      <p key={framework.id}
                      className="text-black transition-colors
                      duration-500 md:group-hover:text-white
                      font-normal">{framework.name}
                      </p>                    
                    ))}
                  </div>
                  
                  <div className="flex uppercase transition-all duration-500
                  px-4 text-xs
                  sm:px-6 sm:text-xs
                  md:px-10 md:group-hover:px-12
                  leading-loose">
                    <p className="text-black transition-colors duration-500
                    md:group-hover:text-white text-1xl text-pretty">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="relative flex items-center justify-center
                  md:hidden
                  px-4 h-[300px]
                  sm:px-6 sm:h-[350px]
                  md:h-[400px]">
                    <img src={project.bgImage} 
                      alt={`${project.name}-bg-image`}
                      className="object-cover w-full h-full rounded-md brightness-50"
                      loading="lazy"
                    />
                    <img src={project.image} 
                      alt={`${project.name}-image`}
                      className="absolute bg-center rounded-xl
                      px-8
                      sm:px-12
                      md:px-14"
                      loading="lazy"
                    />
                  </div>
                </div>
            ))}
            
            {/* Desktop hover preview - now positioned better for visibility */}
            <div ref={previewRef}
              className="fixed top-0 left-0 z-50 overflow-hidden
              border-8 border-black pointer-events-none 
              hidden opacity-0
              md:block md:w-[600px]
              lg:w-[720px]
              xl:w-[800px]
              will-change-transform">
                {currentIndex !== null && (
                  <img src={projects[currentIndex].image} 
                    alt="preview"
                    className="object-cover w-full h-full"
                    loading="eager"
                  />
                )}
            </div>
        </div>
    </section>
  )
}

export default Work