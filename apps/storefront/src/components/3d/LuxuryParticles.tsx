'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function LuxuryParticles() {
  const count = 500;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Precompute random positions and speeds for the particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10;
      const speed = 0.1 + Math.random() * 0.2;
      const size = 0.02 + Math.random() * 0.05;
      temp.push({ x, y, z, speed, size });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      // Gentle floating animation
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.x + Math.sin(t) * 0.5,
        particle.y + Math.cos(t) * 0.5,
        particle.z + Math.sin(t * 0.5) * 0.5
      );
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      {/* Rose-gold / Divine Pinkish tint */}
      <meshBasicMaterial color="#ff9e99" transparent opacity={0.5} />
    </instancedMesh>
  );
}
