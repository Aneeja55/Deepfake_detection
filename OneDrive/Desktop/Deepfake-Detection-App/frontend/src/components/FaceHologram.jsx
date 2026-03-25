import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei'; // 👉 Added Center here!
import * as THREE from 'three';

const GLBModel = ({ isAnalyzing }) => {
  const meshRef = useRef();
  const { scene } = useGLTF('/face_model.glb'); 

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // I also added back the deep blue core for a more premium look!
        child.material = new THREE.MeshStandardMaterial({
          color: "#082A4C",       // Deep blue core 
          wireframe: true,        
          transparent: true,
          opacity: 0.8,
          emissive: "#00E5FF",    
          emissiveIntensity: 0.4  
        });
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const t = state.clock.getElapsedTime();
    const mouseX = state.mouse.x * 0.15;
    const mouseY = state.mouse.y * 0.1;

    meshRef.current.rotation.y = (t * 0.2) + mouseX;
    meshRef.current.rotation.x = -mouseY;

    if (isAnalyzing) {
       const pulse = 0.4 + Math.abs(Math.sin(t * 5)) * 0.8; 
       scene.traverse((child) => {
         if (child.isMesh && child.material) {
           child.material.emissiveIntensity = pulse;
         }
       });
    } else {
       scene.traverse((child) => {
         if (child.isMesh && child.material) {
           child.material.emissiveIntensity = 0.4;
         }
       });
    }
  });

  // 👉 THE FIX IS HERE: We wrap it in <Center> and shrink the scale massively
  return (
    <Center>
      <primitive object={scene} ref={meshRef} scale={0.6} position={[0, -0.5, 0]} />
    </Center>
  );
};

const FaceHologramScene = ({ isAnalyzing = false }) => {
  return (
    <div style={{ width: '100%', height: '220px', marginBottom: '16px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }}>
        <pointLight position={[5, 2, 5]} intensity={3} color="#00E5FF" />
        <pointLight position={[-6, -1, -5]} intensity={4} color="#E10098" />
        <ambientLight intensity={0.2} color="#0A0F1C" />

        <Suspense fallback={<div style={{color: 'var(--accent-cyan)'}}>Loading Core...</div>}>
          <GLBModel isAnalyzing={isAnalyzing} />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/face_model.glb');

export default FaceHologramScene;