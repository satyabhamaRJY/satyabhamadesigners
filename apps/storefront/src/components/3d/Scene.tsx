'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { DivineImage } from './DivineImage';
import { LuxuryParticles } from './LuxuryParticles';

export default function Scene() {
  return (
    <div className="absolute inset-0 z-10 w-full h-full">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
        {/* Transparent background so it blends with the site */}
        <ambientLight intensity={0.5} />
        
        {/* Render the divine ethereal image */}
        <DivineImage url="/premium-hero.png" />
        
        {/* Overlay the magical glowing particles */}
        <LuxuryParticles />
        
      </Canvas>
    </div>
  );
}
