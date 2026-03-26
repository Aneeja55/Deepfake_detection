import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

const CyberHead = ({ isAnalyzing }) => {
  const groupRef = useRef();

  // Load the realistic human scan
  const { scene } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb');

  // Extract and center the geometry
  const faceGeometry = useMemo(() => {
    let geo;
    scene.traverse((child) => {
      if (child.isMesh && !geo) {
        geo = child.geometry.clone();
        geo.center(); 
      }
    });
    return geo;
  }, [scene]);

  // 👉 THE MAGIC: A Custom WebGL Shader to create the scanline hologram effect
  const hologramMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending, // Makes overlapping areas glow brighter
    depthWrite: false, // Ensures you can see through it
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color("#082A4C") },
      glowColor: { value: new THREE.Color("#00E5FF") }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // 1. Fresnel Effect (Rim Lighting): Makes the edges glow brightest to define the face
        float rim = pow(1.0 - abs(dot(vNormal, vec3(0, 0, 1))), 1.5);

        // 2. Holographic Scanlines: Moving horizontal lines
        float scanlines = sin(vPosition.y * 120.0 - time * 8.0) * 0.5 + 0.5;
        
        // 3. Combine effects
        float intensity = rim * (0.5 + scanlines * 0.5);

        // Mix the deep base color with the bright glowing edge color
        vec3 finalColor = mix(baseColor, glowColor, intensity);

        gl_FragColor = vec4(finalColor, intensity * 0.8);
      }
    `
  }), []);

  // --- ANIMATION LOOP ---
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const t = state.clock.getElapsedTime();
    const mouseX = state.mouse.x * 0.4;
    const mouseY = state.mouse.y * 0.4;

    // Smooth rotation tracking the mouse
    groupRef.current.rotation.y += (mouseX - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (-mouseY - groupRef.current.rotation.x) * 0.1;
    
    // Breathing hover motion
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;

    // Feed time to the shader for moving scanlines
    hologramMaterial.uniforms.time.value = t;

    // Change colors based on analysis state
    if (isAnalyzing) {
      hologramMaterial.uniforms.baseColor.value.set("#4A0033"); // Deep Magenta base
      hologramMaterial.uniforms.glowColor.value.set("#FF0055"); // Bright Red/Pink glow
    } else {
      hologramMaterial.uniforms.baseColor.value.set("#002244"); // Deep Blue base
      hologramMaterial.uniforms.glowColor.value.set("#00E5FF"); // Bright Cyan glow
    }
  });

  if (!faceGeometry) return null;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={0.45} position={[0, -0.2, 0]}>
        
        {/* The Continuous Glowing Shader Mesh */}
        <mesh geometry={faceGeometry} material={hologramMaterial} />

        {/* Subtle dot overlay for texture */}
        <points geometry={faceGeometry}>
          <pointsMaterial 
            color={isAnalyzing ? "#FF0055" : "#00E5FF"}
            size={0.008} 
            transparent={true} 
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

      </group>
    </Float>
  );
};

// --- SCENE WRAPPER ---
const FaceHologramScene = ({ isAnalyzing = false }) => {
  return (
    <div style={{ width: '100%', height: '220px', marginBottom: '16px', position: 'relative' }}>
      {/* Explicitly setting alpha: true to guarantee no ugly background box */}
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={
          <Html center>
            <div style={{color: "var(--accent-cyan)", fontFamily: "monospace", textAlign: "center", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px"}}>
              Initializing<br/>Biometrics
            </div>
          </Html>
        }>
          <Center>
            <CyberHead isAnalyzing={isAnalyzing} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb');

export default FaceHologramScene;