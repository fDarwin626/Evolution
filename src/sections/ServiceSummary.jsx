import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const ServiceSummary = () => {

    useGSAP(() => {
      const anim1 = gsap.to('#title-service-1', {
        xPercent:20,
        scrollTrigger:{
            trigger: "#title-service-1",
            scrub: true,
        }
      })
      
      const anim2 = gsap.to('#title-service-2', {
        xPercent:-30,
        scrollTrigger:{
            trigger: "#title-service-2",
            scrub: true,
        }
      })  
 
      const anim3 = gsap.to('#title-service-3', {
        xPercent:100,
        scrollTrigger:{
            trigger: "#title-service-3",
            scrub: true,
        }
      })
      
      const anim4 = gsap.to('#title-service-4', {
        xPercent:-100,
        scrollTrigger:{
            trigger: "#title-service-4",
            scrub: true,
        }
      })
      
      return () => {
        [anim1, anim2, anim3, anim4].forEach(anim => {
          anim.scrollTrigger?.kill()
          anim.kill()
        })
      }
    })
    
  return (
    <section  className="relative min-h-screen mt-20 overflow-hidden font-light leading-snug
    text-center  contact-text-responsive">
        <div id="title-service-1" className="">
            <p>Architecture</p>
        </div>
        <div id="title-service-2" className="flex items-center justify-center
        gap-3 translate-x-16 ">
            <p className="font-normal">Development</p>
            <div className="w-10 h-1 md:w-32 bg-gold"/>
            <p>Deployment</p>
        </div>
        <div id="title-service-3" className="flex items-center justify-center
        gap-3 translate-x-[-50px]">
            <p>APIs</p>
             <div className="w-10 h-1 md:w-32 bg-gold"/>
             <p className="italic">FullStack</p>
            <div className="w-10 h-1 md:w-32 bg-gold"/>
             <p>Scalability</p>
            </div>
            <div id="title-service-4" className="translate-x-48">
                <p>Databases</p>
            </div>
    </section>
  )
}

export default ServiceSummary