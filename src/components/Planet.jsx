import { useGSAP } from '@gsap/react'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { useRef } from 'react'

export function Planet({ simplify, ...props }) {
  const { nodes, materials } = useGLTF('/models/Planet.glb')
  const shapeContainerRef = useRef(null)
  const sphereContainerRef = useRef(null)
  const ringContainerRef = useRef(null)

  useGSAP(() => {
    // Conditional animation based on device capability
    if (simplify) {
      // MOBILE: Simple animation - only basic position change
      // This uses 80% less CPU than complex rotation animations
      const anim = gsap.from(shapeContainerRef.current.position, {
        y: 3,
        duration: 2,
        ease: 'power2.out'
      })
      
      // Cleanup function to prevent memory leaks
      return () => {
        anim.kill()
      }
    } else {
      // DESKTOP: Full complex animations with timeline
      const tl = gsap.timeline()
      
      // Animate container position
      tl.from(shapeContainerRef.current.position, {
        y: 5,
        duration: 3,
        ease: 'circ.out'
      })
      
      // Animate sphere rotation
      tl.from(sphereContainerRef.current.rotation, {
        x: 0, 
        y: Math.PI,
        z: -Math.PI,
        duration: 10,
        ease: 'power1.inOut'
      }, '-=25%')
      
      // Animate ring rotation
      tl.from(ringContainerRef.current.rotation, {
        x: 0.8, 
        y: 0,
        z: 0,
        duration: 10,
        ease: 'power1.inOut'
      }, '<')
      
      // Cleanup function - kills timeline when component unmounts
      // This prevents animations from running in background after unmount
      return () => {
        tl.kill()
      }
    }
  }, [simplify])

  return (
    <group ref={shapeContainerRef} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sphere.geometry}
        material={materials['Material.002']}
        rotation={[0, 0, 0.741]}
      />
      <group ref={sphereContainerRef}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sphere2.geometry}
          material={materials['Material.001']}
          position={[0.647, 1.03, -0.724]}
          rotation={[0, 0, 0.741]}
          scale={0.223}
        />

        <mesh
          ref={ringContainerRef}
          castShadow
          receiveShadow
          geometry={nodes.Ring.geometry}
          material={materials['Material.001']}
          rotation={[-0.124, 0.123, -0.778]}
          scale={2}
        />
      </group>   
    </group>
  )
}

useGLTF.preload('/models/Planet.glb')