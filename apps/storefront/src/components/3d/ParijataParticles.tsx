'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParijataParticles() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions and phases for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      // Spread them from Z=10 to Z=-20
      const z = 10 - Math.random() * 30; 
      const phase = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, phase });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    particles.forEach((particle, i) => {
      // Gentle falling and swirling motion
      const x = particle.x + Math.sin(time * 0.5 + particle.phase) * 0.5;
      const y = particle.y - (time * 0.5) % 20; // Wrap around
      const z = particle.z;
      
      dummy.position.set(x, y, z);
      dummy.rotation.x = time * 0.2 + particle.phase;
      dummy.rotation.y = time * 0.3 + particle.phase;
      
      const scale = 0.1 + Math.sin(time * 2 + particle.phase) * 0.05;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Simple geometry, representing a flower petal/sparkle */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffc1cc" side={THREE.DoubleSide} transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
}
