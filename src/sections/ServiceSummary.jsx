import { useMemo } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const ServiceSummary = () => {
    
    // Detect mobile for optimized animations
    const isMobile = useMemo(() => 
      typeof window !== 'undefined' && window.innerWidth < 768,
      []
    )

    useGSAP(() => {
      const anim1 = gsap.to('#title-service-1', {
        xPercent: isMobile ? 10 : 20,
        scrollTrigger: {
            trigger: "#title-service-1",
            scrub: isMobile ? 0.5 : true,
            fastScrollEnd: true,
        },
        force3D: true,
      })
      
      const anim2 = gsap.to('#title-service-2', {
        xPercent: isMobile ? -15 : -30,
        scrollTrigger: {
            trigger: "#title-service-2",
            scrub: isMobile ? 0.5 : true,
            fastScrollEnd: true,
        },
        force3D: true,
      })  
 
      const anim3 = gsap.to('#title-service-3', {
        xPercent: isMobile ? 30 : 100,
        scrollTrigger: {
            trigger: "#title-service-3",
            scrub: isMobile ? 0.5 : true,
            fastScrollEnd: true,
        },
        force3D: true,
      })
      
      const anim4 = gsap.to('#title-service-4', {
        xPercent: isMobile ? -30 : -100,
        scrollTrigger: {
            trigger: "#title-service-4",
            scrub: isMobile ? 0.5 : true,
            fastScrollEnd: true,
        },
        force3D: true,
      })
      
      return () => {
        [anim1, anim2, anim3, anim4].forEach(anim => {
          if (anim.scrollTrigger) anim.scrollTrigger.kill()
          anim.kill()
        })
      }
    }, [isMobile])
    
  return (
    <section className="relative min-h-screen overflow-hidden font-light leading-snug
    text-center contact-text-responsive
    mt-12
    sm:mt-16
    md:mt-20
    px-4 sm:px-6">
        <div id="title-service-1" className="will-change-transform">
            <p>Architecture</p>
        </div>
        
        <div id="title-service-2" className="flex items-center justify-center
        gap-2 will-change-transform
        sm:gap-3
        translate-x-8
        sm:translate-x-12
        md:translate-x-16">
            <p className="font-normal">Development</p>
            <div className="h-1 bg-gold
            w-6
            sm:w-8
            md:w-10
            lg:w-32"/>
            <p>Deployment</p>
        </div>
        
        <div id="title-service-3" className="flex items-center justify-center
        flex-wrap will-change-transform
        gap-2
        sm:gap-3
        translate-x-[-30px]
        sm:translate-x-[-40px]
        md:translate-x-[-50px]">
            <p>APIs</p>
            <div className="h-1 bg-gold
            w-6
            sm:w-8
            md:w-10
            lg:w-32"/>
            <p className="italic">FullStack</p>
            <div className="h-1 bg-gold
            w-6
            sm:w-8
            md:w-10
            lg:w-32"/>
            <p>Scalability</p>
        </div>
        
        <div id="title-service-4" className="will-change-transform
        translate-x-24
        sm:translate-x-36
        md:translate-x-48">
            <p>Databases</p>
        </div>
    </section>
  )
}

export default ServiceSummary