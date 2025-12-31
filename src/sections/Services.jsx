import { useRef, useMemo } from "react"
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { servicesData } from "../constants"
import { useMediaQuery } from "react-responsive"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const Services = () => {
  const text = `I build secure, heigh-performance full-stack mobile 
  and web applications with smooth Ux to drive growth and productivity
   tailored to your business needs.`
   
   const serviceRefs = useRef([])
   const isDesktop = useMediaQuery({ minWidth: "48rem" })
   const isMobile = useMemo(() => 
     typeof window !== 'undefined' && window.innerWidth < 768,
     []
   )

   useGSAP(() => {
     const animations = []
     
     serviceRefs.current.forEach((el) => {
      if (!el) return;
      const anim = gsap.from(el, {
        y: isMobile ? 100 : 200,
        opacity: 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        duration: isMobile ? 0.7 : 1,
        ease: isMobile ? 'power2.out' : 'circ.out',
        clearProps: 'all',
        force3D: true,
      })
      animations.push(anim)
     })
     
     return () => {
       animations.forEach(anim => {
         if (anim.scrollTrigger) anim.scrollTrigger.kill()
         anim.kill()
       })
     }
   }, [isMobile])

  return (
    <section id="Services" className="min-h-screen bg-black rounded-t-4xl">
        <AnimatedHeaderSection
          subtitle='Behind the Scene, Beyond the Code'
          title='Services'
          text={text}
          textcolor='text-white'
          withScrollTrigger={true}
        />
        
  {servicesData.map((service, index) => (
    <div 
      ref={(el) => (serviceRefs.current[index] = el)}  
      key={`service-${index}`} 
      className="sticky text-white bg-black border-t-2 border-white/30
      px-4 pb-8
      sm:px-6 sm:pb-10
      md:px-10 md:pb-12"
      style={
        isDesktop ? {
          top: `calc(10vh + ${index * 5}rem)`, 
          marginBottom: `${(servicesData.length - index - 1) * 5}rem`
        } : { top: 0 }
      }    
    >
      <div className="flex items-center justify-between gap-4 font-light">
         <div className="flex flex-col
         gap-4
         sm:gap-5
         md:gap-6">
         
         <h2 className="
         text-2xl
         sm:text-3xl
         md:text-4xl
         lg:text-5xl">
           {service.title}
         </h2>
         
         <p className="leading-relaxed tracking-widest text-white/60 text-pretty
         text-base
         sm:text-lg
         md:text-xl
         lg:text-2xl">
           {service.description}
         </p>
         
         <div className="flex flex-col text-white/80
         gap-2 text-lg
         sm:gap-3 sm:text-xl
         md:gap-4 md:text-2xl
         lg:text-3xl">
          {service.items.map((item, itemIndex) => (
              <div key={`item-${index}-${itemIndex}`} className="">
                <h3 className="flex items-start">
                  <span className="mr-6 text-white/30 flex-shrink-0
                  text-sm
                  sm:text-base sm:mr-8
                  md:text-lg md:mr-12">
                    0{itemIndex + 1}
                  </span>
                  <span className="flex-1">{item.title}</span>
                </h3>
                {itemIndex < service.items.length - 1 && (
                <div className="w-full h-px my-2 bg-white/30"/>
                )}
              </div>
          ))}
         </div>
         </div>
      </div>
    </div>
  ))}
    </section>
  )
}

export default Services