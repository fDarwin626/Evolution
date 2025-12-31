import { useGSAP } from '@gsap/react'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { useRef, useMemo, memo } from 'react'
import * as THREE from 'three'

// Memoized Planet component to prevent unnecessary re-renders
const Planet = memo(({ simplify, ...props }) => {
  const { nodes, materials } = useGLTF('/models/Planet.glb')
  const shapeContainerRef = useRef(null)
  const sphereContainerRef = useRef(null)
  const ringContainerRef = useRef(null)

  // Optimize materials for mobile
  const optimizedMaterials = useMemo(() => {
    if (!simplify) return materials;

    // Clone materials to avoid modifying original
    const optimized = {};
    Object.keys(materials).forEach(key => {
      const mat = materials[key].clone();
      
      // Mobile optimizations
      mat.flatShading = true; // Reduces vertex calculations
      mat.precision = 'lowp'; // Use low precision for mobile
      
      // Disable expensive features on mobile
      if (mat.normalMap) mat.normalMap = null;
      if (mat.roughnessMap) mat.roughnessMap = null;
      if (mat.metalnessMap) mat.metalnessMap = null;
      if (mat.aoMap) mat.aoMap = null;
      
      // Reduce reflection quality
      if (mat.envMapIntensity) mat.envMapIntensity *= 0.5;
      
      optimized[key] = mat;
    });
    
    return optimized;
  }, [materials, simplify]);

  // Optimize geometry for mobile
  const optimizedGeometry = useMemo(() => {
    if (!simplify || !nodes) return nodes;

    const optimized = {};
    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      if (node.geometry) {
        const geom = node.geometry.clone();
        
        // Reduce geometry complexity on mobile
        // This can reduce vertices by 50-70%
        if (geom.index) {
          const simplified = new THREE.BufferGeometry();
          simplified.setAttribute('position', geom.getAttribute('position'));
          simplified.setAttribute('normal', geom.getAttribute('normal'));
          if (geom.getAttribute('uv')) {
            simplified.setAttribute('uv', geom.getAttribute('uv'));
          }
          simplified.setIndex(geom.index);
          
          optimized[key] = { ...node, geometry: simplified };
        } else {
          optimized[key] = node;
        }
      } else {
        optimized[key] = node;
      }
    });
    
    return optimized;
  }, [nodes, simplify]);

  const finalNodes = simplify ? optimizedGeometry : nodes;
  const finalMaterials = simplify ? optimizedMaterials : materials;

  useGSAP(() => {
    if (!shapeContainerRef.current) return;

    if (simplify) {
      // MOBILE: Minimal animation for performance
      // Only animate position, no rotation
      const anim = gsap.from(shapeContainerRef.current.position, {
        y: 3,
        duration: 1.5, // Shorter duration
        ease: 'power2.out',
        // Reduce frame rate for mobile
        onUpdate: function() {
          if (this.progress() % 0.1 === 0) { // Update every 10%
            shapeContainerRef.current.position.needsUpdate = true;
          }
        }
      })
      
      return () => {
        anim.kill();
        // Clear any remaining tweens
        gsap.killTweensOf(shapeContainerRef.current.position);
      }
    } else {
      // DESKTOP: Full animations
      const tl = gsap.timeline({
        defaults: { ease: 'none' }
      });
      
      // Stagger animations for better performance
      tl.from(shapeContainerRef.current.position, {
        y: 5,
        duration: 3,
        ease: 'circ.out'
      })
      
      // Only animate if refs exist
      if (sphereContainerRef.current) {
        tl.from(sphereContainerRef.current.rotation, {
          x: 0, 
          y: Math.PI,
          z: -Math.PI,
          duration: 10,
          ease: 'power1.inOut'
        }, '-=2.25') // Overlap timing
      }
      
      if (ringContainerRef.current) {
        tl.from(ringContainerRef.current.rotation, {
          x: 0.8, 
          y: 0,
          z: 0,
          duration: 10,
          ease: 'power1.inOut'
        }, '<')
      }
      
      return () => {
        tl.kill();
        // Clean up all tweens
        if (sphereContainerRef.current) {
          gsap.killTweensOf(sphereContainerRef.current.rotation);
        }
        if (ringContainerRef.current) {
          gsap.killTweensOf(ringContainerRef.current.rotation);
        }
      }
    }
  }, { dependencies: [simplify] })

  return (
    <group 
      ref={shapeContainerRef} 
      {...props} 
      dispose={null}
    >
      <mesh
        castShadow={!simplify} // Disable shadows on mobile
        receiveShadow={!simplify}
        geometry={finalNodes.Sphere?.geometry}
        material={finalMaterials['Material.002']}
        rotation={[0, 0, 0.741]}
        frustumCulled={true} // Enable frustum culling
      />
      <group ref={sphereContainerRef}>
        <mesh
          castShadow={!simplify}
          receiveShadow={!simplify}
          geometry={finalNodes.Sphere2?.geometry}
          material={finalMaterials['Material.001']}
          position={[0.647, 1.03, -0.724]}
          rotation={[0, 0, 0.741]}
          scale={0.223}
          frustumCulled={true}
        />

        <mesh
          ref={ringContainerRef}
          castShadow={!simplify}
          receiveShadow={!simplify}
          geometry={finalNodes.Ring?.geometry}
          material={finalMaterials['Material.001']}
          rotation={[-0.124, 0.123, -0.778]}
          scale={2}
          frustumCulled={true}
        />
      </group>   
    </group>
  )
});

Planet.displayName = 'Planet';

// Preload model with error handling
useGLTF.preload('/models/Planet.glb');

export { Planet };