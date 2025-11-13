import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
const ServiceSummary = () => {

    useGSAP(() => {
      gsap.to('#title-service-1', {
        xPercent:20,
        scrollTrigger:{
            target: "#title-service-1",
            scrub: true,
        }
      })
      
       gsap.to('#title-service-2', {
        xPercent:-30,
        scrollTrigger:{
            target: "#title-service-2",
            scrub: true,
        }
      })  
 
      gsap.to('#title-service-3', {
        xPercent:100,
        scrollTrigger:{
            target: "#title-service-3",
            scrub: true,
        }
      })  
      gsap.to('#title-service-4', {
        xPercent:-100,
        scrollTrigger:{
            target: "#title-service-4",
            scrub: true,
        }
      })  
      
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