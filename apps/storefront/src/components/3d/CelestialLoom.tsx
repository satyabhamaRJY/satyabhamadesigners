'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { ScrollCamera } from './ScrollCamera';
import { ParijataParticles } from './ParijataParticles';
import { SilkSareeMesh } from './SilkSareeMesh';

export function CelestialLoom() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffd700" />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#ffffff" />
        
        {/* ScrollControls automatically creates a scrollable HTML overlay and provides scroll offset to its children */}
        <ScrollControls pages={5} damping={0.1}>
          <ScrollCamera />
          
          <ParijataParticles />
          
          {/* Phase 2: The Threaded Carousel - Render Saree meshes down the Z-axis */}
          {/* Z = -10 */}
          <SilkSareeMesh 
            position={[0, 0, -10]} 
            imageUrl="/premium-hero.png"
            title="Kanjeevaram Crimson"
            subtitle="Gold dipped zari from Kanchipuram"
            price="₹1,85,000"
          />
          
          {/* Z = -20 */}
          <SilkSareeMesh 
            position={[-3, 0, -20]} 
            imageUrl="/clean-bg.jpg"
            title="Emerald Banarasi"
            subtitle="Real silver brocade from Varanasi"
            price="₹2,40,000"
          />

          {/* Z = -30 */}
          <SilkSareeMesh 
            position={[3, 0, -30]} 
            imageUrl="/img1.png"
            title="Golden Chanderi"
            subtitle="Sheer elegance from Madhya Pradesh"
            price="₹95,000"
          />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
