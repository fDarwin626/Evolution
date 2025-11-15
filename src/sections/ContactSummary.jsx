import { useRef } from 'react';
import Marquee from '../components/Marquee';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ContactSummary = () => {
    const containerRef = useRef(null);
    const items = [
        "Innovative Solutions",
         "User-Centric Design", 
         "Cutting-Edge Tech", 
         "Seamless Functionality"
        ];
    const items2 = ["Contact me",
     "Let's Collaborate",
     "Contact me", 
     "Build Together",
     "Contact me", 
     "Get in Touch",
     "Contact me",
     "Contact me",
    ];
    
    useGSAP(() => {
      const scrollTriggerInstance = gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=800",
          scrub: 0.5,
          pin: true,
          pinSpacing:true,
        }
      })
      
      return () => {
        if (scrollTriggerInstance.scrollTrigger) {
          scrollTriggerInstance.scrollTrigger.kill();
        }
        scrollTriggerInstance.kill();
      }
    })
    
  return (
  <section ref={containerRef} className="flex flex-col items-center
  justify-between min-h-screen gap-12 mt-16 text-center">
    <Marquee
    items={items}
    />
     <div className="overflow-hidden font-light text-center
     contact-text-responsive">
        <p> " Let's build a <br/>
          <span className='font-normal'>memorable</span>  &  <span className='italic'>inspiring</span><br/>
          web and Mobile applications    <span className='text-gold'>together</span>"
        </p>
     </div>
    <Marquee
    items={items2}
    reverse={true}
    className='text-black bg-transparent border-y-2'
    IconclassName='stroke-gold stroke-2 text-primary'
    icon='material-symbols-light:square'
    />
  </section>
)
}

export default ContactSummary