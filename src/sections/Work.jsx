import { Icon } from "@iconify/react"
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { projects } from "../constants"
import { useMediaQuery } from "react-responsive"
import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Work = () => {
    const overlayRefs = useRef([]);
    const mouse = useRef({x:0, y:0});
    const text = `Featured projects that have been crafted with precision and creativity, showcasing a blend of innovative design and robust functionality. Each project reflects a commitment to excellence and a passion for delivering impactful solutions. Explore these highlights to see how we bring ideas to life through meticulous planning, cutting-edge technology, and a user centric approach.`
    const isMobile = useMediaQuery({maxWidth:853})
    const [currentIndex, setCurrentIndex] = useState(null);

    const handleMouseEnter = (index)  => {
      if(window.innerWidth < 768) return;
      setCurrentIndex(index);
      const el = overlayRefs.current[index];
      if(!el) return;
      gsap.killTweensOf(el);
      gsap.fromTo(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)"
      },
      {clipPath: "polygon(0 100%, 100% 100%, 99% 0, 0 0)",
        duration:0.15,
        ease: "power2.out",
      }
    )

       gsap.to(previewRef.current, {
        opacity:1,
        scale:1,
        duration:0.3,
        ease: "power2.out",
      })
    }

    const moveX = useRef(null);
    const moveY = useRef(null);

     useGSAP(() => {
     if (window.innerWidth >= 768) {
       moveX.current = gsap.quickTo(previewRef.current, "x",{
         duration:1.5,
         ease: "power3.out", 
       })

       moveY.current = gsap.quickTo(previewRef.current, "y",{
         duration:2,
         ease: "power3.out", 
       })
     }
     
     const anim = gsap.from("#Projects", {
        y:100,
        opacity:0,
        delay: 0.5,
        duration:1,
        stagger:0.3,
        ease: "back.out",
        scrollTrigger: {
          trigger: "#Projects",
        }
      })
      
      return () => {
        anim.scrollTrigger?.kill()
        anim.kill()
        if (previewRef.current) {
          gsap.killTweensOf(previewRef.current)
        }
      }
    })


    const handleMouseLeave = (index)  => {
      if(window.innerWidth < 768) return;
      setCurrentIndex(null);
      const el = overlayRefs.current[index];
      if(!el) return;
      gsap.killTweensOf(el);
      gsap.to( el,{
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration:0.2,
        ease: "power2.out",
     })
      gsap.to(previewRef.current, {
        opacity:0,
        scale:0.95,
        duration:0.3,
        ease: "power2.out",
      })
    }
   
    const previewRef = useRef(null);
    
    const handleMouseMove = (e) => {
       if(window.innerWidth < 768) return;
       mouse.current.x =  e.clientX + 24;
       mouse.current.y =  e.clientY + 24;
       moveX.current(mouse.current.x);
       moveY.current(mouse.current.y);
    }
    
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
         text={isMobile ? "Featured projects that have been crafted with precision and creativity"
          : text}
         textcolor={"text-black"}
         withScrollTrigger={true}
        />
        <div className="relative flex flex-col font-light"
        onMouseMove={handleMouseMove}>
            {projects.map((project, index) => (
                <div  key={project.id}
                 
                 className="relative flex flex-col gap-1 py-5
                 cursor-pointer group md:gap-0"
                 onMouseEnter={() => handleMouseEnter(index)}
                 onMouseLeave={() => handleMouseLeave(index)}>
                  <div ref={(el)=> {
                    overlayRefs.current[index] = el
                  } }
                  className="absolute inset-0 hidden md:block 
                  duration-200 bg-black -z-10 clip-path"/>
                  <div className="flex justify-between px-10 text-black
                  transition-all duration-500 md:group-hover:px-12
                  md:group-hover:text-white">
                    <a href={project.href}
                     className="lg:text-[32px] text-[26px] leading-none">
                      {project.name}
                    </a>
                    <Icon icon="iconoir:arrow-up-right"
                    className="md:size-6 size-5"/>
                  </div>
                  <div className="w-full h-0.5 bg-black/80"/>
                  <div className="flex px-10 text-xs leading-loose gap-4
                  uppercase tramsition-all duration-500 md:text-sm gap-x-5
                  md:group-hover:px-12">
                    {project.frameworks.map((framework) => (
                      <p key={framework.id}
                      className="text-black transition-colors
                      duration-500 md:group-hover:text-white
                      font-normal">{framework.name}
                      </p>                    
                    ))}
                  </div>
                    <div className="flex px-10 text-xs leading-loose uppercase
                     tramsition-all duration-500 md:group-hover:px-12">
                      <p className="text-black transition-colors duration-500
                       md:group-hover:text-white text-1xl text-pretty">
                        {project.description}
                      </p>
                    </div>
                    <div className="relative flex items-center justify-center
                    px-10 md:hidden h-[400px]">
                      <img src={project.bgImage} alt={`${project.name}-bg-image`
                    } className="object-cover w-full h-full rounded-md brightness-50"
                    loading="lazy"/>
                    <img src={project.image} alt={`${project.name}-image`}
                    className="absolute bg-center px-14 rounded-xl"
                    loading="lazy" />
                    </div>
                </div>
            ))}
              <div ref={previewRef}
              className="fixed -top-1/6 left-0 z-50 overflow-hidden
              border-8 border-black pointer-events-none w-[960px] md:block
              hidden opacity-0">
                {currentIndex !== null && (
                  <img src={projects[currentIndex].image} alt="preview"
                className="object-cover w-full h-full"/>
                
                )}
              </div>
        </div>
    </section>
  )
}

export default Work