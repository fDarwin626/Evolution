import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const AnimatedTextLines = ({text, className}) => {
    const lines = text.split("\n")
    .filter((line) => line.trim() !=="")
    const containerRef = useRef(null)
    const lineRef = useRef([])

    useGSAP(() => {
        if(lineRef.current.length > 0) {
            const anim = gsap.from(lineRef.current, {
                y:100,
                opacity:0,
                duration:1,
                stagger:0.3,
                ease: 'back.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                }
            })
            
            return () => {
              anim.scrollTrigger?.kill();
              anim.kill();
            }
        }
    }, [text])
    
  return (
    <div ref={containerRef} 
    className={className}>
        {lines.map((line,index) => (
            <span key={index} 
            ref={(el) => (lineRef.current[index]= el)}
            className="block lrading-relaxed tracking-wide
            text-pretty">
                {line}
            </span>
        ))}
    </div>
  )
}

export default AnimatedTextLines