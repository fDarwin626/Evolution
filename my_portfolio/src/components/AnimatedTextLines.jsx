import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, useMemo, memo } from "react"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const AnimatedTextLines = memo(({ text, className }) => {
  const containerRef = useRef(null)
  const lineRef = useRef([])

  // Memoize line splitting to avoid recalculation on every render
  const lines = useMemo(() => 
    text.split("\n").filter((line) => line.trim() !== ""),
    [text]
  )

  useGSAP(() => {
    // Early return if no lines or refs
    if (!lineRef.current.length || !containerRef.current) return;

    const anim = gsap.from(lineRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: 'back.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        // Mobile performance optimizations
        fastScrollEnd: true,
        preventOverlaps: true
      },
      clearProps: "all" // Clean up inline styles after animation
    })
    
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    }
  }, { scope: containerRef, dependencies: [lines] })
  
  return (
    <div 
      ref={containerRef} 
      className={`${className} will-change-auto`}
    >
      {lines.map((line, index) => (
        <span 
          key={`${line.substring(0, 20)}-${index}`}
          ref={(el) => {
            if (el) lineRef.current[index] = el
          }}
          className="block leading-relaxed tracking-wide text-pretty"
          style={{ transform: 'translateZ(0)' }}
        >
          {line}
        </span>
      ))}
    </div>
  )
})

AnimatedTextLines.displayName = 'AnimatedTextLines'

export default AnimatedTextLines