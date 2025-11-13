import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { socials } from "../constants"
import Marquee from "../components/Marquee"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap/all"

const Contact = () => {
    const text = `Got a queston? Need a developer? how or project idea?
    Feel free to reach out. I'm always open to discussing further,`

    const items = [
        `Now Just imagine , I code`,
        `Now Just imagine , I code`,
        `Now Just imagine , I code`,
        `Now Just imagine , I code`,
        `Now Just imagine , I code`,
        `Now Just imagine , I code`,
        `Now Just imagine , I code`,
    ]
    useGSAP(() => {
       gsap.from(".social-link", {
            y: 100,
            opacity: 0,
            delay: 0.5,
            duration: 1,
            ease:"back.out",
            stagger: 0.3,
            scrollTrigger:{
              trigger: ".social-link"  
            }
       }) 
    }, [])
  return (
    <section id="contact" className="flex flex-col justify-between
    min-h-screen bg-black">
        <div className="">
            <AnimatedHeaderSection
            subtitle={"You Dream It, I Code It"}
            title={"Contact"}
            text={text}
            textcolor={"text-white"}
            withScrollTrigger={true}
            />
            <div className="flex px-10 font-light text-white uppercase
            lg:text-[32px] text-[26px] leading-none mb-10">
                <div className="flex flex-col w-full gap-10">
                    <div className="social-link">
                        <h2>E-mail</h2>
                        <div className="w-full h-px my-2 bg-white/80"/>
                        <p className="text-xl tracking-wider lowercase
                       md:text-2xl lg:text-3xl">fuoseighadarwin@gmail.com</p>
                    </div>
                    <div className="social-link">
                        <h2>Phone</h2>
                     <div className="w-full h-px my-2 bg-white/80"/>
                     <p className="text-xl lowercase md:text-2xl lg:text-3xl">
                          +234 912 821 8436
                     </p>
                    </div>

                    <div className="social-link">
                        <h2>Social Plathforms</h2>
                     <div className="w-full h-px my-2 bg-white/80"/>
                        <div className="flex flex-wrap gap-2">
                        {socials.map((social, index)=> (
                            <a key={index} 
                            className="text-xs leading-loose tracking-widest 
                            uppercase md:text-sm hover:text-white/80 transition-colors
                            duration-200"
                            href={social.href}>{"{"}{social.name}{"}"}</a>
                        ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
       <Marquee
        items={items}
        className="text-white bg-transparent "
        icon="simple-icons:creativetechnology"
        IconclassName="w-24 h-23 text-gold"
       />
    </section>
  )
}

export default Contact