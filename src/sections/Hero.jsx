import { Planet } from "../components/Planet"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, Lightformer } from "@react-three/drei"
import { useMediaQuery } from "react-responsive"
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"
import { Suspense, useMemo } from "react"

const Hero = () => {
  const text = `I help brands and startups gain an unfair advantage
    Through premium results driven websites and mobile apps`
  
  const isMobile = useMediaQuery({ maxWidth: 853 })
  const isTablet = useMediaQuery({ minWidth: 854, maxWidth: 1024 })
  
  // Memoize camera settings
  const cameraSettings = useMemo(() => ({
    position: [0, 0, -10],
    fov: 17.5, 
    near: 1, 
    far: 20
  }), []);
  
  // Memoize canvas settings for performance
  const canvasSettings = useMemo(() => ({
    shadows: !isMobile,
    dpr: isMobile ? [1, 1] : isTablet ? [1, 1.5] : [1, 2],
    gl: {
      antialias: !isMobile,
      powerPreference: isMobile ? "low-power" : "high-performance",
    }
  }), [isMobile, isTablet]);
  
  // Memoize planet settings
  const planetSettings = useMemo(() => ({
    scale: isMobile ? 0.45 : isTablet ? 0.7 : 0.9,
    position: isMobile ? [0, 0.15, 0] : isTablet ? [0, 0, 0] : [0, -0.1, 0]
  }), [isMobile, isTablet]);

  return (
    <section id="Home" className="flex flex-col justify-end min-h-screen">
      <AnimatedHeaderSection
        subtitle='404 No Bugs Found!'
        title='Darwin'
        text={text}
        textcolor='text-black'
      />
      
      <figure 
        className="absolute inset-0 -z-50 pointer-events-none" 
        style={{ width: '100vw', height: '100vh' }}
      >
        <Canvas 
          shadows={canvasSettings.shadows}
          dpr={canvasSettings.dpr}
          gl={canvasSettings.gl}
          camera={cameraSettings}
        >
          
          {/* Optimized conditional lighting */}
          {isMobile ? (
            // Ultra-lightweight mobile lighting - 2 lights only
            <>
              <ambientLight intensity={2.8} color='#f4d9b3'/>
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1.8}
                color="#ffe4c4"
              />
            </>
          ) : isTablet ? (
            // Medium tablet lighting - 3 lights
            <>
              <ambientLight intensity={2.2} color='#f4d9b3'/>
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={2}
                color="#ffe4c4"
              />
              <pointLight
                position={[0, -3, 3]}
                intensity={1}
                color="#ffd89b"
              />
            </>
          ) : (
            // Full desktop lighting - 4 lights
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

          <Float 
            speed={isMobile ? 0.5 : 0.7}
            rotationIntensity={isMobile ? 0.3 : 0.5}
            floatIntensity={isMobile ? 0.3 : 0.5}
          >
            <Planet 
              scale={planetSettings.scale}
              position={planetSettings.position} 
            />
          </Float>
          
          {/* Simplified environment for mobile */}
          {isMobile ? (
            <Environment resolution={128} preset="sunset" />
          ) : (
            <Environment resolution={isTablet ? 256 : 512}>
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
          )}
        </Canvas>
      </figure>
    </section>
  )
}

export default Hero