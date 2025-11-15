import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import AnimatedTextLines from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const text = `I'm a passionate FullStack web/mobile app Developer  with 
    expertise in crafting dynamic and responsive  applications.`

const aboutText = `Passionate about leveraging technology to solve real-world problems, I build scalable, high-performance web and mobile applications that deliver exceptional user experiences. My expertise spans both frontend and backend development, allowing me to create stunning UIs coupled with bulletproof backend systems. Let's collaborate to bring your ideas to life!


When I'm not coding?

- You can find me exploring the latest tech trends
- Crafting furniture (yes, I love woodworking) as a matter of fact, I'm also a carpenter
- Indulging in my love for travel`;
    
    const imgRef = useRef(null);
    
    useGSAP(() => {
       const scaleAnimation = gsap.to("#About", {
        scale: 0.95,
        scrollTrigger: {
            trigger: "#About",
            start: "bottom 80%",
            end: "bottom 20%",
            scrub: true,
        },
        ease: "power1.inOut",
       })
       
       gsap.set(imgRef.current, {
        clipPath: " polygon(0 100%, 75% 100%, 100% 100%, 0% 100%)",
       })
       
        const imgAnimation = gsap.to(imgRef.current, {
          clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
          duration: 2.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: imgRef.current,
          }
        })
        
        return () => {
          scaleAnimation.scrollTrigger?.kill()
          scaleAnimation.kill()
          imgAnimation.scrollTrigger?.kill()
          imgAnimation.kill()
        }
    })
    
  return (
    <section id='About' className="min-h-screen bg-black rounded-b-4xl">
        <AnimatedHeaderSection
        subtitle={"Code with purpose, Built to scale"}
        title={'About'}
        text={text}
        textcolor={"text-white"}
        withScrollTrigger={true}
        />
        <div className="flex flex-col items-center justify-between
        gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row
        md:text-2xl lg:text-3xl text-white/60">
            <img
            ref={imgRef}
             src="images/my_img.jpg"
                alt="man image"
                className="w-md rounded-3xl"
                loading="lazy"
                decoding="async"
            />
            <AnimatedTextLines 
            text={aboutText}
            className={"w-full"}/>
        </div>
    </section>
  )
}

export default About