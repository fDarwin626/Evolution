import { Planet } from "../components/Planet"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, Lightformer } from "@react-three/drei"
import { useMediaQuery } from "react-responsive"
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { Suspense } from "react"

const Hero = () => {
      const text = `I help brands and startups gain an unfair advantage
       Through premium results driven websites and mobile apps`
  
   const isMobile = useMediaQuery({maxWidth:853})

  return (
    <section id="Home" className="flex flex-col justify-end min-h-screen">
  <AnimatedHeaderSection
    subtitle='404 No Bugs Found!'
    title='Darwin'
    text ={text}
    textcolor='text-black'
  />
<figure className="absolute inset-0 -z-50 pointer-events-none" 
  style={{width: '100vw', height: '100vh'}}>
  <Canvas shadows = {!isMobile}
  dpr={isMobile ? [1,1] : [1.2]}
  gl={{antialias: !isMobile,
       powerPreference: isMobile ? "low-power" : "high-performance"
  }}

    camera={{
      position: isMobile ? [0, 0, -10] : [0, 0, -10],  // Same for both
      fov: 17.5, 
      near: 1, 
      far: 20
    }}>
    
{/* CHANGE: Conditional lighting based on device */}
  {isMobile ? (
    // Simple mobile lighting - only 2 lights instead of 5
    <>
      <ambientLight intensity={2.5} color='#f4d9b3'/>
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5}
        color="#ffe4c4"
      />
    </>
  ) : (
    // Full desktop lighting
    <>
      <ambientLight intensity={1.7} color='#f4d9b3'/>
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={2}
        color="#ffe4c4"
        castShadow
      />
      <pointLight
        position={[0, -3, 3]}
        intensity={1.2} 
        color="#ffd89b"
      />
      <pointLight
        position={[-5, -2, 2]}
        intensity={0.8} 
        color="#ffcf8e" 
      />
    </>
  )}
  

    <Float speed={0.7}>
      <Planet 
        scale={isMobile ? 0.50 : 0.9}
        position={isMobile ? [0, 0.1, 0] : [0, -0.1, 0]} 
      />
    </Float>
    
    <Environment resolution={256}>
      <group rotation={[Math.PI/3, 4, 1]}>
        <Lightformer 
          form={'circle'} 
          intensity={2}
          color="#ffe8cc"
          position={[0, 5, -8]} 
          scale={15}
        />
        <Lightformer 
          form={'circle'} 
          intensity={1.5}
          color="#ffd89b"
          position={[8, 3, -5]} 
          scale={12}
        />
        <Lightformer 
          form={'rect'} 
          intensity={1.8}
          color="#f4d9b3"
          position={[0, -4, -3]} 
          scale={20}
        />
        <Lightformer 
          form={'rect'} 
          intensity={1.2}
          color="#ffe4c4"
          position={[-8, 0, 3]} 
          scale={18}
        />
      </group>
    </Environment>
  </Canvas>              
</figure>

    </section>
  )
}

export default Hero