'use client';

import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export function ScrollCamera() {
  const scroll = useScroll();

  useFrame((state) => {
    // scroll.offset goes from 0 to 1
    // We want the camera to move from Z = 5 down to Z = -35
    const startZ = 5;
    const endZ = -35;
    const targetZ = THREE.MathUtils.lerp(startZ, endZ, scroll.offset);
    
    // Smooth camera movement using lerp
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    // Add a slight swaying motion to the camera as it moves through space
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
    
    // Look straight ahead
    state.camera.lookAt(0, 0, state.camera.position.z - 10);
  });

  return null;
}
