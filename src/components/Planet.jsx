import { useGSAP } from '@gsap/react'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { useRef } from 'react'

export function Planet(props) {
  const { nodes, materials } = useGLTF('/models/Planet.glb')
  const shapeContainerRef = useRef(null)
  const sphereContainerRef = useRef(null)
  const ringContainerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(shapeContainerRef.current.position, {
        y: 5,
        duration:3,
        ease: 'circ.out'
    })
    tl.from(sphereContainerRef.current.rotation, {
       x:0, 
       y: Math.PI,
       z: -Math.PI,
       duration:10,
       ease: 'power1.inOut'
    }, '-=25%')
    tl.from(ringContainerRef.current.rotation, {
      x:0.8, 
      y: 0,
      z:0,
      duration:10,
        ease: 'power1.inOut'
    },'<')
  }, [])
  return (
    <group  ref={shapeContainerRef} {...props} dispose={null}>
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

